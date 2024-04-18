const _ = require("lodash");

const { Brand } = require("../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { deleteOperation } = require("../config/helper/db-utility");
const { Op } = require("sequelize");
const { getRawJson } = require("../config/helper/utility");
const { getImageDocVideoData } = require("./imageDocVideo.services");

/**
 * Adds a new brand data to the database.
 *
 * @param {Object} objParams - The parameters for the new brand.
 * @param {string} objParams.name - The name of the brand.
 * @param {string} objParams.description - The description of the brand.
 * @returns {Promise<Object>} - The created brand data.
 */
exports.addbrandData = async (objParams) => {
  try {
    const { name, description } = objParams;

    const brandData = await Brand.create({
      name,
      description,
    });

    return brandData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.updateBrandData = async (objParams) => {
  try {
    const { brandId, name, description } = objParams;
    const data = await Brand.update(
      {
        name,
        description,
      },
      {
        where: {
          id: brandId,
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
 * Retrieves brand data from the database based on the provided parameters.
 *
 * @param {Object} objParams - The parameters for retrieving brand data.
 * @param {Object} objParams.filterParams - The filter parameters for the brand data.
 * @param {Object} objParams.filterParams.pagination - The pagination parameters for the brand data.
 * @param {number} objParams.filterParams.pagination.current - The current page number.
 * @param {number} objParams.filterParams.pagination.pageSize - The number of items per page.
 * @param {Object} objParams.filterParams.table - The table parameters for the brand data.
 * @param {Object} objParams.filterParams.filter - The filter parameters for the brand data.
 * @param {string} objParams.filterParams.filter.name - The name filter for the brand data.
 * @param {string} objParams.filterParams.filter.description - The description filter for the brand data.
 * @param {string} objParams.filterParams.filter.status - The status filter for the brand data.
 * @param {string} objParams.brandId - The ID of the brand to retrieve.
 * @returns {Promise<Object>} - The retrieved brand data.
 */
exports.getBrandData = async (objParams) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: { name = "", description = "", status = "" } = {},
      } = { pagination: {}, filter: {} },
      brandId,
    } = objParams || {};

    let brandDataWhere = {};

    if (!_.isEmpty(brandId)) {
      brandDataWhere.id = brandId;
    }

    if (!_.isEmpty(status)) {
      brandDataWhere.status = status;
    }

    if (!_.isEmpty(name)) {
      brandDataWhere.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (!_.isEmpty(description)) {
      brandDataWhere.description = {
        [Op.like]: `%${description}%`,
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

    let brandListData = await Brand.findAll({
      where: {
        ...brandDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    let arrTransformedData = [];
    for (let i = 0; i < brandListData.length; i++) {
      const tmpEmployeeData = await getRawJson(brandListData[i]);
      let imageRelatedData = await getImageDocVideoData({
        relatedId: tmpEmployeeData.id,
        typeX: "IMG",
        resourceType: "BRAND",
      });
      for (let j = 0; j < imageRelatedData.length; j++) {
        const tmpImageData = await getRawJson(imageRelatedData[j]);
        imageRelatedData[j] = tmpImageData;
      }
      const objReturn = { ...tmpEmployeeData, imageRelatedData };
      arrTransformedData.push(objReturn);
    }

    const dataCount = await Brand.count({
      where: { ...brandDataWhere, ...deleteOperation() },
    });

    return { data: arrTransformedData, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Updates the status of a brand in the database.
 *
 * @param {number} brandId - The ID of the brand to update.
 * @param {string} status - The new status to set for the brand. Can be either "A" (active) or "I" (inactive).
 * @returns {Promise<boolean>} - Returns true if the update was successful, otherwise throws an error.
 */
exports.updateBrandStatusData = async (brandId, status) => {
  try {
    await Brand.update(
      {
        status: status === "A" ? "I" : "A",
      },
      {
        where: {
          id: brandId,
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteBrandData = async (brandId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await Brand.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: brandId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};
