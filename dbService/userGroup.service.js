const _ = require("lodash");

const {
  UserGroup,
  UserGroupSystemModuleMapping,
  Sequelize,
  SystemModules,
  ModuleOptions,
} = require("./../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { deleteOperation } = require("../config/helper/db-utility");
const { Op } = require("sequelize");

/**
 * Adds a new user group record to the database.
 *
 * @param {Object} objParams - Object containing the user group details.
 * @param {string} objParams.name - Name of the user group.
 * @param {string} objParams.description - Description for the user group.
 *
 * @returns {Promise} Promise that resolves to the created user group object.
 */
exports.addUserGroupData = async (objParams) => {
  try {
    const { name, description } = objParams;

    const data = await UserGroup.create({
      name,
      description,
    });

    return data;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Updates an existing user group record in the database.
 *
 * @param {Object} objParams - Object containing the user group details to update.
 * @param {number} objParams.userGroupId - ID of the user group to update.
 * @param {string} objParams.name - Updated name for the user group.
 * @param {string} objParams.description - Updated description for the user group.
 *
 * @returns {Promise} Promise that resolves to the number of rows updated.
 */
exports.updateUserGroupData = async (objParams) => {
  try {
    const { userGroupId, name, description } = objParams;

    const data = await UserGroup.update(
      {
        name,
        description,
      },
      {
        where: {
          id: userGroupId,
        },
      }
    );

    return data;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Adds mapping records between a user group and system modules.
 *
 * @param {Object} objParams - Object containing mapping details.
 * @param {number} objParams.userGroupId - ID of the user group.
 * @param {Array} objParams.arrSystemModules - Array of system module objects.
 * @returns {Promise} Promise that resolves to the created mapping records.
 */
exports.addUserGroupSystemModuleMapping = async (objParams) => {
  try {
    const { userGroupId, arrSystemModules } = objParams;

    // delete all previous values
    await UserGroupSystemModuleMapping.destroy({
      where: {
        userGroupId,
      },
    });

    let arrUserGroupSystemModuleMapping = [];
    for (let i = 0; i < arrSystemModules.length; i++) {
      const systemModuleId = arrSystemModules[i].systemModuleId;
      const systemModuleValue = arrSystemModules[i].checked;
      const arrModuleOptions = arrSystemModules[i].arrModuleOptions;

      for (let j = 0; j < arrModuleOptions.length; j++) {
        const moduleOptionId = arrModuleOptions[j].moduleOptionId;
        const moduleOptionValue = arrModuleOptions[j].checked;

        arrUserGroupSystemModuleMapping.push({
          userGroupId,
          systemModuleId,
          systemModuleValue,
          moduleOptionId,
          moduleOptionValue,
        });
      }
    }

    const data = await UserGroupSystemModuleMapping.bulkCreate(
      arrUserGroupSystemModuleMapping
    );

    return data;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Gets user group data.
 *
 * @returns {Promise} Promise that resolves to user group data including mappings.
 */
exports.getUserGroupData = async (objParams = {}) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: { name = "", status = "" } = {},
      } = { pagination: {}, filter: {} },
      userGroupId,
    } = objParams || {};

    // const { userGroupId, status } = objParams;

    let userGroupWhere = {};

    if (!_.isEmpty(userGroupId)) {
      userGroupWhere.id = userGroupId;
    }

    if (!_.isEmpty(status)) {
      userGroupWhere.status = status;
    }

    if (!_.isEmpty(name)) {
      userGroupWhere.name = {
        [Op.like]: `%${name}%`,
      };
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

    const data = await UserGroup.findAll({
      where: {
        ...userGroupWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      include: [
        {
          model: UserGroupSystemModuleMapping,
          as: "arrUserGroupSystemModuleMapping",
          include: [
            {
              model: SystemModules,
              as: "systemModuleInfo",
            },
            {
              model: ModuleOptions,
              as: "moduleOptionsInfo",
            },
          ],
          required: false,
        },
      ],
      order: [[sorterField, sorterOrder]],
    });

    const dataCount = await UserGroup.count({
      where: { ...userGroupWhere, ...deleteOperation() },
    });

    return { data, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Soft deletes a user group by setting its end effective date to the current date time.
 *
 * @param {number} userGroupId - The ID of the user group to delete.
 * @returns {Promise<boolean>} Promise that resolves to true if successful.
 */
exports.deleteUserGroupData = async (userGroupId) => {
  try {
    const currentDateTime = getCurrentDateTime();

    await UserGroup.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: userGroupId,
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
 * Toggles the status of a user group between active and inactive by updating
 * the status field.
 *
 * @param {Object} objParams - The parameters.
 * @param {number} objParams.userGroupId - The ID of the user group.
 * @param {string} objParams.status - The status to toggle to.
 * @returns {Promise<boolean>} Promise that resolves to true if successful.
 */
exports.changeStatusUserGroup = async (objParams) => {
  try {
    const { userGroupId, status } = objParams;

    await UserGroup.update(
      {
        status: status === "A" ? "I" : "A",
      },
      {
        where: {
          id: userGroupId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};
