const _ = require("lodash");
const slugify = require("slugify");

const { SystemModules, ModuleOptions } = require("./../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { deleteOperation } = require("../config/helper/db-utility");
const { Op } = require("sequelize");

/**
 * Gets system module data based on the provided parameters.
 *
 * @param {Object} objParams - Object containing:
 * - systemModuleId - ID of the system module to get
 * - status - Status of the system module to get
 *
 * @returns {Promise} Promise that resolves to the system module data.
 */
exports.getSystemModuleData = async (objParams = {}) => {
  try {
    
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: { name = "", status = "" } = {},
      } = { pagination: {}, filter: {} },
      systemModuleId,
    } = objParams || {};

    let systemModuleWhere = {};

    if (!_.isEmpty(systemModuleId)) {
      systemModuleWhere.id = systemModuleId;
    }

    if (!_.isEmpty(status)) {
      systemModuleWhere.status = status;
    }

    if (!_.isEmpty(name)) {
      systemModuleWhere.name = {
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

    const data = await SystemModules.findAll({
      where: { ...systemModuleWhere, ...deleteOperation() },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      include: [
        {
          model: ModuleOptions,
          as: "arrModuleOption",
          where: {
            ...deleteOperation(),
          },
          required: false,
        },
      ],
      order: [[sorterField, sorterOrder]],
    });

    const dataCount = await SystemModules.count({
      where: { ...systemModuleWhere, ...deleteOperation() },
    });

    return { data, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Adds a new system module record to the database.
 *
 * @param {Object} objParams - The parameters for the new system module.
 * @param {string} objParams.name - The name of the system module.
 * @param {string} objParams.description - The description of the system module.
 * @returns {Promise} A promise that resolves to the new system module data.
 * @throws {Error} Any error that occurs.
 */
exports.addSystemModuleData = async (objParams) => {
  try {
    const { name, description } = objParams;
    const data = await SystemModules.create({ name, description });

    return data;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Updates a system module record in the database.
 *
 * @param {Object} objParams - The parameters for updating the system module.
 * @param {number} objParams.systemModuleId - The ID of the system module to update.
 * @param {string} objParams.name - The updated name for the system module.
 * @param {string} objParams.description - The updated description for the system module.
 * @returns {Promise} A promise that resolves to the updated system module data.
 * @throws {Error} Any error that occurs.
 */
exports.updateSystemModuleData = async (objParams) => {
  try {
    const { systemModuleId, name, description } = objParams;
    const data = await SystemModules.update(
      { name, description },
      {
        where: {
          id: systemModuleId,
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
 * Adds module option records for a system module.
 *
 * @param {Object} objParams - The parameters.
 * @param {string} objParams.systemModuleName - The name of the system module.
 * @param {number} objParams.systemModuleId - The ID of the system module.
 * @param {Object[]} objParams.moduleOption - The module options to add.
 * @returns {Promise} A promise that resolves when complete.
 */
exports.addModuleOptionForSystemModuleData = async (objParams) => {
  try {
    const { systemModuleName, systemModuleId, moduleOption } = objParams;

    let arrModuleOptionData;
    if (!_.isEmpty(moduleOption)) {
      arrModuleOptionData = moduleOption.map(async (objEachModuleOption) => {
        const data = await ModuleOptions.create({
          systemModuleId,
          value: objEachModuleOption.name,
          slug: slugify(`${systemModuleName} ${objEachModuleOption.name}`),
          description: objEachModuleOption.description,
        });

        return data;
      });
    }

    return arrModuleOptionData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Updates module option records for a system module.
 *
 * @param {Object} objParams - The parameters.
 * @param {string} objParams.systemModuleName - The name of the system module.
 * @param {number} objParams.systemModuleId - The ID of the system module.
 * @param {Object[]} objParams.moduleOption - The module options to update.
 * @param {number[]} objParams.deletedModuleOption - IDs of module options to delete.
 * @returns {Promise} A promise that resolves when complete.
 */
exports.updateModuleOptionForSystemModuleData = async (objParams) => {
  try {
    const {
      systemModuleName,
      systemModuleId,
      moduleOption,
      deletedModuleOption,
    } = objParams;

    // delete any module deleted from system
    if (deletedModuleOption.length > 0) {
      const currentDateTime = getCurrentDateTime();
      deletedModuleOption.map(async (objEachDeletedModuleOptionId) => {
        if (!_.isEmpty(objEachDeletedModuleOptionId)) {
          await ModuleOptions.update(
            {
              endeffdt: currentDateTime,
            },
            {
              where: {
                id: objEachDeletedModuleOptionId,
              },
            }
          );
        }
      });
    }

    // checking for add update case of module option
    if (!_.isEmpty(moduleOption)) {
      moduleOption.map(async (objEachModuleOption) => {
        // update case
        if (_.toInteger(objEachModuleOption.id) > 0) {
          await ModuleOptions.update(
            {
              value: objEachModuleOption.name,
              slug: slugify(`${systemModuleName} ${objEachModuleOption.name}`),
              description: objEachModuleOption.description,
            },
            {
              where: {
                id: objEachModuleOption.id,
              },
            }
          );
        }
        // add case
        else {
          await ModuleOptions.create({
            systemModuleId,
            value: objEachModuleOption.name,
            slug: slugify(`${systemModuleName} ${objEachModuleOption.name}`),
            description: objEachModuleOption.description,
          });
        }
      });
    }

    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Deletes a system module by ID.
 *
 * @param {number} systemModuleId - The ID of the system module to delete.
 *
 * @returns {Promise<boolean>} - Resolves to true if successful.
 */
exports.deleteSystemModuleData = async (systemModuleId) => {
  try {
    const currentDateTime = getCurrentDateTime();

    await SystemModules.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: systemModuleId,
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
 * Changes the status of a system module by ID.
 *
 * @param {Object} objParams - The parameters.
 * @param {number} objParams.systemModuleId - The ID of the system module.
 * @param {string} objParams.status - The new status, either 'A' for active or 'I' for inactive.
 *
 * @returns {Promise<boolean>} - Resolves to true if successful.
 */
exports.changeStatusSystemModuleData = async (objParams) => {
  try {
    const { systemModuleId, status } = objParams;

    await SystemModules.update(
      {
        status: status === "A" ? "I" : "A",
      },
      {
        where: {
          id: systemModuleId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};
