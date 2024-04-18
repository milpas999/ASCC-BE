var express = require("express");
var router = express.Router();

const {
  getUserGroup,
  addUserGroup,
  getUserGroupById,
  deleteUserGroupById,
  updateUserGroup,
  changeStatusUserGroup,
} = require("./../../controller/userGroup.controller");

router.get("/", getUserGroup);
router.get("/:userGroupId", getUserGroupById);
router.delete("/:userGroupId", deleteUserGroupById);
router.put("/:userGroupId", updateUserGroup);
router.post("/", addUserGroup);

router.patch("/change-status/:userGroupId/:status", changeStatusUserGroup);

module.exports = router;
