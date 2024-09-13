const _ = require("lodash");

const { Amc } = require("../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { deleteOperation } = require("../config/helper/db-utility");

exports.addAmcData = async (objParams) => {
  try {
    const { customerId, description, startDate, endDate } = objParams;

    const amcData = await Amc.create({
      customerId,
      description,
      startDate,
      endDate,
    });

    return amcData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.getAmcListData = async (objParams) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: { customerId = "", description = "", status = "" } = {},
      } = { pagination: {}, filter: {} },
      amcId,
    } = objParams || {};

    let amcDataWhere = {};

    if (!_.isEmpty(amcId)) {
      amcDataWhere.id = amcId;
    }

    if (!_.isEmpty(customerId)) {
      amcDataWhere.customerId = customerId;
    }

    if (!_.isEmpty(startDate)) {
      amcDataWhere.startDate = startDate;
    }

    if (!_.isEmpty(endDate)) {
      amcDataWhere.endDate = endDate;
    }

    if (!_.isEmpty(status)) {
      amcDataWhere.status = status;
    }

    if (!_.isEmpty(description)) {
      amcDataWhere.description = {
        [Op.like]: `%${description}%`,
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

    let amcListData = await Amc.findAll({
      where: {
        ...amcDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    const dataCount = await Amc.count({
      where: { ...amcDataWhere, ...deleteOperation() },
    });

    return { data: amcListData, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.updateAmcData = async (objParams) => {
  try {
    const { amcId, customerId, description, startDate, endDate } = objParams;
    await Amc.update(
      {
        customerId,
        description,
        startDate,
        endDate,
      },
      {
        where: {
          id: amcId,
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.updateAmcStatusData = async (amcId, currentStatus) => {
  try {
    await Amc.update(
      {
        status: currentStatus === "A" ? "I" : "A",
      },
      {
        where: {
          id: amcId,
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteAmcData = async (amcId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await Amc.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: amcId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};
