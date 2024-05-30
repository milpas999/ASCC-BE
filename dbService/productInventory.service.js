const _ = require("lodash");

const {
  ProductInventory,
  ProductInventorySerial,
  Sequelize,
} = require("../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { deleteOperation } = require("../config/helper/db-utility");
const { Op } = require("sequelize");
const { getProductData } = require("./product.service");
const { getRawJson } = require("../config/helper/utility");

/**
 * Adds a new product inventory data entry.
 *
 * @param {Object} objParams - The parameters for the new product inventory data.
 * @param {string} objParams.inventoryId - The ID of the inventory.
 * @param {string} objParams.direction - The direction of the inventory movement (e.g. 'in', 'out').
 * @param {Date} objParams.date - The date and time of the inventory movement.
 * @param {string} objParams.productId - The ID of the product.
 * @param {number} objParams.quantitiy - The quantity of the product.
 * @param {number} objParams.costPrice - The cost price of the product.
 * @param {number} objParams.sellingPrice - The selling price of the product.
 * @param {number} objParams.bottomPrice - The bottom price of the product.
 * @returns {Promise<Object>} - The created product inventory data.
 */
exports.addProductInventoryData = async (objParams) => {
  try {
    const {
      inventoryId,
      direction,
      date,
      productId,
      quantitiy,
      costPrice,
      sellingPrice,
      bottomPrice,
    } = objParams;

    const productInventoryData = await ProductInventory.create({
      invenrtoryId: inventoryId,
      direction,
      dateTime: date,
      productId,
      quantity: quantitiy,
      costPrice,
      sellingPrice,
      bottemPrice: bottomPrice,
    });

    return productInventoryData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Adds or updates product serial numbers for a given product inventory ID.
 *
 * @param {number} productInventoryId - The ID of the product inventory to update.
 * @param {Array<{ id: number, value: string }>} arrSerialNumber - An array of serial number objects, where each object has an ID and a value.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */
exports.addUpdateProductSerialNumber = async (
  productInventoryId,
  arrSerialNumber
) => {
  try {
    console.log("arrSerialNumber ::::::::::: ", arrSerialNumber);
    if (arrSerialNumber.length > 0) {
      let arrSerialInsert = [];
      let arrSerialUpdate = [];

      for (let intI = 0; intI < arrSerialNumber.length; intI++) {
        let objEachSerialNumber = arrSerialNumber[intI];
        console.log("objEachSerialNumber ::::::::: ", objEachSerialNumber);

        if (objEachSerialNumber.id === 0) {
          arrSerialInsert.push({
            productInvenrtoryId: productInventoryId,
            serialNumber: objEachSerialNumber.value,
          });
        } else {
          arrSerialUpdate.push({
            id: objEachSerialNumber.id,
            productInvenrtoryId: productInventoryId,
            serialNumber: objEachSerialNumber.value,
            productInventoryId,
          });
        }
      }
      console.log("arrSerialInsert ::::::::::: ", arrSerialInsert);
      if (!_.isEmpty(arrSerialInsert)) {
        await ProductInventorySerial.bulkCreate(arrSerialInsert);
      }

      if (!_.isEmpty(arrSerialUpdate)) {
        arrSerialUpdate.map(async (objEachSerialUpdate) => {
          await ProductInventorySerial.update(
            {
              serialNumber: objEachSerialUpdate.serialNumber,
            },
            {
              where: {
                id: objEachSerialUpdate.id,
              },
            }
          );
        });
      }
    }
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Deletes one or more product inventory serial numbers for a given product inventory ID.
 *
 * @param {number} productInventoryId - The ID of the product inventory.
 * @param {string} deletedProductInventorySerial - A comma-separated list of product inventory serial numbers to delete.
 * @returns {Promise<void>} - A Promise that resolves when the deletion is complete.
 */
exports.deleteProductSerialNumber = async (
  productInventoryId,
  deletedProductInventorySerial
) => {
  try {
    if (!_.isEmpty(deletedProductInventorySerial)) {
      let arrProductInventorySerialDelete =
        deletedProductInventorySerial.split(",");

      if (!_.isEmpty(arrProductInventorySerialDelete)) {
        const currentDateTime = getCurrentDateTime();

        await ProductInventorySerial.update(
          {
            endeffdt: currentDateTime,
          },
          {
            where: {
              id: {
                [Op.in]: arrProductInventorySerialDelete,
              },
              productInvenrtoryId: productInventoryId,
            },
          }
        );
      }
    }
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Retrieves the total product inventory data, including the product details and the maximum product inventory ID for each product.
 *
 * @param {Object} objParams - An object containing parameters for the product data retrieval.
 * @returns {Promise<{ data: Object[], dataCount: number }>} - An object containing the transformed product list data and the total count of products.
 */
exports.getTotalProductsInInventoryData = async (objParams) => {
  try {
    const arrTotalProductInInventory = await ProductInventory.findAll({
      attributes: [
        [Sequelize.fn("MAX", Sequelize.col("id")), "productInventoryId"],
        "productId",
      ],
      where: {
        ...deleteOperation(),
      },
      group: ["productId"],
    });

    const rawArrTotalProductInInventory = [];
    for (intI = 0; intI < arrTotalProductInInventory.length; intI++) {
      const objEachTotalProductInInventory = arrTotalProductInInventory[intI];
      const tttt = await getRawJson(objEachTotalProductInInventory);
      rawArrTotalProductInInventory.push(tttt);
    }

    const arrProductIds = arrTotalProductInInventory.map((objEachProduct) => {
      return objEachProduct.productId;
    });

    const productListData = await getProductData({
      ...objParams,
      arrProductIds,
    });

    let transformedProductListData = [];
    if (productListData.dataCount > 0) {
      transformedProductListData = productListData.data.map(
        (objEachProductData) => {
          const { id: productId } = objEachProductData;
          const tmpProductData = { ...objEachProductData };

          const objProductInventorySelected =
            rawArrTotalProductInInventory.filter(
              (objEachProductInventoryMapping) => {
                return objEachProductInventoryMapping.productId === productId;
              }
            );

          tmpProductData.productInventoryId = 0;
          if (!_.isEmpty(objProductInventorySelected)) {
            tmpProductData.productInventoryId =
              objProductInventorySelected[0].productInventoryId;
          }

          return tmpProductData;
        }
      );
    }

    return {
      data: transformedProductListData,
      dataCount: productListData.dataCount,
    };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Retrieves the total product inventory data by the given product inventory ID.
 *
 * @param {Object} objParams - The parameters object.
 * @param {string} objParams.productInventoryId - The ID of the product inventory.
 * @returns {Promise<{ data: Object[], dataCount: number }>} - The product inventory data and the total count.
 */
exports.getTotalProductsInInventoryDataById = async (objParams) => {
  try {
    const { productInventoryId } = objParams;
    const arrProductInventoryData = await ProductInventory.findAll({
      where: {
        id: productInventoryId,
        ...deleteOperation(),
      },
    });

    const rawArrProductInventoryData = [];
    for (intI = 0; intI < arrProductInventoryData.length; intI++) {
      const objEachProductInventorySerialData = arrProductInventoryData[intI];
      const tttt = await getRawJson(objEachProductInventorySerialData);
      rawArrProductInventoryData.push(tttt);
    }

    const arrProductInventorySerialData = await ProductInventorySerial.findAll({
      where: {
        productInvenrtoryId: productInventoryId,
        ...deleteOperation(),
      },
    });

    const rawArrProductInventorySerialData = [];
    for (intI = 0; intI < arrProductInventorySerialData.length; intI++) {
      const objEachProductInventorySerialData =
        arrProductInventorySerialData[intI];
      const tttt = await getRawJson(objEachProductInventorySerialData);
      rawArrProductInventorySerialData.push(tttt);
    }

    rawArrProductInventoryData[0].arrSerialNumber =
      rawArrProductInventorySerialData;

    return {
      data: rawArrProductInventoryData,
      dataCount: arrProductInventoryData.length,
    };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Deletes a product inventory and its associated serial numbers.
 *
 * @param {number} productInventoryId - The ID of the product inventory to delete.
 * @returns {Promise<boolean>} - Returns true if the deletion was successful, or an error object if it failed.
 */
exports.deleteProductInventoryData = async (productInventoryId) => {
  try {
    const currentDateTime = getCurrentDateTime();

    /**
     * Delete product inventory
     */
    await ProductInventory.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: productInventoryId,
        },
      }
    );

    /**
     * Delete product inventory serial table
     */
    await ProductInventorySerial.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          productInvenrtoryId: productInventoryId,
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
 * Updates the product inventory data for the specified product inventory ID.
 *
 * @param {Object} objParams - The parameters for updating the product inventory data.
 * @param {number} objParams.productInventoryId - The ID of the product inventory to update.
 * @param {string} objParams.direction - The direction of the inventory movement (e.g. 'in', 'out').
 * @param {Date} objParams.date - The date of the inventory movement.
 * @param {number} objParams.productId - The ID of the product.
 * @param {number} objParams.quantitiy - The quantity of the inventory movement.
 * @param {number} objParams.costPrice - The cost price of the product.
 * @param {number} objParams.sellingPrice - The selling price of the product.
 * @param {number} objParams.bottomPrice - The bottom price of the product.
 * @returns {Promise<boolean>} - A promise that resolves to true if the update was successful, or throws an error if it failed.
 */
exports.updateProductInventoryData = async (objParams) => {
  try {
    const {
      productInventoryId,
      direction,
      date,
      productId,
      quantitiy,
      costPrice,
      sellingPrice,
      bottomPrice,
    } = objParams;

    await ProductInventory.update(
      {
        direction,
        dateTime: date,
        productId,
        quantitiy,
        costPrice,
        sellingPrice,
        bottomPrice,
      },
      {
        where: {
          id: productInventoryId,
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
 * Updates the status of a product inventory record.
 *
 * @param {number} productInventoryId - The ID of the product inventory record to update.
 * @param {string} status - The new status to set for the product inventory record. Can be either "A" (active) or "I" (inactive).
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the update was successful, or throws an error if there was a problem.
 */
exports.updateProductInventoryStatusData = async (
  productInventoryId,
  status
) => {
  try {
    await ProductInventory.update(
      {
        status: status === "A" ? "I" : "A",
      },
      {
        where: {
          id: productInventoryId,
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.getProductInventoryDetailData = async (objParams) => {
  try {
    console.log("objParams :::::::::: ", objParams);
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: { inventoryId = "" } = {},
      } = { pagination: {}, filter: {} },
      productId,
    } = objParams || {};

    let productInventoryDetailWhere = {};

    if (!_.isEmpty(productId)) {
      productInventoryDetailWhere.productId = productId;
    }

    if (!_.isEmpty(inventoryId)) {
      productInventoryDetailWhere.invenrtoryId = {
        [Op.like]: `%${inventoryId}%`,
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
    console.log(
      "productInventoryDetailWhere :::::::::::::: ",
      productInventoryDetailWhere
    );
    let productListData = await ProductInventory.findAll({
      where: {
        ...productInventoryDetailWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    // let arrTransformedData = await getRawJson(productListData);
    let arrTransformedData = [];
    for (let i = 0; i < productListData.length; i++) {
      const tmpEmployeeData = await getRawJson(productListData[i]);
      arrTransformedData.push(tmpEmployeeData);
    }

    const dataCount = await ProductInventory.count({
      where: { ...productInventoryDetailWhere, ...deleteOperation() },
    });

    return { data: arrTransformedData, dataCount };

    // const arrTotalProductInInventory = await ProductInventory.findAll({
    //   attributes: [
    //     [Sequelize.fn("MAX", Sequelize.col("id")), "productInventoryId"],
    //     "productId",
    //   ],
    //   where: {
    //     ...deleteOperation(),
    //   },
    //   group: ["productId"],
    // });

    // const rawArrTotalProductInInventory = [];
    // for (intI = 0; intI < arrTotalProductInInventory.length; intI++) {
    //   const objEachTotalProductInInventory = arrTotalProductInInventory[intI];
    //   const tttt = await getRawJson(objEachTotalProductInInventory);
    //   rawArrTotalProductInInventory.push(tttt);
    // }

    // const arrProductIds = arrTotalProductInInventory.map((objEachProduct) => {
    //   return objEachProduct.productId;
    // });

    // const productListData = await getProductData({
    //   ...objParams,
    //   arrProductIds,
    // });

    // let transformedProductListData = [];
    // if (productListData.dataCount > 0) {
    //   transformedProductListData = productListData.data.map(
    //     (objEachProductData) => {
    //       const { id: productId } = objEachProductData;
    //       const tmpProductData = { ...objEachProductData };

    //       const objProductInventorySelected =
    //         rawArrTotalProductInInventory.filter(
    //           (objEachProductInventoryMapping) => {
    //             return objEachProductInventoryMapping.productId === productId;
    //           }
    //         );

    //       tmpProductData.productInventoryId = 0;
    //       if (!_.isEmpty(objProductInventorySelected)) {
    //         tmpProductData.productInventoryId =
    //           objProductInventorySelected[0].productInventoryId;
    //       }

    //       return tmpProductData;
    //     }
    //   );
    // }

    // return {
    //   data: transformedProductListData,
    //   dataCount: productListData.dataCount,
    // };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};
