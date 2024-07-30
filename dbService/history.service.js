const _ = require("lodash");
const { History } = require("../models");

exports.createHistoryRecords = async (objParams) => {
  try {
    const { userId, relatedId, typeX, description } = objParams;

    const historyData = await History.create({
      userId,
      relatedId,
      typeX,
      description,
    });

    return historyData;
  } catch (error) {
    return error;
  }
};

exports.getHistoryRecords = async (objParams) => {
  try {
    const { relatedId, typeX } = objParams;

    let historyData = await History.findAll({
      where: {
        relatedId,
        typeX,
      },
      order: [["id", "DESC"]],
    });

    return historyData;
  } catch (error) {
    return error;
  }
};
