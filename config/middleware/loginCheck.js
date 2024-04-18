const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { sendJsonResponse } = require("../helper/renderer");
const { CustomError } = require("../helper/customError");
const jwtOPTIONS = require("../jwtOptions.json");
const { getUserById } = require("../../dbService/auth.service");
const { getRawJson } = require("../helper/utility");

exports.loginCheck = async (req, res, next) => {
  try {
    const {
      headers: { authorization },
    } = req;

    if (_.isEmpty(authorization)) {
      throw new CustomError("Authorization token is missing", 401);
    }

    const decodedData = await jwt.verify(authorization, jwtOPTIONS.secretOrKey);

    const { id } = decodedData;

    const userData = await getUserById(id);
    const rawUserData = await getRawJson(userData);

    if (_.isEmpty(rawUserData)) {
      throw new CustomError("Logged in user data not found", 401);
    }

    if (rawUserData.status != "A") {
      throw new CustomError(
        "User is not active, Please contact administrator",
        401
      );
    }

    req.loggedInUserInfo = rawUserData;
    next();
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(
      req,
      res,
      error.statusCode || 500,
      {},
      false,
      error.message
    );
  }
};
