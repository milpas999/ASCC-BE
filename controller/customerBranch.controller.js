const _ = require("lodash");
const { sendJsonResponse } = require("../config/helper/renderer");
const { CustomError } = require("../config/helper/customError");

const { getRawJson } = require("../config/helper/utility");
const {
  addCustomerData,
  getCustomerData,
  deleteCustomerData,
  updateCustomerData,
  updateCategoryStatusData,
  addCustomerBranchData,
  getCustomerBranchData,
  updateCustomerBranchData,
  deleteCustomerBranchData,
  setDefaultCustomerBranchData,
} = require("../dbService/customerBranch.service");
const { body } = require("express-validator");

/**
 * Adds a new customer to the system.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the customer data.
 * @param {string} req.body.name - The name of the customer.
 * @param {string} req.body.website - The website of the customer.
 * @param {string} req.body.address - The address of the customer.
 * @param {string} req.body.dob - The date of birth of the customer.
 * @param {string} req.body.anniversaryDate - The anniversary date of the customer.
 * @param {string} req.body.description - The description of the customer.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the customer is added successfully.
 */
exports.addCustomer = async (req, res, next) => {
  try {
    const {
      body: {
        name,
        website,
        address,
        phone,
        dob,
        anniversaryDate,
        description,
      },
    } = req;

    const objParams = {
      name,
      website,
      address,
      phone,
      dob,
      anniversaryDate,
      description,
    };

    const newBrand = await addCustomerData(objParams);

    const newBrandRaw = await getRawJson(newBrand);
    sendJsonResponse(
      req,
      res,
      200,
      newBrandRaw,
      true,
      "Customer added successfully"
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
 * Retrieves a list of customers based on the provided filter parameters.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query - The query parameters in the request.
 * @param {Object} req.query.filterParams - The filter parameters to use when retrieving the customer list.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>} - A Promise that resolves when the customer list has been fetched and sent as the response.
 */
exports.getCustomer = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;

    const customerListData = await getCustomerData({ filterParams });
    sendJsonResponse(
      req,
      res,
      200,
      customerListData,
      true,
      "Customer list fetched"
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
 * Retrieves customer data by the provided customer ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.customerId - The ID of the customer to retrieve.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the customer data has been fetched and sent in the response.
 */
exports.getCustomerById = async (req, res, next) => {
  try {
    const {
      params: { customerId },
    } = req;

    const customerListData = await getCustomerData({ customerId });
    sendJsonResponse(
      req,
      res,
      200,
      customerListData,
      true,
      "Customer data fetched"
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
 * Deletes a customer by the provided customer ID.
 *
 * @param {Object} req - The request object.
 * @param {string} req.params.customerId - The ID of the customer to delete.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the customer is deleted.
 */
exports.deleteCustomerById = async (req, res, next) => {
  try {
    const {
      params: { customerId },
    } = req;
    await deleteCustomerData(customerId);
    sendJsonResponse(req, res, 200, {}, true, "Customer deleted successfully");
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
 * Updates the customer data in the system.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.customerId - The ID of the customer to update.
 * @param {Object} req.body - The request body containing the updated customer data.
 * @param {string} req.body.name - The updated name of the customer.
 * @param {string} req.body.website - The updated website of the customer.
 * @param {string} req.body.address - The updated address of the customer.
 * @param {string} req.body.dob - The updated date of birth of the customer.
 * @param {string} req.body.anniversaryDate - The updated anniversary date of the customer.
 * @param {string} req.body.description - The updated description of the customer.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the customer data has been updated.
 */
exports.updateCustomer = async (req, res, next) => {
  try {
    const {
      params: { customerId },
      body: {
        name,
        website,
        address,
        phone,
        dob,
        anniversaryDate,
        description,
      },
    } = req;

    const objParamsForBrandUpdate = {
      name,
      website,
      address,
      phone,
      dob,
      anniversaryDate,
      description,
      customerId,
    };

    const customerListData = await updateCustomerData(objParamsForBrandUpdate);

    sendJsonResponse(
      req,
      res,
      200,
      customerListData,
      true,
      "Customer data fetched"
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
 * Updates the status of a customer.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.customerId - The ID of the customer to update.
 * @param {string} req.params.status - The new status to set for the customer.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the customer status has been updated.
 */
exports.updateCustomerStatus = async (req, res, next) => {
  try {
    const {
      params: { customerId, status },
    } = req;
    await updateCategoryStatusData(customerId, status);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Customer status updated successfully"
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

exports.addCustomerBranchData = async (req, res, next) => {
  try {
    const {
      body: {
        name,
        department,
        contactPersonName,
        contactPersonPosition,
        location,
        branchAddress,
        branchContactNumber,
        branchAlternateContactNumber,
        branchEmail,
        description,
      },
      params: { customerId },
    } = req;

    const objCustomerBranch = {
      name,
      department,
      contactPersonName,
      contactPersonPosition,
      location,
      branchAddress,
      branchContactNumber,
      branchAlternateContactNumber,
      branchEmail,
      description,
      customerId,
    };

    const customerbranchData = await addCustomerBranchData(objCustomerBranch);

    sendJsonResponse(
      req,
      res,
      200,
      customerbranchData,
      true,
      "Customer branch added successfully"
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

exports.getCustomerBranch = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
      params: { customerId },
    } = req;

    const customerListData = await getCustomerBranchData({
      ...filterParams,
      customerId,
    });
    sendJsonResponse(
      req,
      res,
      200,
      customerListData,
      true,
      "Customer branch list fetched"
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

exports.getCustomerBranchById = async (req, res, next) => {
  try {
    const {
      params: { customerId, branchId },
    } = req;

    const customerListData = await getCustomerBranchData({
      customerId,
      customerBranchId: branchId,
    });
    sendJsonResponse(
      req,
      res,
      200,
      customerListData,
      true,
      "Customer branch data fetched"
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

exports.updateCustomerBranch = async (req, res, next) => {
  try {
    const {
      body: {
        name,
        department,
        contactPersonName,
        contactPersonPosition,
        location,
        branchAddress,
        branchContactNumber,
        branchAlternateContactNumber,
        branchEmail,
        description,
      },
      params: { customerId, branchId },
    } = req;

    const objCustomerBranch = {
      name,
      department,
      contactPersonName,
      contactPersonPosition,
      location,
      branchAddress,
      branchContactNumber,
      branchAlternateContactNumber,
      branchEmail,
      description,
      customerId,
      branchId,
    };

    const customerbranchData = await updateCustomerBranchData(
      objCustomerBranch
    );

    sendJsonResponse(
      req,
      res,
      200,
      customerbranchData,
      true,
      "Customer branch added successfully"
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

exports.deleteCustomerBranch = async (req, res, next) => {
  try {
    const {
      params: { customerId, branchId },
    } = req;
    await deleteCustomerBranchData(customerId, branchId);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Customer branch deleted successfully"
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

exports.setDefaultCustomerBranch = async (req, res, next) => {
  try {
    const {
      params: { customerId, branchId },
    } = req;
    await setDefaultCustomerBranchData(customerId, branchId);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Customer branch deleted successfully"
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
