const ClickUpService = require("./clickUp.service");
const asyncHandler = require("../../utils/asyncHandler");

class ClickUpController {
  constructor() {
    this.clickUpService = new ClickUpService();
  }

  findAll = asyncHandler(async (req, res) => {
    const tasks = await this.clickUpService.findAll();
    return res.json(tasks);
  });

  findOne = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const result = await this.clickUpService.findOne(taskId);
    return res.json(result);
  });

  create = asyncHandler(async (req, res) => {
    const taskData = req.body;
    const payload = await this.clickUpService.create(taskData);
    return res.json(payload);
  });

  delete = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const result = await this.clickUpService.delete(taskId);
    return res.json(result);
  });
}

module.exports = ClickUpController;
