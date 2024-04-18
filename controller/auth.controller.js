const _ = require("lodash");
const { sendJsonResponse } = require("./../config/helper/renderer");

const {
  registerUser: registerAuthUser,
  getUserByMobileNumber,
  registerFCMTokenService,
  registerAuthTokenService,
} = require("./../dbService/auth.service");
const { getRawJson } = require("../config/helper/utility");

/**
 * Registers a new user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @returns {Promise}
 */
exports.registerUser = async (req, res, next) => {
  try {
    const {
      body: { mobileNumber, password, name, email },
    } = req;

    const objParams = { mobileNumber, password, name, email };

    const existingUser = await getUserByMobileNumber(mobileNumber);

    if (!_.isEmpty(existingUser)) {
      throw new Error("User with same mobile already exists");
    }

    const data = await registerAuthUser(objParams);

    sendJsonResponse(req, res, 200, data, true, "User registered successfully");
  } catch (error) {
    sendJsonResponse(req, res, 400, {}, false, error.message);
  }
};

/**
 * Logs in a user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * This function:
 * - Gets the mobileNumber and password from the request body
 * - Finds the user by mobileNumber
 * - Verifies the password
 * - Generates a JWT token
 * - Sends a successful response with the token if login succeeds, else sends error
 */
exports.loginUser = async (req, res, next) => {
  try {
    const {
      body: { mobileNumber, password },
    } = req;
    const existingUser = await getUserByMobileNumber(mobileNumber);
    if (_.isEmpty(existingUser)) {
      throw new Error("User with same mobile not found");
    }
    const flagPasswordVerified = await existingUser.validPassword(password);
    if (!flagPasswordVerified) {
      throw new Error("Invalid Password");
    }
    const apiToken = await existingUser.genToken();
    let rawUser = await getRawJson(existingUser);

    delete rawUser.password;
    rawUser.apiToken = apiToken;

    sendJsonResponse(
      req,
      res,
      200,
      rawUser,
      true,
      "User logged in successfully"
    );
  } catch (error) {
    sendJsonResponse(req, res, 400, {}, false, error.message);
  }
};

/**
 * Registers a Firebase Cloud Messaging (FCM) token for a user.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.fcmToken - FCM token to register
 * @param {string} req.body.guuid - Globally unique user ID
 * @param {Object} res - Express response object
 *
 * @returns {Promise}
 */
exports.registerFCMToken = async (req, res, next) => {
  try {
    const {
      body: { fcmToken, guuid },
    } = req;

    const objParams = { fcmToken, guuid };
    const data = await registerFCMTokenService(objParams);

    sendJsonResponse(
      req,
      res,
      200,
      data,
      true,
      "Token registered successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 400, {}, false, error.message);
  }
};

exports.registerAuthToken = async (req, res, next) => {
  try {
    const {
      body: { userId, authToken, guuid },
    } = req;

    const objParams = { userId, authToken, guuid };
    const data = await registerAuthTokenService(objParams);

    sendJsonResponse(
      req,
      res,
      200,
      data,
      true,
      "Auth Token registered successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 400, {}, false, error.message);
  }
};

exports.getLoggedInUserDetail = async (req, res, next) => {
  try {
    const { loggedInUserInfo } = req;

    if (!_.isEmpty(loggedInUserInfo)) {
      delete loggedInUserInfo.password;
    }

    sendJsonResponse(
      req,
      res,
      200,
      loggedInUserInfo,
      true,
      "loggedin user data"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 400, {}, false, error.message);
  }
};
