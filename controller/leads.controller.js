const _ = require("lodash");
const { sendJsonResponse } = require("../config/helper/renderer");

const {
  createLeadsCustomerData,
  getLeadsCustomerData,
  createLeadsData,
  getLeadsData,
  updateLeadsStatusData,
  deleteLeadsData,
  updateLeadsData,
} = require("../dbService/leads.service");

const { getRawJson } = require("../config/helper/utility");

exports.getLeadsById = async (req, res, next) => {
  try {
    const {
      params: { leadId },
    } = req;

    const objParams = {
      leadId,
    };
    const data = await getLeadsData(objParams);

    sendJsonResponse(
      req,
      res,
      200,
      data,
      true,
      "lead customer fetched successfully"
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

exports.getLeads = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;

    const data = await getLeadsData({ filterParams });

    sendJsonResponse(
      req,
      res,
      200,
      data,
      true,
      "lead customer created fetched successfully"
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

exports.createLeads = async (req, res, next) => {
  try {
    const {
      body: { leadsCustomerId, source, description, progress },
    } = req;

    const objParams = {
      leadsCustomerId,
      source,
      description,
      progress,
    };

    const data = await createLeadsData(objParams);

    sendJsonResponse(req, res, 200, data, true, "lead created successfully");
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

exports.createLeadsCustomer = async (req, res, next) => {
  try {
    const {
      body: { name, email },
    } = req;

    const objParams = {
      name,
      email,
    };

    const data = await createLeadsCustomerData(objParams);

    const customerLeadRawData = await getRawJson(data);

    sendJsonResponse(
      req,
      res,
      200,
      customerLeadRawData,
      true,
      "lead customer created successfully"
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

exports.getLeadsCustomer = async (req, res, next) => {
  try {
    const data = await getLeadsCustomerData();

    sendJsonResponse(
      req,
      res,
      200,
      data,
      true,
      "lead customer created fetched successfully"
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

exports.updateLeadStatus = async (req, res, next) => {
  try {
    const {
      params: { leadId, status },
    } = req;
    await updateLeadsStatusData(leadId, status);
    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Leads status updated successfully"
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

exports.deleteLeadsById = async (req, res, next) => {
  try {
    const {
      params: { leadId },
    } = req;

    await deleteLeadsData(leadId);

    sendJsonResponse(req, res, 200, {}, true, "Leads deleted successfully");
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

exports.updateLeadsById = async (req, res, next) => {
  try {
    const {
      body: { leadsCustomerId, source, description, progress },
      params: { leadId },
    } = req;

    const objParams = {
      leadsCustomerId,
      source,
      description,
      progress,
      leadId,
    };

    console.log("objParams ::::::::::: ", objParams);

    const data = await updateLeadsData(objParams);

    sendJsonResponse(req, res, 200, data, true, "lead updated successfully");
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
