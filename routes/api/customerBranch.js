var express = require("express");

var router = express.Router();

const {
  addCustomer,
  getCustomer,
  getCustomerById,
  deleteCustomerById,
  updateCustomer,
  updateCustomerStatus,
  addCustomerBranchData,
  getCustomerBranch,
  getCustomerBranchById,
  updateCustomerBranch,
  deleteCustomerBranch,
  setDefaultCustomerBranch,
  addDepartment,
  getDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  addContactPerson,
  getContactPerson,
  getContactPersonById,
  updateContactPerson,
  deleteContactPerson,
  searchCustomerEntity,
} = require("../../controller/customerBranch.controller");

// customer API
router.post("/", addCustomer);
router.get("/", getCustomer);
router.get("/searchCustomerEntity/:searchParam", searchCustomerEntity);
router.get("/:customerId", getCustomerById);
router.delete("/:customerId", deleteCustomerById);
router.put("/:customerId", updateCustomer);
router.patch("/change-status/:customerId/:status", updateCustomerStatus);

// Contact person API
router.post("/contactPerson", addContactPerson);
router.get("/contactPerson/:referenceType/:referenceId", getContactPerson);
router.get("/contactPerson/:contactPersonId", getContactPersonById);
router.put("/contactPerson/:contactPersonId", updateContactPerson);
router.delete("/contactPerson/:contactPersonId", deleteContactPerson);
// router.patch(
//   "/contactPerson/set-default/:contactPersonId",
//   setDefaultCustomerBranch
// );

// branch API
router.post("/:customerId/branch", addCustomerBranchData);
router.get("/:customerId/branch", getCustomerBranch);
router.get("/:customerId/branch/:branchId", getCustomerBranchById);
router.put("/:customerId/branch/:branchId", updateCustomerBranch);
router.delete("/:customerId/branch/:branchId", deleteCustomerBranch);
router.patch(
  "/:customerId/branch/set-default/:branchId",
  setDefaultCustomerBranch
);

// department API
router.post("/:customerId/branch/:branchId/department", addDepartment);
router.get("/:customerId/branch/:branchId/department", getDepartment);
router.get(
  "/:customerId/branch/:branchId/department/:departmentId",
  getDepartmentById
);
router.put(
  "/:customerId/branch/:branchId/department/:departmentId",
  updateDepartment
);
router.delete(
  "/:customerId/branch/:branchId/department/:departmentId",
  deleteDepartment
);

module.exports = router;
