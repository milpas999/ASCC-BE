const _ = require("lodash");

const { Category } = require("../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { deleteOperation } = require("../config/helper/db-utility");
const { Op } = require("sequelize");

/**
 * Adds a new category to the database.
 *
 * @param {Object} objParams - The parameters for creating the new category.
 * @param {string} objParams.name - The name of the new category.
 * @param {string} objParams.description - The description of the new category.
 * @param {number} objParams.parentCategoryId - The ID of the parent category, if any.
 * @returns {Promise<Object>} - The created category data.
 */
exports.addCategoryData = async (objParams) => {
  try {
    const { name, description, parentCategoryId } = objParams;

    const brandData = await Category.create({
      name,
      description,
      parentCategoryId,
    });

    return brandData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Retrieves a list of categories from the database based on the provided filter parameters.
 *
 * @param {Object} objParams - The parameters for retrieving the category data.
 * @param {Object} objParams.filterParams - The parameters for filtering the category data.
 * @param {Object} objParams.filterParams.pagination - The pagination parameters.
 * @param {number} objParams.filterParams.pagination.current - The current page number.
 * @param {number} objParams.filterParams.pagination.pageSize - The number of items to display per page.
 * @param {string} objParams.filterParams.table - The table name.
 * @param {Object} objParams.filterParams.filter - The filter parameters.
 * @param {string} objParams.filterParams.filter.name - The name of the category.
 * @param {string} objParams.filterParams.filter.description - The description of the category.
 * @param {string} objParams.filterParams.filter.status - The status of the category.
 * @param {string} objParams.filterParams.filter.parentCategoryId - The ID of the parent category.
 * @param {string} objParams.categoryId - The ID of the category.
 * @returns {Promise<Object>} - The category data and the total count of categories.
 */
exports.getCategoryData = async (objParams) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 999 } = {},
        table,
        filter: {
          name = "",
          description = "",
          status = "",
          parentCategoryId = "",
        } = {},
      } = { pagination: {}, filter: {} },
      categoryId,
    } = objParams || {};

    let categoryDataWhere = {};

    if (!_.isEmpty(categoryId)) {
      categoryDataWhere.id = categoryId;
    }

    if (!_.isEmpty(status)) {
      categoryDataWhere.status = status;
    }

    if (!_.isEmpty(name)) {
      categoryDataWhere.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (!_.isEmpty(description)) {
      categoryDataWhere.description = {
        [Op.like]: `%${description}%`,
      };
    }

    if (!_.isEmpty(parentCategoryId) && _.toInteger(parentCategoryId) >= 0) {
      categoryDataWhere.parentCategoryId = _.toInteger(parentCategoryId);
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

    let categoryListData = await Category.findAll({
      where: {
        ...categoryDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    const dataCount = await Category.count({
      where: { ...categoryDataWhere, ...deleteOperation() },
    });

    return { data: categoryListData, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Deletes a category by updating the `endeffdt` (end effective date) field in the database.
 *
 * @param {number} categoryId - The ID of the category to be deleted.
 * @returns {Promise<boolean>} - Returns `true` if the category was successfully deleted, or an error object if an error occurred.
 */
exports.deleteCategoryData = async (categoryId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await Category.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: categoryId,
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
 * Updates the data for a category in the database.
 *
 * @param {Object} objParams - An object containing the parameters for updating the category.
 * @param {number} objParams.categoryId - The ID of the category to be updated.
 * @param {string} objParams.name - The new name for the category.
 * @param {string} objParams.description - The new description for the category.
 * @param {number} objParams.parentCategoryId - The new parent category ID for the category.
 * @returns {Promise<boolean>} - Returns `true` if the category was successfully updated, or an error object if an error occurred.
 */
exports.updateCategoryData = async (objParams) => {
  try {
    const { categoryId, name, description, parentCategoryId } = objParams;
    await Category.update(
      {
        name,
        description,
        parentCategoryId,
      },
      {
        where: {
          id: categoryId,
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
 * Updates the status of a category in the database.
 *
 * @param {number} categoryId - The ID of the category to be updated.
 * @param {string} status - The new status for the category. Can be either "A" (active) or "I" (inactive).
 * @returns {Promise<boolean>} - Returns `true` if the category status was successfully updated, or an error object if an error occurred.
 */
exports.updateCategoryStatusData = async (categoryId, status) => {
  try {
    await Category.update(
      {
        status: status === "A" ? "I" : "A",
      },
      {
        where: {
          id: categoryId,
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};
