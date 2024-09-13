const { sendJsonResponse } = require("../config/helper/renderer");

const { getRawJson } = require("../config/helper/utility");

exports.addAmc = async (req, res, next) => {
  try {
    sendJsonResponse(
      req,
      res,
      200,
      newBrandRaw,
      true,
      "Brand added successfully"
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

exports.getAmcList = async (req, res, next) => {
  try {
    sendJsonResponse(
      req,
      res,
      200,
      newBrandRaw,
      true,
      "Brand added successfully"
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

exports.getAmcById = async (req, res, next) => {
  try {
    sendJsonResponse(
      req,
      res,
      200,
      newBrandRaw,
      true,
      "Brand added successfully"
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

exports.updateAmc = async (req, res, next) => {
  try {
    sendJsonResponse(
      req,
      res,
      200,
      newBrandRaw,
      true,
      "Brand added successfully"
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

exports.updateAmcStatus = async (req, res, next) => {
  try {
    sendJsonResponse(
      req,
      res,
      200,
      newBrandRaw,
      true,
      "Brand added successfully"
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

exports.deleteAmc = async (req, res, next) => {
  try {
    sendJsonResponse(
      req,
      res,
      200,
      newBrandRaw,
      true,
      "Brand added successfully"
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
