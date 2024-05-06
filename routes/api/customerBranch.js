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
} = require("../../controller/customerBranch.controller");

// customer API
router.post("/", addCustomer);
router.get("/", getCustomer);
router.get("/:customerId", getCustomerById);
router.delete("/:customerId", deleteCustomerById);
router.put("/:customerId", updateCustomer);
router.patch("/change-status/:customerId/:status", updateCustomerStatus);

// branch API
router.post("/:customerId/branch", addCustomerBranchData);
router.get("/:customerId/branch", getCustomerBranch);
router.get("/:customerId/branch/:branchId", getCustomerBranchById);
router.put("/:customerId/branch/:branchId", updateCustomerBranch);
router.delete("/:customerId/branch/:branchId", deleteCustomerBranch);
router.patch("/:customerId/branch/set-default/:branchId", setDefaultCustomerBranch);

module.exports = router;
