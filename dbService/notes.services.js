const { deleteOperation } = require("../config/helper/db-utility");
const { Notes, Users, User } = require("../models");

exports.createNotesData = async (objParams) => {
  try {
    const { userId, relatedId, typeX, description, followUpData } = objParams;

    const noteData = await Notes.create({
      userId,
      relatedId,
      typeX,
      description,
      followUpData,
    });

    return noteData;
  } catch (error) {
    throw error;
  }
};

exports.getNotesData = async (objParams) => {
  try {
    const { relatedId, typeX } = objParams;

    const noteData = await Notes.findAll({
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      where: {
        relatedId,
        typeX,
        ...deleteOperation(),
      },
      order: [["id", "DESC"]],
    });

    return noteData;
  } catch (error) {
    throw error;
  }
};
