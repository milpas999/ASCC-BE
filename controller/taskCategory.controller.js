const _ = require("lodash");
const { sendJsonResponse } = require("../config/helper/renderer");
const { CustomError } = require("../config/helper/customError");

const { getRawJson } = require("../config/helper/utility");
const {
  addTaskCategoryData,
  getTaskCategoryData,
  deleteTaskCategoryByIdData,
  updateTaskCategoryByIdData,
} = require("../dbService/taskCategory.service");

exports.addTaskCategory = async (req, res, next) => {
  try {
    const {
      body: { taskCategoryName },
    } = req;

    const objParams = {
      taskCategoryName,
    };

    const newTaskCategory = await addTaskCategoryData(objParams);

    sendJsonResponse(
      req,
      res,
      200,
      newTaskCategory,
      true,
      "Task category added successfully"
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

exports.getTaskCategoryList = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;

    const taskCategoryData = await getTaskCategoryData({ filterParams });
    sendJsonResponse(
      req,
      res,
      200,
      taskCategoryData,
      true,
      "Task category list fetched"
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

exports.getTaskCategoryById = async (req, res, next) => {
  try {
    const {
      params: { taskCategoryId },
    } = req;

    const taskCategoryData = await getTaskCategoryData({ taskCategoryId });
    sendJsonResponse(
      req,
      res,
      200,
      taskCategoryData,
      true,
      "Task category list fetched"
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

exports.deleteTaskCategoryById = async (req, res, next) => {
  try {
    const {
      params: { taskCategoryId },
    } = req;

    const taskCategoryData = await deleteTaskCategoryByIdData(taskCategoryId);

    sendJsonResponse(
      req,
      res,
      200,
      taskCategoryData,
      true,
      "Task category deleted sucessfully"
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

exports.updateTaskCategoryById = async (req, res, next) => {
  try {
    const {
      params: { taskCategoryId },
      body: { taskCategoryName },
    } = req;

    const objParams = {
      taskCategoryName,
      taskCategoryId,
    };

    const taskCategoryData = await updateTaskCategoryByIdData(objParams);

    sendJsonResponse(
      req,
      res,
      200,
      taskCategoryData,
      true,
      "Task category updated sucessfully"
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
