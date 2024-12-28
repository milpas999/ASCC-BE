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
  addCustomerBranchDepartmentData,
  getCustomerBranchDepartmentData,
  updateDepartmentData,
  deleteDepartmentData,
  searchCustomerEntityData,
  searchFromCustomer,
  searchFromBranch,
  searchFromDepartment,
} = require("../dbService/customerBranch.service");
const { body } = require("express-validator");
const {
  addContactPerson,
  addContactPersonWithCustomer,
  addContactPersonWithBranch,
  addContactPersonData,
  getContactPersonData,
  updateContactPersonData,
  deleteContactPersonData,
  searchFromContactPerson,
} = require("../dbService/contactPerson.service");

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
        companyName,
        customerName,
        contactNumber,
        alternateNumber,
        contactPosition,
        email,
        website,
        address,
        location,
        dob,
        anniversaryDate,
        description,
      },
    } = req;

    const objParams = {
      companyName,
      customerName,
      contactNumber,
      alternateNumber,
      contactPosition,
      email,
      website,
      address,
      location,
      dob,
      anniversaryDate,
      description,
    };

    const newCustomerData = await addCustomerData(objParams);

    const objCustomerBranch = {
      branchName: companyName,
      branchAddress: address,
      location,
      contactPersonName: customerName,
      contactPersonDesignation: contactPosition,
      contactPersonMobileNumber: contactNumber,
      contactPersonAlterNateNumber: alternateNumber,
      contactPosition: contactPosition,
      customerId: newCustomerData.id,
    };

    const customerbranchData = await addCustomerBranchData(objCustomerBranch);

    await setDefaultCustomerBranchData(
      newCustomerData.id,
      customerbranchData.id
    );

    sendJsonResponse(
      req,
      res,
      200,
      newCustomerData,
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
        companyName,
        customerName,
        contactNumber,
        website,
        address,
        phone,
        email,
        location,
        dob,
        anniversaryDate,
        description,
      },
    } = req;

    const objParamsForBrandUpdate = {
      companyName,
      customerName,
      contactNumber,
      website,
      address,
      phone,
      email,
      location,
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
      "Customer data updated"
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
        branchName,
        branchAddress,
        location,
        contactPersonName,
        contactPersonDesignation,
        contactPersonMobileNumber,
        contactPersonAlternateNumber,
      },
      params: { customerId },
    } = req;

    const objCustomerBranch = {
      branchName,
      branchAddress,
      location,
      contactPersonName,
      contactPersonDesignation,
      contactPersonMobileNumber,
      contactPersonAlterNateNumber: contactPersonAlternateNumber,
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
        branchName,
        branchAddress,
        location,
        contactPersonName,
        contactPersonDesignation,
        contactPersonMobileNumber,
      },
      params: { customerId, branchId },
    } = req;

    const objCustomerBranch = {
      branchName,
      branchAddress,
      location,
      contactPersonName,
      contactPersonDesignation,
      contactPersonMobileNumber,
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

exports.addDepartment = async (req, res, next) => {
  try {
    const {
      body: {
        departmentName,
        contactPersonName,
        contactPersonDesignation,
        contactPersonMobileNumber,
        alternateContactNumber,
        email,
        description,
      },
      params: { customerId, branchId },
    } = req;

    const objCustomerBranchDepartment = {
      departmentName,
      contactPersonName,
      contactPersonDesignation,
      contactPersonMobileNumber,
      alternateContactNumber,
      email,
      description,
      customerId,
      branchId,
    };

    const customerbranchDepartmentData = await addCustomerBranchDepartmentData(
      objCustomerBranchDepartment
    );

    sendJsonResponse(
      req,
      res,
      200,
      customerbranchDepartmentData,
      true,
      "Department added successfully"
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

exports.getDepartment = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
      params: { customerId, branchId },
    } = req;

    const departmentListData = await getCustomerBranchDepartmentData({
      ...filterParams,
      customerId,
      branchId,
    });
    sendJsonResponse(
      req,
      res,
      200,
      departmentListData,
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

exports.getDepartmentById = async (req, res, next) => {
  try {
    const {
      params: { customerId, branchId, departmentId },
    } = req;

    const departmentListData = await getCustomerBranchDepartmentData({
      customerId,
      branchId,
      departmentId,
    });
    sendJsonResponse(
      req,
      res,
      200,
      departmentListData,
      true,
      "Department fetched"
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

exports.updateDepartment = async (req, res, next) => {
  try {
    const {
      body: {
        departmentName,
        contactPersonName,
        contactPersonDesignation,
        contactPersonMobileNumber,
        alternateContactNumber,
        email,
        description,
      },
      params: { customerId, branchId, departmentId },
    } = req;

    const objDepartmentData = {
      departmentName,
      contactPersonName,
      contactPersonDesignation,
      contactPersonMobileNumber,
      alternateContactNumber,
      email,
      description,
      customerId,
      branchId,
      departmentId,
    };

    const departmentData = await updateDepartmentData(objDepartmentData);

    sendJsonResponse(
      req,
      res,
      200,
      departmentData,
      true,
      "Department updated successfully"
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

exports.deleteDepartment = async (req, res, next) => {
  try {
    const {
      params: { customerId, branchId, departmentId },
    } = req;
    await deleteDepartmentData(customerId, branchId, departmentId);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Department deleted successfully"
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

exports.addContactPerson = async (req, res, next) => {
  try {
    const {
      body: {
        contactPersonName,
        contactPersonPosition,
        contactPersonNumber,
        contactPersonAlternateNumber,
        referenceType,
        referenceId,
      },
    } = req;

    const objContactPersonData = {
      contactPersonName,
      contactPersonPosition,
      contactPersonNumber,
      contactPersonAlternateNumber,
      referenceType,
      referenceId,
    };

    await addContactPersonData(objContactPersonData);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Contact person added successfully"
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

exports.getContactPerson = async (req, res, next) => {
  try {
    const {
      params: { referenceType, referenceId },
    } = req;
    const contactPersonData = await getContactPersonData({
      referenceType,
      referenceId,
    });
    sendJsonResponse(
      req,
      res,
      200,
      contactPersonData,
      true,
      "Contact person fetched successfully"
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

exports.getContactPersonById = async (req, res, next) => {
  try {
    const {
      params: { contactPersonId },
    } = req;
    const contactPersonData = await getContactPersonData({
      contactPersonId,
    });
    sendJsonResponse(
      req,
      res,
      200,
      contactPersonData,
      true,
      "Contact person fetched successfully"
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

exports.updateContactPerson = async (req, res, next) => {
  try {
    const {
      body: {
        contactPersonName,
        contactPersonPosition,
        contactPersonNumber,
        contactPersonAlternateNumber,
        referenceType,
        referenceId,
      },
      params: { contactPersonId },
    } = req;

    const objContactPersonData = {
      contactPersonName,
      contactPersonPosition,
      contactPersonNumber,
      contactPersonAlternateNumber,
      referenceType,
      referenceId,
      contactPersonId,
    };

    await updateContactPersonData(objContactPersonData);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Contact person updated successfully"
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

exports.deleteContactPerson = async (req, res, next) => {
  try {
    const {
      params: { contactPersonId },
    } = req;
    await deleteContactPersonData(contactPersonId);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Contact person deleted successfully"
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

exports.searchCustomerEntity = async (req, res, next) => {
  try {
    const {
      params: { searchParam },
    } = req;

    const promise1 = searchFromCustomer(searchParam);
    const promise2 = searchFromBranch(searchParam);
    const promise3 = searchFromDepartment(searchParam);
    const promise4 = searchFromContactPerson(searchParam);

    const searchData = await Promise.all([
      promise1,
      promise2,
      promise3,
      promise4,
    ]);

    console.log("searchData ::::::::::: ", searchData);
    sendJsonResponse(
      req,
      res,
      200,
      {
        arrCustomerData: searchData[0],
        arrBranchData: searchData[1],
        arrDepartmentData: searchData[2],
        arrContactPersonData: searchData[3],
      },
      true,
      "Customer search data"
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
