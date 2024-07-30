var express = require("express");
var router = express.Router();

const {
  getTaskList,
  createTask,
  getTaskById,
  updateTask,
  changeTaskStatus,
  deleteTask,
  getTaskHistory,
} = require("../../controller/tasks.controller");

router.get("/", getTaskList);
router.get("/getTaskHistory/:taskId", getTaskHistory);
router.get("/:taskId", getTaskById);
router.post("/", createTask);
router.put("/:taskId", updateTask);
router.patch("/change-status/:taskId/:status", changeTaskStatus);
router.delete("/:taskId", deleteTask);

module.exports = router;
