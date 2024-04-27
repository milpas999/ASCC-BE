const _ = require("lodash");
const { sendJsonResponse } = require("../config/helper/renderer");
const { CustomError } = require("../config/helper/customError");
const {
  addEmployeeData,
  getUserByMobileNumber,
  getEmployeeData,
  deleteEmployeeData,
  getUserByMobileNumberNotThisUser,
  updateEmployeeData,
  updateEmployeeStatusData,
} = require("../dbService/employee.services");
const { getRawJson } = require("../config/helper/utility");
const {
  addImageDocVideoData,
  updateResourceWithImageDocVideo,
  deleteImageDocVideoData,
} = require("../dbService/imageDocVideo.services");

/**
 * Adds a new employee record to the database.
 *
 * Validates that the mobile number is unique. Hashes the password before saving.
 * Returns the new employee record without the password.
 *
 * @param {Object} req - The request object
 * @param {Object} req.body - The request body
 * @param {string} req.body.name - The employee name
 * @param {string} req.body.email - The employee email
 * @param {string} req.body.phone - The employee mobile number
 * @param {string} req.body.userGroupId - The employee user group ID
 * @param {string} req.body.address - The employee address
 * @param {string} req.body.dateOfJoining - The employee date of joining
 * @param {string} req.body.userProfileImageId - The employee profile image ID
 * @param {Object} res - The response object
 */
exports.addEmployee = async (req, res, next) => {
  try {
    const {
      body: {
        name,
        email,
        phone,
        userGroupId,
        address,
        permanentAddress,
        dateOfJoining,
        dob,
        anniversaryDate,
        userProfileImageId,
      },
    } = req;

    const objParams = {
      name,
      email,
      phone,
      userGroupId,
      address,
      permanentAddress,
      dateOfJoining,
      dob,
      anniversaryDate,
      userProfileImageId,
    };

    const existingData = await getUserByMobileNumber(phone);
    if (!_.isEmpty(existingData)) {
      throw new CustomError("User with same mobile found", 400);
    }

    const newEmployee = await addEmployeeData(objParams);

    if (userProfileImageId > 0) {
      await updateResourceWithImageDocVideo({
        imageDocVideoId: userProfileImageId,
        relatedId: newEmployee.id,
      });
    }

    const newEmployeeRaw = await getRawJson(newEmployee);

    delete newEmployeeRaw.password;

    sendJsonResponse(
      req,
      res,
      200,
      newEmployeeRaw,
      true,
      "Employee added successfully"
    );
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

/**
 * Updates employee data.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Employee name
 * @param {string} req.body.email - Employee email
 * @param {string} req.body.phone - Employee phone number
 * @param {string} req.body.userGroupId - Employee user group ID
 * @param {string} req.body.address - Employee address
 * @param {Date} req.body.dateOfJoining - Employee date of joining
 * @param {string} req.body.userProfileImageId - Employee profile image ID
 * @param {string} req.params.employeeId - Employee ID
 * @param {Object} res - Express response object
 * @returns {Promise}
 */
exports.updateEmployee = async (req, res, next) => {
  try {
    const {
      body: {
        name,
        email,
        phone,
        userGroupId,
        address,
        permanentAddress,
        dateOfJoining,
        dob,
        anniversaryDate,
        userProfileImageId,
      },
      params: { employeeId },
    } = req;

    const objParams = {
      employeeId,
      name,
      email,
      phone,
      userGroupId,
      address,
      permanentAddress,
      dateOfJoining,
      dob,
      anniversaryDate,
      userProfileImageId,
    };

    const anyOtherUserData = await getUserByMobileNumberNotThisUser(
      phone,
      employeeId
    );
    if (!_.isEmpty(anyOtherUserData)) {
      throw new CustomError("User with same mobile found", 400);
    }

    await updateEmployeeData(objParams);

    sendJsonResponse(req, res, 200, {}, true, "Employee updated successfully");
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

/**
 * Gets a list of all employees.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.getEmployee = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;
    console.log("filterParams ::::::::::: ", filterParams);
    const employeeListData = await getEmployeeData({ filterParams });
    sendJsonResponse(
      req,
      res,
      200,
      employeeListData,
      true,
      "Employee list fetched"
    );
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

/**
 * Gets employee data by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getEmployeeById = async (req, res, next) => {
  try {
    const {
      params: { employeeId },
    } = req;
    const employeeListData = await getEmployeeData({ employeeId });
    sendJsonResponse(
      req,
      res,
      200,
      employeeListData,
      true,
      "Employee data fetched"
    );
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

/**
 * Deletes an employee by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteEmployeeById = async (req, res, next) => {
  try {
    const {
      params: { employeeId },
    } = req;
    await deleteEmployeeData(employeeId);
    sendJsonResponse(req, res, 200, {}, true, "Employee deleted successfully");
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

/**
 * Updates the status of an employee by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateEmployeeStatus = async (req, res, next) => {
  try {
    const {
      params: { employeeId, status },
    } = req;
    await updateEmployeeStatusData(employeeId, status);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Employee status updated successfully"
    );
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

/**
 * Uploads an image for the employee with the given ID.
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.employeeId - The ID of the employee
 * @param {string} req.query.typeX - The type of image
 * @param {File} req.file - The image file to upload
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.uploadEmployeeImage = async (req, res, next) => {
  try {
    const {
      params: { employeeId },
      query: { typeX },
      file,
    } = req;

    const objParams = {
      relatedId: employeeId,
      typeX,
      uploadedFileData: file,
      resourceType: "EMP",
    };
    const imageDovVideoData = await addImageDocVideoData(objParams);
    sendJsonResponse(
      req,
      res,
      200,
      imageDovVideoData,
      true,
      "Employee image uploaded updated successfully"
    );
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

exports.deleteEmployeeImage = async (req, res, next) => {
  try {
    const {
      params: { employeeId, imageId },
    } = req;

    const objParams = {
      imgDocVdoId: imageId,
      relatedId: employeeId,
      typeX: "IMG",
      resourceType: "EMP",
    };
    const imageDovVideoData = await deleteImageDocVideoData(objParams);
    sendJsonResponse(
      req,
      res,
      200,
      imageDovVideoData,
      true,
      "Employee image deleted successfully"
    );
  } catch (error) {
    console.log("error 123 :: ", error);
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
