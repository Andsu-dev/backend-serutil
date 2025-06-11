const express = require("express");
const ClickUpController = require("../clickUp.controller");
const asyncHandler = require("../../../utils/asyncHandler");
const router = express.Router();

const clickUpController = new ClickUpController();

router.get("/", asyncHandler(clickUpController.findAll));
router.post("/", asyncHandler(clickUpController.create));
router.get("/:taskId", asyncHandler(clickUpController.findOne));
router.delete("/:taskId", asyncHandler(clickUpController.delete));

module.exports = router;
