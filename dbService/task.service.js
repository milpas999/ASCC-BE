const _ = require("lodash");
const { Tasks, Users } = require("../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { deleteOperation } = require("../config/helper/db-utility");
const { Op } = require("sequelize");
const { getRawJson } = require("../config/helper/utility");

exports.getTaskData = async (objParams) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: {
          assignedTo = "",
          taskStatus = "",
          status = "",
          startDate = "",
          endDate = "",
        } = {},
      } = { pagination: {}, filter: {} },
      taskId,
    } = objParams || {};

    let taskDataWhere = {};

    if (!_.isEmpty(taskId)) {
      taskDataWhere.id = taskId;
    }

    if (!_.isEmpty(status)) {
      taskDataWhere.status = status;
    }

    if (!_.isEmpty(taskStatus)) {
      taskDataWhere.taskStatus = taskStatus;
    }

    if (!_.isEmpty(assignedTo)) {
      taskDataWhere.assignedTo = assignedTo;
    }

    if (!_.isEmpty(startDate)) {
      taskDataWhere.startDate = startDate;
    }

    if (!_.isEmpty(endDate)) {
      taskDataWhere.endDate = endDate;
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

    let taskListData = await Tasks.findAll({
      include: [
        {
          model: Users,
          as: "assignedUser",
          attributes: ["id", "name", "email"],
        },
      ],
      where: {
        ...taskDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    const dataCount = await Tasks.count({
      where: { ...taskDataWhere, ...deleteOperation() },
    });

    return { data: taskListData, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.createTaskData = async (objParams) => {
  try {
    const {
      assignedTo,
      taskStatus,
      description,
      startDate,
      endDate,
      plannedHours,
      actualHours,
    } = objParams;

    const taskData = await Tasks.create({
      assignedTo,
      taskStatus,
      description,
      startDate,
      endDate,
      plannedHours,
      actualHours,
    });

    return taskData;
  } catch (error) {
    return error;
  }
};

exports.updateTaskData = async (objParams) => {
  try {
    const {
      assignedTo,
      taskStatus,
      description,
      startDate,
      endDate,
      plannedHours,
      actualHours,
      taskId,
    } = objParams;

    await Tasks.update(
      {
        assignedTo,
        taskStatus,
        description,
        startDate,
        endDate,
        plannedHours,
        actualHours,
      },
      {
        where: {
          id: taskId,
        },
      }
    );

    return true;
  } catch (error) {
    return error;
  }
};

exports.updateTaskStatusData = async (taskId, status) => {
  try {
    await Tasks.update(
      {
        status: status === "A" ? "I" : "A",
      },
      {
        where: {
          id: taskId,
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteTaskData = async (taskId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await Tasks.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: taskId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};
