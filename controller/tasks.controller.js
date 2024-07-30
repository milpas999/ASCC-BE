const { sendJsonResponse } = require("../config/helper/renderer");
const { getRawJson } = require("../config/helper/utility");
const {
  createHistoryRecords,
  getHistoryRecords,
} = require("../dbService/history.service");

const {
  createTaskData,
  getTaskData,
  updateTaskData,
  updateTaskStatusData,
  deleteTaskData,
} = require("../dbService/task.service");

exports.getTaskList = async (req, res, next) => {
  try {
    const {
      query: { filterParams },
    } = req;

    const taskListData = await getTaskData({ filterParams });

    sendJsonResponse(
      req,
      res,
      200,
      taskListData,
      true,
      "Task list fetched successfully"
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

exports.getTaskById = async (req, res, next) => {
  try {
    const {
      params: { taskId },
    } = req;

    const taskListData = await getTaskData({ taskId });

    sendJsonResponse(
      req,
      res,
      200,
      taskListData,
      true,
      "Task data fetched successfully"
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

exports.updateTask = async (req, res, next) => {
  try {
    const {
      body: {
        assignedTo,
        taskStatus,
        description,
        startDate,
        endDate,
        plannedHours,
        actualHours,
      },
      params: { taskId },
    } = req;

    const objParams = {
      assignedTo,
      taskStatus,
      description,
      startDate,
      endDate,
      plannedHours,
      actualHours,
      taskId,
    };

    await updateTaskData(objParams);

    sendJsonResponse(req, res, 200, {}, true, "Task updated successfully");
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

exports.createTask = async (req, res, next) => {
  try {
    const {
      body: {
        assignedTo,
        taskStatus,
        description,
        startDate,
        endDate,
        plannedHours,
        actualHours,
      },
      loggedInUserInfo: { id: userId },
    } = req;

    const objParams = {
      assignedTo,
      taskStatus,
      description,
      startDate,
      endDate,
      plannedHours,
      actualHours,
    };

    const newTaskInserted = await createTaskData(objParams);

    const newTaskInsertedRaw = await getRawJson(newTaskInserted);

    const objTaskHistoryParams = {
      userId,
      relatedId: newTaskInsertedRaw.id,
      typeX: "TASKS",
      description: `Task created by ${userId}`,
    };
    createHistoryRecords(objTaskHistoryParams);

    sendJsonResponse(
      req,
      res,
      200,
      newTaskInsertedRaw,
      true,
      "Task added successfully"
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

exports.changeTaskStatus = async (req, res, next) => {
  try {
    const {
      params: { taskId, status },
    } = req;

    await updateTaskStatusData(taskId, status);

    sendJsonResponse(
      req,
      res,
      200,
      {},
      true,
      "Task status updated successfully"
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

exports.deleteTask = async (req, res, next) => {
  try {
    const {
      params: { taskId },
    } = req;
    await deleteTaskData(taskId);

    sendJsonResponse(req, res, 200, {}, true, "Task deleted successfully");
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

exports.getTaskHistory = async (req, res, next) => {
  try {
    const {
      params: { taskId },
    } = req;

    const objParamsForHistoryRecords = {
      relatedId: taskId,
      typeX: "TASKS",
    };

    const taskHistoryData = await getHistoryRecords(objParamsForHistoryRecords);

    sendJsonResponse(
      req,
      res,
      200,
      taskHistoryData,
      true,
      "Task history fetched successfully"
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
