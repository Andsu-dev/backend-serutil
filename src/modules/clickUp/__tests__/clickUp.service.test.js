const ClickUpService = require("../clickUp.service");
const ClickUpTaskRepository = require("../repositories/clickUpTask.repository");
const ClickUpTask = require("../models/clickUpTask.model");
const {
  NotFoundError,
  BadRequestError,
} = require("../../../core/errors/repository.error");
const axios = require("axios");

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

jest.mock("../repositories/clickUpTask.repository");

jest.mock("../models/clickUpTask.model");

jest.mock("../config/config", () => ({
  clickUpConfig: {
    baseUrl: "https://api.clickup.com/api/v2",
    apiKey: "test-api-key",
    listId: "test-list-id",
  },
}));

jest.mock("../../../utils/date.utils", () => ({
  convertDateToTimestamp: jest.fn((date) => 1234567890),
}));

describe("ClickUpService", () => {
  let clickUpService;
  let mockTaskRepository;
  let mockAxios;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAxios = {
      get: jest.fn(),
      post: jest.fn(),
    };
    mockTaskRepository = {
      setDoc: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    axios.create.mockReturnValue(mockAxios);

    ClickUpTaskRepository.mockImplementation(() => mockTaskRepository);

    clickUpService = new ClickUpService();
  });

  describe("findAll", () => {
    it("should return all tasks successfully", async () => {
      const mockTasks = {
        tasks: [
          {
            id: "1",
            name: "Test Task 1",
            description: "Description 1",
            status: { status: "to do" },
            start_date: "1234567890",
            due_date: "1234567890",
          },
        ],
      };

      const mockFormattedTask = {
        id: "1",
        name: "Test Task 1",
        description: "Description 1",
        status: "to do",
        start_date: 1234567890,
        due_date: 1234567890,
        toJSON: () => ({
          id: "1",
          name: "Test Task 1",
          description: "Description 1",
          status: "to do",
          start_date: 1234567890,
          due_date: 1234567890,
        }),
      };

      mockAxios.get.mockResolvedValue({ data: mockTasks });

      ClickUpTask.fromClickUpResponse.mockReturnValue(mockFormattedTask);

      mockTaskRepository.setDoc.mockResolvedValue({
        id: "1",
        name: "Test Task 1",
        description: "Description 1",
        status: "to do",
        start_date: 1234567890,
        due_date: 1234567890,
      });

      const result = await clickUpService.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("id", "1");
      expect(result[0]).toHaveProperty("name", "Test Task 1");
      expect(mockAxios.get).toHaveBeenCalledWith("/list/test-list-id/task");
      expect(ClickUpTask.fromClickUpResponse).toHaveBeenCalledWith(
        mockTasks.tasks[0]
      );
      expect(mockTaskRepository.setDoc).toHaveBeenCalledWith(
        "1",
        mockFormattedTask.toJSON()
      );
    });

    it("should throw NotFoundError when no tasks are found", async () => {
      mockAxios.get.mockResolvedValue({ data: { tasks: null } });

      await expect(clickUpService.findAll()).rejects.toThrow(NotFoundError);
      expect(mockAxios.get).toHaveBeenCalledWith("/list/test-list-id/task");
    });

    it("should throw NotFoundError when tasks array is undefined", async () => {
      mockAxios.get.mockResolvedValue({ data: {} });

      await expect(clickUpService.findAll()).rejects.toThrow(NotFoundError);
      expect(mockAxios.get).toHaveBeenCalledWith("/list/test-list-id/task");
    });
  });

  describe("findOne", () => {
    it("should return a single task successfully", async () => {
      const mockTask = {
        id: "1",
        name: "Test Task",
        description: "Description",
        status: { status: "to do" },
        start_date: "1234567890",
        due_date: "1234567890",
      };

      const mockFormattedTask = {
        id: "1",
        name: "Test Task",
        description: "Description",
        status: "to do",
        start_date: 1234567890,
        due_date: 1234567890,
        toJSON: () => ({
          id: "1",
          name: "Test Task",
          description: "Description",
          status: "to do",
          start_date: 1234567890,
          due_date: 1234567890,
        }),
      };

      mockAxios.get.mockResolvedValue({ data: mockTask });

      ClickUpTask.fromClickUpResponse.mockReturnValue(mockFormattedTask);

      const result = await clickUpService.findOne("1");

      expect(result).toHaveProperty("id", "1");
      expect(result).toHaveProperty("name", "Test Task");
      expect(mockAxios.get).toHaveBeenCalledWith("/task/1");
      expect(ClickUpTask.fromClickUpResponse).toHaveBeenCalledWith(mockTask);
    });

    it("should throw BadRequestError when taskId is not provided", async () => {
      await expect(clickUpService.findOne()).rejects.toThrow(BadRequestError);
      await expect(clickUpService.findOne(null)).rejects.toThrow(
        BadRequestError
      );
      await expect(clickUpService.findOne("")).rejects.toThrow(BadRequestError);
    });

    it("should throw NotFoundError when task is not found", async () => {
      mockAxios.get.mockResolvedValue({ data: null });

      await expect(clickUpService.findOne("1")).rejects.toThrow(NotFoundError);
      expect(mockAxios.get).toHaveBeenCalledWith("/task/1");
    });
  });

  describe("create", () => {
    it("should create a task successfully", async () => {
      const taskData = {
        name: "New Task",
        description: "New Description",
        status: "to do",
        start_date: "2024-03-20",
        due_date: "2024-03-21",
      };

      const mockResponse = {
        id: "1",
        name: "New Task",
        description: "New Description",
        status: { status: "to do" },
        start_date: "1234567890",
        due_date: "1234567890",
      };

      const mockFormattedTask = {
        id: "1",
        name: "New Task",
        description: "New Description",
        status: "to do",
        start_date: 1234567890,
        due_date: 1234567890,
        toJSON: () => ({
          id: "1",
          name: "New Task",
          description: "New Description",
          status: "to do",
          start_date: 1234567890,
          due_date: 1234567890,
        }),
      };

      mockAxios.post.mockResolvedValue({ data: mockResponse });

      ClickUpTask.fromClickUpResponse.mockReturnValue(mockFormattedTask);

      mockTaskRepository.setDoc.mockResolvedValue({ id: "1" });

      const result = await clickUpService.create(taskData);

      expect(result).toHaveProperty("id", "1");
      expect(mockAxios.post).toHaveBeenCalledWith("/list/test-list-id/task", {
        name: "New Task",
        description: "New Description",
        status: "to do",
        start_date: 1234567890,
        due_date: 1234567890,
      });
      expect(ClickUpTask.fromClickUpResponse).toHaveBeenCalledWith(
        mockResponse
      );
      expect(mockTaskRepository.setDoc).toHaveBeenCalledWith(
        "1",
        mockFormattedTask.toJSON()
      );
    });

    it("should create a task with minimal data", async () => {
      const taskData = {
        name: "New Task",
      };

      const mockResponse = {
        id: "1",
        name: "New Task",
        description: "",
        status: { status: "to do" },
      };

      const mockFormattedTask = {
        id: "1",
        name: "New Task",
        description: "",
        status: "to do",
        toJSON: () => ({
          id: "1",
          name: "New Task",
          description: "",
          status: "to do",
        }),
      };

      mockAxios.post.mockResolvedValue({ data: mockResponse });
      ClickUpTask.fromClickUpResponse.mockReturnValue(mockFormattedTask);
      mockTaskRepository.setDoc.mockResolvedValue({ id: "1" });

      const result = await clickUpService.create(taskData);

      expect(result).toHaveProperty("id", "1");
      expect(mockAxios.post).toHaveBeenCalledWith("/list/test-list-id/task", {
        name: "New Task",
        description: "",
        status: "to do",
        start_date: null,
        due_date: null,
      });
    });

    it("should throw BadRequestError when name is not provided", async () => {
      const taskData = {
        description: "New Description",
      };

      await expect(clickUpService.create(taskData)).rejects.toThrow(
        BadRequestError
      );
      await expect(clickUpService.create({})).rejects.toThrow(BadRequestError);
      await expect(clickUpService.create({ name: "" })).rejects.toThrow(
        BadRequestError
      );
    });

    it("should throw BadRequestError when task creation fails", async () => {
      const taskData = {
        name: "New Task",
      };

      mockAxios.post.mockResolvedValue({ data: null });

      await expect(clickUpService.create(taskData)).rejects.toThrow(
        BadRequestError
      );
      expect(mockAxios.post).toHaveBeenCalledWith(
        "/list/test-list-id/task",
        expect.any(Object)
      );
    });
  });

  describe("delete", () => {
    it("should delete a task successfully", async () => {
      mockTaskRepository.findById.mockResolvedValue({ id: "1" });
      mockTaskRepository.delete.mockResolvedValue();

      const result = await clickUpService.delete("1");

      expect(result).toHaveProperty("message", "Task deleted successfully");
      expect(mockTaskRepository.findById).toHaveBeenCalledWith("1");
      expect(mockTaskRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw BadRequestError when taskId is not provided", async () => {
      await expect(clickUpService.delete()).rejects.toThrow(BadRequestError);
      await expect(clickUpService.delete(null)).rejects.toThrow(
        BadRequestError
      );
      await expect(clickUpService.delete("")).rejects.toThrow(BadRequestError);
    });

    it("should throw NotFoundError when task is not found", async () => {
      mockTaskRepository.findById.mockResolvedValue(undefined);

      await expect(clickUpService.delete("1")).rejects.toThrow(NotFoundError);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError when findById returns null", async () => {
      jest.clearAllMocks();

      mockTaskRepository.findById.mockResolvedValue(null);

      const testResult = await mockTaskRepository.findById("1");
      expect(testResult).toBeNull();

      await expect(clickUpService.delete("1")).rejects.toThrow(NotFoundError);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith("1");
    });

    it("should handle falsy values correctly", async () => {
      const falsyValues = [null, undefined, false, 0, "", NaN];

      for (const value of falsyValues) {
        mockTaskRepository.findById.mockResolvedValue(value);

        await expect(clickUpService.delete("test")).rejects.toThrow(
          NotFoundError
        );
        expect(mockTaskRepository.findById).toHaveBeenCalledWith("test");

        jest.clearAllMocks();
      }
    });
  });
});
