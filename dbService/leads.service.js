const _ = require("lodash");
const { deleteOperation } = require("../config/helper/db-utility");
const { LeadsCustomer, Leads } = require("../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");

exports.getLeadsData = async (objParams) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: {
          description = "",
          status = "",
          source = "",
          leadsCustomerId = "",
          customerId = "",
        } = {},
      } = { pagination: {}, filter: {} },
      leadId,
    } = objParams || {};

    let leadsDataWhere = {};

    if (!_.isEmpty(leadId)) {
      leadsDataWhere.id = leadId;
    }

    if (!_.isEmpty(status)) {
      leadsDataWhere.status = status;
    }

    if (!_.isEmpty(description)) {
      leadsDataWhere.description = {
        [Op.like]: `%${description}%`,
      };
    }

    if (!_.isEmpty(source)) {
      leadsDataWhere.source = {
        [Op.like]: `%${source}%`,
      };
    }

    if (!_.isEmpty(leadsCustomerId)) {
      leadsDataWhere.LeadsCustomerId = leadsCustomerId;
    }

    if (!_.isEmpty(customerId)) {
      leadsDataWhere.customerId = customerId;
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

    const leadData = await Leads.findAll({
      include: [
        {
          model: LeadsCustomer,
          as: "leadCustomerDetails",
          attributes: ["id", "name", "email"],
        },
      ],
      where: {
        ...leadsDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    const dataCount = await Leads.count({
      where: { ...leadsDataWhere, ...deleteOperation() },
    });

    return { data: leadData, dataCount };
  } catch (error) {
    throw error;
  }
};

exports.createLeadsData = async (objParams) => {
  try {
    const { leadsCustomerId, source, description, progress } = objParams;

    const leadData = await Leads.create({
      LeadsCustomerId: leadsCustomerId,
      source,
      description,
      progress,
    });

    return leadData;
  } catch (error) {
    throw error;
  }
};

exports.createLeadsCustomerData = async (objParams) => {
  try {
    const { name, email } = objParams;

    const leadCustomerData = await LeadsCustomer.create({
      name,
      email,
    });

    return leadCustomerData;
  } catch (error) {
    throw error;
  }
};

exports.getLeadsCustomerData = async () => {
  try {
    const leadCustomerData = await LeadsCustomer.findAll({
      where: {
        ...deleteOperation(),
      },
      order: [["name", "ASC"]],
    });

    return leadCustomerData;
  } catch (error) {
    throw error;
  }
};

exports.updateLeadsStatusData = async (leadId, status) => {
  try {
    await Leads.update(
      {
        status: status === "A" ? "I" : "A",
      },
      {
        where: {
          id: leadId,
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteLeadsData = async (leadId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await Leads.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: leadId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

exports.updateLeadsData = async (objParams) => {
  try {
    const { leadId, leadsCustomerId, source, description, progress } =
      objParams;

    await Leads.update(
      {
        LeadsCustomerId: leadsCustomerId,
        source,
        description,
        progress,
      },
      {
        where: {
          id: leadId,
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};
