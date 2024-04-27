const _ = require("lodash");
const { sendJsonResponse } = require("../config/helper/renderer");
const { CustomError } = require("../config/helper/customError");
const {
  addCategoryData,
  getCategoryData,
  deleteCategoryData,
  updateCategoryData,
  updateCategoryStatusData,
} = require("../dbService/category.service");

/**
 * Adds a new category to the system.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the category data.
 * @param {string} req.body.name - The name of the new category.
 * @param {string} req.body.description - The description of the new category.
 * @param {string} req.body.parentCategoryId - The ID of the parent category, if any.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the category is added successfully.
 */
exports.addCategory = async (req, res, next) => {
  try {
    const {
      body: { name, description, parentCategoryId },
    } = req;

    const objParams = {
      name,
      description,
      parentCategoryId,
    };

    const categoryData = await addCategoryData(objParams);

    sendJsonResponse(
      req,
      res,
      200,
      categoryData,
      true,
      "Category added successfully"
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
 * Retrieves a list of categories based on the provided filter parameters.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query.filterParams - The filter parameters to apply when retrieving the category list.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>} - A Promise that resolves when the category list has been fetched and sent as the response.
 */
exports.getCategory = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;

    const brandListData = await getCategoryData({ filterParams });
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
 * Retrieves a category by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params.categoryId - The ID of the category to retrieve.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>} - A Promise that resolves when the category data has been fetched and sent as the response.
 */
exports.getCategoryById = async (req, res, next) => {
  try {
    const {
      params: { categoryId },
    } = req;

    const brandListData = await getCategoryData({ categoryId });

    sendJsonResponse(
      req,
      res,
      200,
      brandListData,
      true,
      "Category data fetched"
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
 * Deletes a category by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params.categoryId - The ID of the category to delete.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>} - A Promise that resolves when the category has been deleted and the response has been sent.
 */
exports.deleteCategoryById = async (req, res, next) => {
  try {
    const {
      params: { categoryId },
    } = req;
    await deleteCategoryData(categoryId);
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
 * Updates a category by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params.categoryId - The ID of the category to update.
 * @param {Object} req.body.name - The new name for the category.
 * @param {Object} req.body.description - The new description for the category.
 * @param {Object} req.body.parentCategoryId - The new parent category ID for the category.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>} - A Promise that resolves when the category has been updated and the response has been sent.
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const {
      params: { categoryId },
      body: { name, description, parentCategoryId },
    } = req;

    const objParams = {
      categoryId,
      name,
      description,
      parentCategoryId,
    };

    const brandListData = await updateCategoryData(objParams);

    sendJsonResponse(
      req,
      res,
      200,
      brandListData,
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
 * Updates the status of a category.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params.categoryId - The ID of the category to update.
 * @param {Object} req.params.status - The new status for the category.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>} - A Promise that resolves when the category status has been updated and the response has been sent.
 */
exports.updateCategoryStatus = async (req, res, next) => {
  try {
    const {
      params: { categoryId, status },
    } = req;
    await updateCategoryStatusData(categoryId, status);
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
