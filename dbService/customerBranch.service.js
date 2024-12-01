const _ = require("lodash");

const { Customer, Branch, Department } = require("../models");
const { getCurrentDateTime } = require("../config/helper/date-utils");
const { deleteOperation } = require("../config/helper/db-utility");
const { Op } = require("sequelize");
const { getRawJson } = require("../config/helper/utility");

exports.addCustomerData = async (objParams) => {
  try {
    const {
      companyName,
      customerName,
      contactNumber,
      website,
      address,
      phone,
      location,
      dob,
      anniversaryDate,
      description,
    } = objParams;

    const customerData = await Customer.create({
      companyName,
      customerName,
      phone: contactNumber,
      website,
      address,
      location,
      dob,
      anniversaryDate,
      description,
    });

    return customerData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.getCustomerData = async (objParams) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: {
          name = "",
          website = "",
          address = "",
          status = "",
          description = "",
          phone = "",
          search = "",
        } = {},
      } = { pagination: {}, filter: {} },
      customerId,
    } = objParams || {};

    let customerDataWhere = {};

    if (!_.isEmpty(customerId)) {
      customerDataWhere.id = customerId;
    }

    if (!_.isEmpty(status)) {
      customerDataWhere.status = status;
    }

    if (!_.isEmpty(search)) {
      customerDataWhere = {
        [Op.or]: [
          { companyName: { [Op.like]: `%${search}%` } },
          { customerName: { [Op.like]: `%${search}%` } },
          { website: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // if (!_.isEmpty(name)) {
    //   customerDataWhere.name = {
    //     [Op.like]: `%${name}%`,
    //   };
    // }

    // if (!_.isEmpty(website)) {
    //   customerDataWhere.website = {
    //     [Op.like]: `%${website}%`,
    //   };
    // }

    // if (!_.isEmpty(address)) {
    //   customerDataWhere.address = {
    //     [Op.like]: `%${address}%`,
    //   };
    // }

    // if (!_.isEmpty(description)) {
    //   customerDataWhere.description = {
    //     [Op.like]: `%${description}%`,
    //   };
    // }

    // if (!_.isEmpty(phone)) {
    //   customerDataWhere.phone = {
    //     [Op.like]: `%${phone}%`,
    //   };
    // }

    let sorterField = "id";
    let sorterOrder = "ASC";

    if (!_.isEmpty(table) && !_.isEmpty(table.sorter)) {
      const { column = [], order = "ascend", field = "name" } = table.sorter;
      sorterOrder = order === "ascend" ? "ASC" : "DESC";
      sorterField = field;
    }
    const offset = (current - 1) * pageSize;

    let customerListData = await Customer.findAll({
      where: {
        ...customerDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    const dataCount = await Customer.count({
      where: { ...customerDataWhere, ...deleteOperation() },
    });

    return { data: customerListData, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteCustomerData = async (customerId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await Customer.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: customerId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

exports.updateCustomerData = async (objParams) => {
  try {
    const {
      companyName,
      customerName,
      contactNumber,
      website,
      address,
      phone,
      location,
      dob,
      anniversaryDate,
      description,
      customerId,
    } = objParams;
    const customerData = await Customer.update(
      {
        companyName,
        customerName,
        phone: contactNumber,
        website,
        address,
        location,
        dob,
        anniversaryDate,
        description,
      },
      {
        where: {
          id: customerId,
        },
      }
    );
    return customerData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.updateCategoryStatusData = async (customerId, status) => {
  try {
    await Customer.update(
      {
        status: status === "A" ? "I" : "A",
      },
      {
        where: {
          id: customerId,
        },
      }
    );
    return true;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.addCustomerBranchData = async (objParams) => {
  try {
    const {
      branchName,
      branchAddress,
      location,
      contactPersonName,
      contactPersonDesignation,
      contactPersonMobileNumber,
      customerId,
    } = objParams;

    const customerData = await Branch.create({
      branchName,
      branchAddress,
      location,
      contactPersonName,
      contactPersonDesignation,
      contactPersonMobileNumber,
      customerId,
    });

    return customerData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.updateCustomerBranchData = async (objParams) => {
  try {
    const {
      branchName,
      branchAddress,
      location,
      contactPersonName,
      contactPersonDesignation,
      contactPersonMobileNumber,
      customerId,
      branchId,
    } = objParams;

    const customerBranchData = await Branch.update(
      {
        branchName,
        branchAddress,
        location,
        contactPersonName,
        contactPersonDesignation,
        contactPersonMobileNumber,
      },
      {
        where: {
          id: branchId,
          customerId,
        },
      }
    );

    return customerBranchData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

/**
 * Retrieves customer branch data based on the provided parameters.
 *
 * @param {Object} objParams - The parameters object.
 * @param {Object} [objParams.filterParams] - The filter parameters.
 * @param {Object} [objParams.filterParams.pagination] - The pagination parameters.
 * @param {number} [objParams.filterParams.pagination.current=1] - The current page number.
 * @param {number} [objParams.filterParams.pagination.pageSize=10] - The page size.
 * @param {string} [objParams.filterParams.table] - The table name.
 * @param {Object} [objParams.filterParams.filter] - The filter parameters.
 * @param {string} [objParams.filterParams.filter.name] - The name filter.
 * @param {string} [objParams.filterParams.filter.contactPersonName] - The contact person name filter.
 * @param {string} [objParams.filterParams.filter.status] - The status filter.
 * @param {string} [objParams.filterParams.filter.branchAddress] - The branch address filter.
 * @param {string} [objParams.filterParams.filter.flagDefault] - The default flag filter.
 * @param {string} [objParams.customerId] - The customer ID.
 * @param {string} [objParams.customerBranchId] - The customer branch ID.
 * @returns {Promise<{ data: any[], dataCount: number }>} - The customer branch data and the total count.
 */
exports.getCustomerBranchData = async (objParams) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: {
          branchName = "",
          contactPersonName = "",
          status = "",
          branchAddress = "",
          flagDefault = "",
        } = {},
      } = { pagination: {}, filter: {} },
      customerId,
      customerBranchId,
    } = objParams || {};

    let customerBranchDataWhere = {};

    if (!_.isEmpty(customerBranchId)) {
      customerBranchDataWhere.id = customerBranchId;
    }

    if (!_.isEmpty(customerId)) {
      customerBranchDataWhere.customerId = customerId;
    }

    if (!_.isEmpty(status)) {
      customerBranchDataWhere.status = status;
    }

    if (!_.isEmpty(branchName)) {
      customerBranchDataWhere.branchName = {
        [Op.like]: `%${branchName}%`,
      };
    }

    if (!_.isEmpty(contactPersonName)) {
      customerBranchDataWhere.contactPersonName = {
        [Op.like]: `%${contactPersonName}%`,
      };
    }

    if (!_.isEmpty(branchAddress)) {
      customerBranchDataWhere.branchAddress = {
        [Op.like]: `%${branchAddress}%`,
      };
    }

    if (!_.isEmpty(flagDefault)) {
      customerBranchDataWhere.flagDefault = flagDefault;
    }

    let sorterField = "id";
    let sorterOrder = "ASC";

    if (!_.isEmpty(table) && !_.isEmpty(table.sorter)) {
      const {
        column = [],
        order = "ascend",
        field = "branchName",
      } = table.sorter;
      sorterOrder = order === "ascend" ? "ASC" : "DESC";
      sorterField = field;
    }
    const offset = (current - 1) * pageSize;

    let customerListData = await Branch.findAll({
      where: {
        ...customerBranchDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    const dataCount = await Branch.count({
      where: { ...customerBranchDataWhere, ...deleteOperation() },
    });

    return { data: customerListData, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteCustomerBranchData = async (customerId, branchId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await Branch.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: branchId,
          customerId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

exports.setDefaultCustomerBranchData = async (customerId, branchId) => {
  try {
    await Branch.update(
      {
        flagDefault: "N",
      },
      {
        where: {
          customerId,
          ...deleteOperation(),
        },
      }
    );

    await Branch.update(
      {
        flagDefault: "Y",
      },
      {
        where: {
          customerId,
          id: branchId,
          ...deleteOperation(),
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};

exports.addCustomerBranchDepartmentData = async (objParams) => {
  try {
    const {
      departmentName,
      contactPersonName,
      contactPersonDesignation,
      contactPersonMobileNumber,
      alternateContactNumber,
      email,
      description,
      customerId,
      branchId,
    } = objParams;

    const departmentData = await Department.create({
      departmentName,
      contactPersonName,
      contactPersonDesignation,
      contactPersonMobileNumber,
      alternateContactNumber,
      email,
      description,
      customerId,
      branchId,
    });

    return departmentData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.getCustomerBranchDepartmentData = async (objParams) => {
  try {
    const {
      filterParams: {
        pagination: { current = 1, pageSize = 10 } = {},
        table,
        filter: {
          departmentName = "",
          contactPersonName = "",
          status = "",
          branchAddress = "",
          flagDefault = "",
        } = {},
      } = { pagination: {}, filter: {} },
      customerId,
      branchId,
      departmentId = "",
    } = objParams || {};

    let customerBranchDepartmentDataWhere = {};

    if (!_.isEmpty(departmentId)) {
      customerBranchDepartmentDataWhere.id = departmentId;
    }

    if (!_.isEmpty(customerId)) {
      customerBranchDepartmentDataWhere.customerId = customerId;
    }

    if (!_.isEmpty(branchId)) {
      customerBranchDepartmentDataWhere.branchId = branchId;
    }

    if (!_.isEmpty(status)) {
      customerBranchDepartmentDataWhere.status = status;
    }

    if (!_.isEmpty(departmentName)) {
      customerBranchDepartmentDataWhere.departmentName = {
        [Op.like]: `%${departmentName}%`,
      };
    }

    if (!_.isEmpty(contactPersonName)) {
      customerBranchDepartmentDataWhere.contactPersonName = {
        [Op.like]: `%${contactPersonName}%`,
      };
    }

    let sorterField = "id";
    let sorterOrder = "ASC";

    if (!_.isEmpty(table) && !_.isEmpty(table.sorter)) {
      const {
        column = [],
        order = "ascend",
        field = "departmentName",
      } = table.sorter;
      sorterOrder = order === "ascend" ? "ASC" : "DESC";
      sorterField = field;
    }
    const offset = (current - 1) * pageSize;

    let departmentListData = await Department.findAll({
      where: {
        ...customerBranchDepartmentDataWhere,
        ...deleteOperation(),
      },
      limit: _.toInteger(pageSize),
      offset: _.toInteger(offset),
      order: [[sorterField, sorterOrder]],
    });

    const dataCount = await Department.count({
      where: { ...customerBranchDepartmentDataWhere, ...deleteOperation() },
    });

    return { data: departmentListData, dataCount };
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.updateDepartmentData = async (objParams) => {
  try {
    const {
      departmentName,
      contactPersonName,
      contactPersonDesignation,
      contactPersonMobileNumber,
      alternateContactNumber,
      email,
      description,
      customerId,
      branchId,
      departmentId,
    } = objParams;

    const departmentData = await Department.update(
      {
        departmentName,
        contactPersonName,
        contactPersonDesignation,
        contactPersonMobileNumber,
        alternateContactNumber,
        email,
        description,
      },
      {
        where: {
          id: departmentId,
          branchId,
          customerId,
        },
      }
    );

    return departmentData;
  } catch (error) {
    console.log("error :: ", error);
    throw error;
  }
};

exports.deleteDepartmentData = async (customerId, branchId, departmentId) => {
  try {
    const currentDateTime = getCurrentDateTime();
    await Department.update(
      {
        endeffdt: currentDateTime,
      },
      {
        where: {
          id: departmentId,
          branchId,
          customerId,
        },
      }
    );

    return true;
  } catch (error) {
    console.log("error :: ", error);
    return error;
  }
};
