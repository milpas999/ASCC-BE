var express = require("express");
var router = express.Router();

const {
  addTaskCategory,
  getTaskCategoryList,
  getTaskCategoryById,
  deleteTaskCategoryById,
  updateTaskCategoryById,
} = require("../../controller/taskCategory.controller");

router.post("/", addTaskCategory);
router.get("/", getTaskCategoryList);
router.get("/:taskCategoryId", getTaskCategoryById);
router.delete("/:taskCategoryId", deleteTaskCategoryById);
router.put("/:taskCategoryId", updateTaskCategoryById);

module.exports = router;
