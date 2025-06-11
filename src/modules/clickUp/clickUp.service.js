const axios = require("axios");
const { clickUpConfig } = require("./config/config");
const ClickUpTask = require("./models/clickUpTask.model");
const ClickUpTaskRepository = require("./repositories/clickUpTask.repository");
const {
  NotFoundError,
  BadRequestError,
} = require("../../core/errors/repository.error");
const { convertDateToTimestamp } = require("../../utils/date.utils");

class ClickUpService {
  constructor(client, taskRepository) {
    this.client = client || this._createClient();
    this.taskRepository = taskRepository || new ClickUpTaskRepository();
  }

  _createClient() {
    return axios.create({
      baseURL: clickUpConfig.baseUrl,
      headers: {
        Authorization: clickUpConfig.apiKey,
        "Content-Type": "application/json",
      },
    });
  }

  async findAll() {
    try {
      const { data } = await this.client.get(
        `/list/${clickUpConfig.listId}/task`
      );

      if (!data.tasks) {
        throw new NotFoundError("Not have tasks");
      }

      const { tasks } = data;

      const savedTasks = await Promise.all(
        tasks.map(async (task) => {
          const doc = ClickUpTask.fromClickUpResponse(task);
          const savedTask = await this.taskRepository.setDoc(
            doc?.id,
            doc.toJSON()
          );
          return savedTask;
        })
      );

      return savedTasks;
    } catch (error) {
      const tasks = await this.taskRepository.findAll({});
      if (!tasks || tasks.length === 0) {
        throw new NotFoundError("No tasks found");
      }
      return tasks;
    }
  }

  async findOne(taskId) {
    if (!taskId) {
      throw new BadRequestError("Task id is required");
    }

    const { data } = await this.client.get(`/task/${taskId}`);

    if (!data) {
      throw new NotFoundError("Task not found");
    }

    const formattedTask = ClickUpTask.fromClickUpResponse(data);
    return formattedTask.toJSON();
  }

  async create(taskData) {
    if (!taskData.name) {
      throw new BadRequestError("Task name is required");
    }

    const taskPayload = {
      name: taskData.name,
      description: taskData.description || "",
      status: taskData.status || "to do",
      start_date: taskData.start_date
        ? convertDateToTimestamp(taskData.start_date)
        : null,
      due_date: taskData.due_date
        ? convertDateToTimestamp(taskData.due_date)
        : null,
    };

    const { data } = await this.client.post(
      `/list/${clickUpConfig.listId}/task`,
      taskPayload
    );

    if (!data) {
      throw new BadRequestError("error creating task");
    }

    const doc = ClickUpTask.fromClickUpResponse(data);
    const savedTask = await this.taskRepository.setDoc(doc?.id, doc.toJSON());

    return { id: savedTask.id };
  }

  async delete(taskId) {
    if (!taskId) {
      throw new BadRequestError("Task ID is required");
    }

    const task = await this.taskRepository.findById(taskId);

    if (task === null || task === undefined || !task) {
      throw new NotFoundError("Task not exist");
    }

    await this.taskRepository.delete(taskId);
    return { message: "Task deleted successfully" };
  }
}

module.exports = ClickUpService;
