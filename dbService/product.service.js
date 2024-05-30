const _ = require("lodash");

const { Product } = require("../models");
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
exports.addProductData = async (objParams) => {
  try {
    const {
      name,
      description,
      categoryId,
      subCategoryId,
      brandId,
      productId,
      hsnCode,
      modelNumber,
      warrenty,
      gstRate,
    } = objParams;

    const productData = await Product.create({
      name,
      description,
      categoryId,
      subCategoryId,
      brandId,
      hsnCode,
      modelNumber,
      warrenty,
      gst: gstRate,
    });

    return productData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.updateProductData = async (objParams) => {
  try {
    const {
      name,
      description,
      categoryId,
      subCategoryId,
      brandId,
      hsnCode,
      modelNumber,
      warrenty,
      gstRate,
      productId,
    } = objParams;

    const data = await Product.update(
      {
        name,
        description,
        categoryId,
        subCategoryId,
        brandId,
        hsnCode,
        modelNumber,
        warrenty,
        gst: gstRate,
      },
      {
        where: {
          id: productId,
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
 * @param {string} objParams.productId - The ID of the brand to retrieve.
 * @returns {Promise<Object>} - The retrieved brand data.
 */
exports.getProductData = async (objParams) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: {
          name = "",
          description = "",
          status = "",
          categoryId = "",
          subCategoryId = "",
          brandId = "",
        } = {},
      } = { pagination: {}, filter: {} },
      productId,
      arrProductIds = [],
    } = objParams || {};

    let productDataWhere = {};

    if (!_.isEmpty(productId)) {
      productDataWhere.id = productId;
    }

    if (!_.isEmpty(arrProductIds)) {
      productDataWhere.id = {
        [Op.in]: arrProductIds,
      };
    }

    if (!_.isEmpty(status)) {
      productDataWhere.status = status;
    }

    if (!_.isEmpty(categoryId)) {
      productDataWhere.categoryId = categoryId;
    }

    if (!_.isEmpty(subCategoryId)) {
      productDataWhere.subCategoryId = subCategoryId;
    }

    if (!_.isEmpty(brandId)) {
      productDataWhere.brandId = brandId;
    }

    if (!_.isEmpty(name)) {
      productDataWhere.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (!_.isEmpty(description)) {
      productDataWhere.description = {
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

    let productListData = await Product.findAll({
      where: {
        ...productDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    let arrTransformedData = [];
    for (let i = 0; i < productListData.length; i++) {
      const tmpEmployeeData = await getRawJson(productListData[i]);
      let imageRelatedData = await getImageDocVideoData({
        relatedId: tmpEmployeeData.id,
        typeX: "IMG",
        resourceType: "PRODUCT_IMAGE",
      });
      for (let j = 0; j < imageRelatedData.length; j++) {
        const tmpImageData = await getRawJson(imageRelatedData[j]);
        imageRelatedData[j] = tmpImageData;
      }

      let pdfRelatedData = await getImageDocVideoData({
        relatedId: tmpEmployeeData.id,
        typeX: "DOC",
        resourceType: "PRODUCT_PDF",
      });
      for (let j = 0; j < pdfRelatedData.length; j++) {
        const tmpImageData = await getRawJson(pdfRelatedData[j]);
        pdfRelatedData[j] = tmpImageData;
      }

      const objReturn = {
        ...tmpEmployeeData,
        imageRelatedData,
        pdfRelatedData,
      };
      arrTransformedData.push(objReturn);
    }

    const dataCount = await Product.count({
      where: { ...productDataWhere, ...deleteOperation() },
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
 * @param {number} productId - The ID of the brand to update.
 * @param {string} status - The new status to set for the brand. Can be either "A" (active) or "I" (inactive).
 * @returns {Promise<boolean>} - Returns true if the update was successful, otherwise throws an error.
 */
exports.updateProductStatusData = async (productId, status) => {
  try {
    await Product.update(
      {
        status: status === "A" ? "I" : "A",
      },
      {
        where: {
          id: productId,
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteProductData = async (productId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await Product.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: productId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};
