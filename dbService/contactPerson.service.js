const _ = require("lodash");

const {
  ContactPerson,
  ContactPersonBranchMapping,
  Branch,
  Department,
} = require("../models");

const { deleteOperation } = require("../config/helper/db-utility");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { Op } = require("sequelize");

exports.addContactPerson = async (objParams) => {
  try {
    const { name, number, position, alternateNumber } = objParams;

    const contactPersonData = await ContactPerson.create({
      contactPersonName: name,
      contactPersonPosition: position,
      contactPersonNumber: number,
      contactPersonAlternateNumber: alternateNumber,
    });

    return contactPersonData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.addContactPersonWithBranch = async (objParams) => {
  try {
    const { branchId, contactPersonId } = objParams;

    const contactPersonMapingData = await ContactPersonBranchMapping.create({
      contactPersonId,
      branchId,
    });

    return contactPersonMapingData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.addContactPersonData = async (objParams) => {
  try {
    const {
      contactPersonName,
      contactPersonPosition,
      contactPersonNumber,
      contactPersonAlternateNumber,
      referenceType,
      referenceId,
    } = objParams;

    const contactPersonData = await ContactPerson.create({
      contactPersonName,
      contactPersonPosition,
      contactPersonNumber,
      contactPersonAlternateNumber,
      referenceType,
      referenceId,
    });

    return contactPersonData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.updateContactPersonData = async (objParams) => {
  try {
    const {
      contactPersonName,
      contactPersonPosition,
      contactPersonNumber,
      contactPersonAlternateNumber,
      referenceType,
      referenceId,
      contactPersonId,
    } = objParams;
    console.log("objParams ::::::::::: ", objParams);

    const tttt = await ContactPerson.update(
      {
        contactPersonName,
        contactPersonPosition,
        contactPersonNumber,
        contactPersonAlternateNumber,
      },
      {
        where: {
          id: contactPersonId,
        },
      }
    );

    console.log("tttt ::::::::::::: ", tttt);

    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.getContactPersonData = async (objParams) => {
  try {
    // const { referenceType, referenceId, contactPersonId } = objParams;

    console.log("objParams ::::::::::::: ", objParams);

    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: {} = {},
      } = { pagination: {}, filter: {} },
      contactPersonId,
      referenceType,
      referenceId,
    } = objParams || {};

    let contactPersonWhere = {};

    if (!_.isEmpty(contactPersonId)) {
      contactPersonWhere.id = contactPersonId;
    }

    if (!_.isEmpty(referenceType)) {
      contactPersonWhere.referenceType = referenceType;
    }

    if (!_.isEmpty(referenceId)) {
      contactPersonWhere.referenceId = referenceId;
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
    console.log("contactPersonWhere ::::::::::::: ", contactPersonWhere);
    let contactPersonData = await ContactPerson.findAll({
      where: {
        ...contactPersonWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    return contactPersonData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteContactPersonData = async (contactPersonId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await ContactPerson.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: contactPersonId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

exports.searchFromContactPerson = async (searchParam) => {
  try {
    const arrContactPersonData = await ContactPerson.findAll({
      where: {
        [Op.or]: [
          { contactPersonName: { [Op.like]: `%${searchParam}%` } },
          { contactPersonPosition: { [Op.like]: `%${searchParam}%` } },
          { contactPersonNumber: { [Op.like]: `%${searchParam}%` } },
          { contactPersonAlternateNumber: { [Op.like]: `%${searchParam}%` } },
        ],
        ...deleteOperation(),
      },
      include: [
        {
          model: Branch,
          required: false, // Include Branch only if `referenceType` is "branch"
          where: {
            "$ContactPerson.referenceType$": "branch",
          },
        },
        {
          model: Department,
          required: false, // Include Department only if `referenceType` is "department"
          where: {
            "$ContactPerson.referenceType$": "department",
          },
        },
      ],
    });

    // Convert Sequelize instances to plain JavaScript objects
    const contactPersonData = arrContactPersonData.map((contactPerson) =>
      contactPerson.toJSON()
    );
    return contactPersonData;
  } catch (error) {
    throw error;
  }
};
