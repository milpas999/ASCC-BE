var express = require("express");
var router = express.Router();

const {
  addEmployee,
  getEmployee,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  uploadEmployeeImage,
  deleteEmployeeImage,
} = require("../../controller/employee.controller");

const {
  // employeeProfilePicture,
  getMulterSettings,
} = require("../../config/helper/multerStorage");

router.post("/", addEmployee);
router.get("/", getEmployee);
router.get("/:employeeId", getEmployeeById);
router.delete("/:employeeId", deleteEmployeeById);
router.put("/:employeeId", updateEmployee);
router.patch("/change-status/:employeeId/:status", updateEmployeeStatus);
router.post(
  "/uploadImage/:employeeId",
  // employeeProfilePicture.single("employeeImage"),
  getMulterSettings("EMP").single("employeeImage"),
  uploadEmployeeImage
);
router.delete("/deleteImage/:employeeId/:imageId", deleteEmployeeImage);

module.exports = router;
