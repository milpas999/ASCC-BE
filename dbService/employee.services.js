const _ = require("lodash");
const slugify = require("slugify");

const { Users } = require("./../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { deleteOperation } = require("../config/helper/db-utility");
const { Op } = require("sequelize");
const { getRawJson } = require("../config/helper/utility");
const { getImageDocVideoData } = require("./imageDocVideo.services");

/**
 * Adds a new employee record to the database.
 *
 * @param {Object} objParams - Object containing employee details
 * @param {string} objParams.name - Employee name
 * @param {string} objParams.email - Employee email
 * @param {string} objParams.phone - Employee phone number
 * @param {string} objParams.userGroupId - Employee's user group ID
 * @param {string} objParams.address - Employee address
 * @param {Date} objParams.dateOfJoining - Employee date of joining
 * @param {string} objParams.userProfileImageId - Employee profile image ID
 *
 * @returns {Promise<User>} Promise resolving to the new employee User instance
 *
 * @throws {Error} Any error encountered while creating employee
 */
exports.addEmployeeData = async (objParams) => {
  try {
    const {
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
    } = objParams;

    const userData = await Users.create({
      name,
      email,
      mobileNumber: phone,
      userGroupId,
      address,
      permanentAddress,
      dateOfJoining,
      dob,
      anniversaryDate,
      profileImageId: userProfileImageId,
    });

    const hashedPassword = userData.generateHash("123123");

    userData.password = hashedPassword;

    await userData.save();

    return userData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Gets a user by their mobile number.
 *
 * @param {string} mobileNumber - The mobile number of the user to find.
 * @returns {Promise<User|Error>} A promise that resolves to the found user or rejects with an error.
 */
exports.getUserByMobileNumber = async (mobileNumber) => {
  try {
    const user = await Users.findOne({
      where: {
        mobileNumber,
      },
    });

    return user;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

/**
 * Gets employee data by ID and status.
 *
 * @param {Object} objParams - The parameters.
 * @param {number} [objParams.employeeId] - The employee ID to filter by.
 * @param {string} [objParams.status] - The status to filter by.
 * @returns {Promise<Array>} A promise that resolves to the array of employee data.
 */
exports.getEmployeeData = async (objParams = {}) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: {
          name = "",
          mobileNumber = "",
          email = "",
          userGroup = "",
          status = "",
        } = {},
      } = { pagination: {}, filter: {} },
      employeeId,
    } = objParams || {};

    // const { employeeId, status } = objParams;

    let employeeDataWhere = {};

    if (!_.isEmpty(employeeId)) {
      employeeDataWhere.id = employeeId;
    }

    if (!_.isEmpty(status)) {
      employeeDataWhere.status = status;
    }

    if (!_.isEmpty(name)) {
      employeeDataWhere.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (!_.isEmpty(mobileNumber)) {
      employeeDataWhere.mobileNumber = {
        [Op.like]: `%${mobileNumber}%`,
      };
    }

    if (!_.isEmpty(email)) {
      employeeDataWhere.email = {
        [Op.like]: `%${email}%`,
      };
    }

    if (!_.isEmpty(userGroup)) {
      employeeDataWhere.userGroupId = userGroup;
    }

    let sorterField = "id";
    let sorterOrder = "ASC";

    if (!_.isEmpty(table) && !_.isEmpty(table.sorter)) {
      const { column = [], order = "ascend", field = "name" } = table.sorter;
      // const sorterColumn = _.head(column);
      sorterOrder = order === "ascend" ? "ASC" : "DESC";
      sorterField = field;
    }
    const offset = (current - 1) * pageSize;

    let employeeListData = await Users.findAll({
      where: {
        ...employeeDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    let arrTransformedData = [];
    for (let i = 0; i < employeeListData.length; i++) {
      const tmpEmployeeData = await getRawJson(employeeListData[i]);
      let imageRelatedData = await getImageDocVideoData({
        relatedId: tmpEmployeeData.id,
        typeX: "IMG",
        resourceType: "EMP",
      });
      for (let j = 0; j < imageRelatedData.length; j++) {
        const tmpImageData = await getRawJson(imageRelatedData[j]);
        imageRelatedData[j] = tmpImageData;
      }
      const objReturn = { ...tmpEmployeeData, imageRelatedData };
      arrTransformedData.push(objReturn);
    }

    const dataCount = await Users.count({
      where: { ...employeeDataWhere, ...deleteOperation() },
    });

    return { data: arrTransformedData, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Deletes an employee record by ID.
 *
 * Sets the end date to the current date/time to soft delete.
 *
 * @param {number} employeeId - The ID of the employee to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if successful.
 */
exports.deleteEmployeeData = async (employeeId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    const user = await Users.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: employeeId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

/**
 * Gets user data for the user with the given mobile number,
 * excluding the user with the given employee ID.
 *
 * @param {string} mobileNumber - The mobile number to search for
 * @param {number} employeeId - The employee ID to exclude
 * @returns {Promise<Object[]>} Promise resolving to array of user objects
 */

exports.getUserByMobileNumberNotThisUser = async (mobileNumber, employeeId) => {
  try {
    const employeeListData = await Users.findAll({
      where: {
        id: employeeId,
        mobileNumber: {
          [Op.not]: mobileNumber,
        },
        ...deleteOperation(),
      },
    });

    return employeeListData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Updates employee data in the database.
 *
 * @param {Object} objParams - Object containing employee data to update
 * @param {number} employeeId - Employee ID of user to update
 * @param {string} name - Updated name
 * @param {string} email - Updated email
 * @param {string} phone - Updated phone number
 * @param {number} userGroupId - Updated user group ID
 * @param {string} address - Updated address
 * @param {Date} dateOfJoining - Updated date of joining
 * @param {number} userProfileImageId - Updated profile image ID
 * @returns {Promise<boolean>} Promise resolving to true if update succeeded
 */
exports.updateEmployeeData = async (objParams) => {
  try {
    const {
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
    } = objParams;

    await Users.update(
      {
        name,
        email,
        mobileNumber: phone,
        userGroupId,
        address,
        permanentAddress,
        dateOfJoining,
        dob,
        anniversaryDate,
        profileImageId: userProfileImageId,
      },
      {
        where: {
          id: employeeId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Updates the status of an employee in the database.
 *
 * @param {number} employeeId - ID of the employee to update
 * @param {string} status - New status, either 'A' for active or 'I' for inactive
 */
exports.updateEmployeeStatusData = async (employeeId, status) => {
  try {
    await Users.update(
      {
        status: status === "A" ? "I" : "A",
      },
      {
        where: {
          id: employeeId,
        },
      }
    );
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};
