var express = require("express");
var router = express.Router();

const {
  getSystemModule,
  addSystemModule,
  getSystemModuleById,
  updateSystemModule,
  deleteSystemModule,
  changeStatusSystemModule,
} = require("./../../controller/systemModule.controller");

router.get("/", getSystemModule);
router.get("/:systemModuleId", getSystemModuleById);
router.post("/", addSystemModule);
router.put("/:systemModuleId", updateSystemModule);
router.delete("/:systemModuleId", deleteSystemModule);
router.patch(
  "/change-status/:systemModuleId/:status",
  changeStatusSystemModule
);

module.exports = router;
