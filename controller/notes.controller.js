const _ = require("lodash");
const { sendJsonResponse } = require("../config/helper/renderer");

const { getRawJson } = require("../config/helper/utility");
const {
  createNotesData,
  getNotesData,
} = require("../dbService/notes.services");

exports.createNotes = async (req, res, next) => {
  try {
    const {
      body: { relatedId, typeX, description, followUpData },
      loggedInUserInfo: { id },
    } = req;

    const objParams = {
      userId: id,
      relatedId,
      typeX,
      description,
      followUpData,
    };

    const data = await createNotesData(objParams);

    sendJsonResponse(req, res, 200, data, true, "note created successfully");
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

exports.getNotes = async (req, res, next) => {
  try {
    const {
      query: { relatedId, typeX },
    } = req;

    const objParams = { relatedId, typeX };

    const data = await getNotesData(objParams);

    sendJsonResponse(req, res, 200, data, true, "note fetched successfully");
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
