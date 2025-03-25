const _ = require("lodash");

const { TaskCategory } = require("../models");
const { deleteOperation } = require("../config/helper/db-utility");
const { Op } = require("sequelize");
const { getCurrentDateTime } = require("../config/helper/date-utils");

exports.addTaskCategoryData = async (objParams) => {
  try {
    const { taskCategoryName } = objParams;

    const taskCategoryData = await TaskCategory.create({
      taskCategoryName,
    });

    return taskCategoryData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.getTaskCategoryData = async (objParams) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: { taskCategoryName = "", status = "" } = {},
      } = { pagination: {}, filter: {} },
      taskCategoryId,
    } = objParams || {};

    let taskCategoryDataWhere = {};

    if (!_.isEmpty(taskCategoryId)) {
      taskCategoryDataWhere.id = taskCategoryId;
    }

    if (!_.isEmpty(status)) {
      taskCategoryDataWhere.status = status;
    }

    if (!_.isEmpty(taskCategoryName)) {
      taskCategoryDataWhere.taskCategoryName = {
        [Op.like]: `%${taskCategoryName}%`,
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

    let taskCategoryData = await TaskCategory.findAll({
      where: {
        ...taskCategoryDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    const dataCount = await TaskCategory.count({
      where: { ...taskCategoryDataWhere, ...deleteOperation() },
    });

    return { data: taskCategoryData, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteTaskCategoryByIdData = async (taskCategoryId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await TaskCategory.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: taskCategoryId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

exports.updateTaskCategoryByIdData = async (objParams) => {
  try {
    const { taskCategoryName, taskCategoryId } = objParams;
    await TaskCategory.update(
      {
        taskCategoryName,
      },
      {
        where: {
          id: taskCategoryId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};
