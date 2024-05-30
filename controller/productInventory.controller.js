const _ = require("lodash");
const { sendJsonResponse } = require("../config/helper/renderer");
const { CustomError } = require("../config/helper/customError");
const {
  addProductInventoryData,
  getCategoryData,
  deleteProductInventoryData,
  updateProductInventoryData,
  updateProductInventoryStatusData,
  addUpdateProductSerialNumber,
  getTotalProductsInInventoryData,
  getTotalProductsInInventoryDataById,
  getProductInventoryDetailData,
  deleteProductSerialNumber,
} = require("../dbService/productInventory.service");

/**
 * Adds a new product inventory entry.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the product inventory data.
 * @param {string} req.body.direction - The direction of the inventory movement (e.g. 'in', 'out').
 * @param {string} req.body.date - The date of the inventory movement.
 * @param {string} req.body.productId - The ID of the product.
 * @param {number} req.body.quantitiy - The quantity of the product.
 * @param {number} req.body.costPrice - The cost price of the product.
 * @param {number} req.body.sellingPrice - The selling price of the product.
 * @param {number} req.body.bottomPrice - The bottom price of the product.
 * @param {string[]} req.body.arrSerialNumber - The serial numbers of the product.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the product inventory is added successfully.
 */
exports.addProductInventory = async (req, res, next) => {
  try {
    const {
      body: {
        direction,
        date,
        productId,
        quantitiy,
        costPrice,
        sellingPrice,
        bottomPrice,
        arrSerialNumber,
        // deletedProductInventorySerial,
      },
    } = req;

    console.log("arrSerialNumber :::::::: ", arrSerialNumber);

    const objParams = {
      inventoryId: Math.floor(Math.random() * 100000000),
      direction,
      date,
      productId,
      quantitiy,
      costPrice,
      sellingPrice,
      bottomPrice,
    };

    const productInventoryData = await addProductInventoryData(objParams);

    await addUpdateProductSerialNumber(
      productInventoryData.id,
      arrSerialNumber
    );

    sendJsonResponse(
      req,
      res,
      200,
      productInventoryData,
      true,
      "product inventory added successfully"
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
 * Retrieves the total number of products in the inventory based on the provided filter parameters.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query - The query parameters in the request.
 * @param {Object} req.query.filterParams - The filter parameters to apply when retrieving the product inventory data.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 */
exports.getTotalProductsInInventory = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;

    const brandListData = await getTotalProductsInInventoryData({
      filterParams,
    });
    sendJsonResponse(
      req,
      res,
      200,
      brandListData,
      true,
      "Category list fetched"
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
 * Fetches the total product inventory data by the given product inventory ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.productInventoryId - The ID of the product inventory to fetch.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
exports.getProductInventoryById = async (req, res, next) => {
  try {
    const {
      params: { productInventoryId },
    } = req;

    const productInventoryListData = await getTotalProductsInInventoryDataById({
      productInventoryId,
    });

    sendJsonResponse(
      req,
      res,
      200,
      productInventoryListData,
      true,
      "Product inventory data fetched"
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
 * Deletes a product inventory item.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.productInventoryId - The ID of the product inventory item to delete.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the product inventory item has been deleted.
 */
exports.deleteProductInventoryInfo = async (req, res, next) => {
  try {
    const {
      params: { productInventoryId },
    } = req;
    await deleteProductInventoryData(productInventoryId);
    sendJsonResponse(req, res, 200, {}, true, "Category deleted successfully");
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
 * Updates the inventory data for a product.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The parameters in the request URL.
 * @param {string} req.params.productInventoryId - The ID of the product inventory to update.
 * @param {Object} req.body - The request body containing the updated inventory data.
 * @param {string} req.body.direction - The direction of the inventory change (e.g. 'in', 'out').
 * @param {string} req.body.date - The date of the inventory change.
 * @param {string} req.body.productId - The ID of the product.
 * @param {number} req.body.quantitiy - The quantity of the inventory change.
 * @param {number} req.body.costPrice - The cost price of the product.
 * @param {number} req.body.sellingPrice - The selling price of the product.
 * @param {number} req.body.bottomPrice - The bottom price of the product.
 * @param {string[]} req.body.arrSerialNumber - The serial numbers of the product inventory.
 * @param {string[]} req.body.deletedProductInventorySerial - The serial numbers of the product inventory to be deleted.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
exports.updateProductInventory = async (req, res, next) => {
  try {
    const {
      params: { productInventoryId },
      body: {
        direction,
        date,
        productId,
        quantitiy,
        costPrice,
        sellingPrice,
        bottomPrice,
        arrSerialNumber,
        deletedProductInventorySerial,
      },
    } = req;

    const objParams = {
      productInventoryId,
      direction,
      date,
      productId,
      quantitiy,
      costPrice,
      sellingPrice,
      bottomPrice,
      arrSerialNumber,
      deletedProductInventorySerial,
    };

    await updateProductInventoryData(objParams);

    await addUpdateProductSerialNumber(productInventoryId, arrSerialNumber);

    await deleteProductSerialNumber(
      productInventoryId,
      deletedProductInventorySerial
    );

    sendJsonResponse(
      req,
      res,
      200,
      true,
      true,
      "Category updated successfully"
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
 * Updates the status of a product inventory.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.productInventoryId - The ID of the product inventory to update.
 * @param {string} req.params.status - The new status to set for the product inventory.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the product inventory status has been updated.
 */
exports.updateProductInventoryStatus = async (req, res, next) => {
  try {
    const {
      params: { productInventoryId, status },
    } = req;
    await updateProductInventoryStatusData(productInventoryId, status);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Category status updated successfully"
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

exports.getProductInventoryDetail = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
      params: { productId },
    } = req;

    const productInventoryDetailData = await getProductInventoryDetailData({
      productId,
      filterParams,
    });
    sendJsonResponse(
      req,
      res,
      200,
      productInventoryDetailData,
      true,
      "Product inventory detail list fetched"
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
