const { sendJsonResponse } = require("../config/helper/renderer");
const {
  addSystemModuleData,
  addModuleOptionForSystemModuleData,
  getSystemModuleData,
  updateSystemModuleData,
  updateModuleOptionForSystemModuleData,
  deleteSystemModuleData,
  changeStatusSystemModuleData,
} = require("../dbService/systemModule.service");

/**
 * Gets a system module by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @returns {Promise}
 */
exports.getSystemModuleById = async (req, res, next) => {
  try {
    const {
      params: { systemModuleId },
    } = req;
    const moduleSystemData = await getSystemModuleData({ systemModuleId });
    sendJsonResponse(
      req,
      res,
      200,
      moduleSystemData,
      true,
      "System module data retrieved successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};

/**
 * Gets the system module.
 *
 * This is an async controller function that gets the system module.
 * It logs the request, sends a 200 success response with data,
 * and catches any errors, logging them and sending a 500 response.
 */
exports.getSystemModule = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;

    const moduleSystemData = await getSystemModuleData({ filterParams });
    sendJsonResponse(
      req,
      res,
      200,
      moduleSystemData,
      true,
      "System module data retrieved successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};

/**
 * Adds a new system module to the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * The request body should contain:
 * - name {String} - Name of the system module
 * - moduleOption {String} - Module option for the system module
 * - description {String} - Description of the system module
 *
 * The function calls data access functions to insert the new system module into the database.
 * It also handles any errors and sends the appropriate response.
 */
exports.addSystemModule = async (req, res, next) => {
  try {
    const {
      body: { name, moduleOption, description },
    } = req;

    const objParams = { name, moduleOption, description };

    const systemModuleData = await addSystemModuleData(objParams);

    const objParamsForModuleOption = {
      systemModuleName: systemModuleData.name,
      systemModuleId: systemModuleData.id,
      moduleOption,
    };
    await addModuleOptionForSystemModuleData(objParamsForModuleOption);

    sendJsonResponse(
      req,
      res,
      200,
      systemModuleData,
      true,
      "System Module added successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};

/**
 * Updates an existing system module in the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * The request body should contain:
 * - name {String} - Updated name of the system module
 * - moduleOption {String} - Updated module option
 * - description {String} - Updated description
 * - deletedModuleOption {String} - Module option to delete
 *
 * The request params should contain:
 * - systemModuleId {Number} - ID of the system module to update
 *
 * Calls data access functions to update the system module in the DB.
 * Handles errors and sends appropriate response.
 */
exports.updateSystemModule = async (req, res, next) => {
  try {
    const {
      body: { name, moduleOption, description, deletedModuleOption },
      params: { systemModuleId },
    } = req;

    const objParams = { systemModuleId, name, moduleOption, description };

    const updatedSystemModuleData = await updateSystemModuleData(objParams);

    console.log("updatedSystemModuleData :: ", updatedSystemModuleData);

    const objParamsForModuleOption = {
      systemModuleName: name,
      systemModuleId: systemModuleId,
      deletedModuleOption: deletedModuleOption.split(","),
      moduleOption,
    };
    console.log(
      "objParamsForModuleOption ::::::::: ",
      objParamsForModuleOption
    );
    await updateModuleOptionForSystemModuleData(objParamsForModuleOption);

    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "System Module updated successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};

/**
 * Deletes a system module.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * The request params should contain:
 * - systemModuleId {Number} - ID of the system module to delete
 *
 * Calls data access function to delete the system module from the DB.
 * Handles errors and sends appropriate response.
 */
exports.deleteSystemModule = async (req, res, next) => {
  try {
    const {
      params: { systemModuleId },
    } = req;

    await deleteSystemModuleData(systemModuleId);

    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "System Module deleted successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};

/**
 * Updates the status of a system module.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * The request params should contain:
 * - systemModuleId {Number} - ID of the system module to update
 * - status {String} - New status for the system module
 *
 * Calls data access function to update the status in the DB.
 * Handles errors and sends appropriate response.
 */
exports.changeStatusSystemModule = async (req, res, next) => {
  try {
    const {
      params: { systemModuleId, status },
    } = req;

    const objParams = { systemModuleId, status };

    await changeStatusSystemModuleData(objParams);

    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "System Module status updated successfully"
    );
  } catch (error) {
    console.log("error :: ", error);
    sendJsonResponse(req, res, 500, {}, false, error.message);
  }
};
