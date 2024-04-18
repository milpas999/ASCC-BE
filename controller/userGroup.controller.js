const { sendJsonResponse } = require("../config/helper/renderer");
const {
  addUserGroupData,
  addUserGroupSystemModuleMapping,
  getUserGroupData,
  deleteUserGroupData,
  updateUserGroupData,
  changeStatusUserGroup,
} = require("../dbService/userGroup.service");

/**
 * Adds a new user group.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Name of user group
 * @param {string} req.body.description - Description of user group
 * @param {Array} req.body.arrSystemModules - Array of system modules for user group
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @returns {Promise<void>}
 */
exports.addUserGroup = async (req, res, next) => {
  try {
    const {
      body: { name, description, arrSystemModules },
    } = req;

    const objParams = { name, description, arrSystemModules };

    const userGroupData = await addUserGroupData(objParams);

    const objParamsForModuleOption = {
      userGroupId: userGroupData.id,
      arrSystemModules,
    };
    await addUserGroupSystemModuleMapping(objParamsForModuleOption);

    sendJsonResponse(
      req,
      res,
      200,
      userGroupData,
      true,
      "User Group added successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};

/**
 * Gets user group data.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserGroup = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;
    console.log("filterParams ::::::::::: ", filterParams);
    const userGroupData = await getUserGroupData({ filterParams });

    sendJsonResponse(
      req,
      res,
      200,
      userGroupData,
      true,
      "User Group data fetched successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};

/**
 * Gets user group data by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserGroupById = async (req, res, next) => {
  try {
    const {
      params: { userGroupId },
    } = req;

    const userGroupData = await getUserGroupData({ userGroupId });
    sendJsonResponse(
      req,
      res,
      200,
      userGroupData,
      true,
      "User Group data fetched successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};

/**
 * Deletes a user group by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteUserGroupById = async (req, res, next) => {
  try {
    const {
      params: { userGroupId },
    } = req;

    const userGroupData = await deleteUserGroupData(userGroupId);
    sendJsonResponse(
      req,
      res,
      200,
      userGroupData,
      true,
      "User Group deleted successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};

/**
 * Updates a user group by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateUserGroup = async (req, res, next) => {
  try {
    const {
      body: { name, description, arrSystemModules },
      params: { userGroupId },
    } = req;

    const objParams = { userGroupId, name, description, arrSystemModules };

    await updateUserGroupData(objParams);

    const objParamsForModuleOption = {
      userGroupId,
      arrSystemModules,
    };
    await addUserGroupSystemModuleMapping(objParamsForModuleOption);

    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "User Group updated successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};

exports.changeStatusUserGroup = async (req, res, next) => {
  try {
    const {
      params: { userGroupId, status },
    } = req;

    const objParams = { userGroupId, status };

    await changeStatusUserGroup(objParams);

    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "User Group status updated successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};
