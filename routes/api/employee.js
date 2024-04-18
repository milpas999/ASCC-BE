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
} = require("../../controller/employee.controller");

const { employeeProfilePicture } = require("../../config/helper/multerStorage");

router.post("/", addEmployee);
router.get("/", getEmployee);
router.get("/:employeeId", getEmployeeById);
router.delete("/:employeeId", deleteEmployeeById);
router.put("/:employeeId", updateEmployee);
router.patch("/change-status/:employeeId/:status", updateEmployeeStatus);
router.post(
  "/uploadImage/:employeeId",
  employeeProfilePicture.single("employeeImage"),
  uploadEmployeeImage
);

module.exports = router;
