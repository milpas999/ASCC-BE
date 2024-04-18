const { Op } = require("sequelize");
const { getCurrentDateTime } = require("./date-utils");

/**
 * Generates a Sequelize query to find records
 * where the end date is null or in the future.
 * Used to find active records.
 */
exports.deleteOperation = () => {
  const currentDateTime = getCurrentDateTime();

  return {
    [Op.and]: [
      {
        [Op.or]: [
          { endeffdt: null },
          { endeffdt: { [Op.gt]: currentDateTime } },
        ],
      },
    ],
  };
};
