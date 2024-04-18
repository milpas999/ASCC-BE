var express = require("express");
var router = express.Router();

const {
  registerUser,
  loginUser,
  registerFCMToken,
  registerAuthToken,
  getLoggedInUserDetail,
} = require("./../../controller/auth.controller");

const { loginCheck } = require("../../config/middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/registerFCMToken", registerFCMToken);
router.post("/registerAuthToken", registerAuthToken);
router.get("/getLoggedInUserDetail", loginCheck, getLoggedInUserDetail);

module.exports = router;
