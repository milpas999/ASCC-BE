var express = require("express");
var router = express.Router();

const {
  addCategory,
  getCategory,
  getCategoryById,
  deleteCategoryById,
  updateCategory,
  updateCategoryStatus,
} = require("../../controller/category.controller");

router.post("/", addCategory);
router.get("/", getCategory);
router.get("/:categoryId", getCategoryById);
router.delete("/:categoryId", deleteCategoryById);
router.put("/:categoryId", updateCategory);
router.patch("/change-status/:categoryId/:status", updateCategoryStatus);

module.exports = router;
