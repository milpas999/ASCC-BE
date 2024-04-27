var express = require("express");
var router = express.Router();

const authRouter = require("./auth");
const systemModuleRouter = require("./systemModule");
const UserGroupRouter = require("./UserGroup");
const employeeRouter = require("./employee");
const brandRouter = require("./brand");
const categoryRouter = require("./category");

const { loginCheck } = require("../../config/middleware");

router.use("/auth", authRouter);
router.use("/system-module", loginCheck, systemModuleRouter);
router.use("/user-group", loginCheck, UserGroupRouter);
router.use("/employee", loginCheck, employeeRouter);
router.use("/brand", loginCheck, brandRouter);
router.use("/category", loginCheck, categoryRouter);

module.exports = router;
