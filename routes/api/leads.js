var express = require("express");
const {
  createLeadsCustomer,
  getLeadsCustomer,
  createLeads,
  getLeads,
  getLeadsById,
  updateLeadStatus,
  deleteLeadsById,
  updateLeadsById,
} = require("../../controller/leads.controller");

var router = express.Router();

router.post("/leadsCustomer", createLeadsCustomer);
router.get("/leadsCustomer", getLeadsCustomer);

router.post("/", createLeads);
router.get("/", getLeads);
router.get("/:leadId", getLeadsById);
router.delete("/:leadId", deleteLeadsById);
router.put("/:leadId", updateLeadsById);
router.patch("/change-status/:leadId/:status", updateLeadStatus);

module.exports = router;
