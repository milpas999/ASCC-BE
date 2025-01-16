"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        "Customer",
        "preferredStartTime",
        {
          type: Sequelize.TIME,
          defaultValue: null,
          after: "description",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Customer",
        "preferredEndTime",
        {
          type: Sequelize.TIME,
          defaultValue: null,
          after: "preferredStartTime",
        },
        { transaction: t }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn("Customer", "preferredStartTime", {
        transaction: t,
      });

      await queryInterface.removeColumn("Customer", "preferredEndTime", {
        transaction: t,
      });
    });
  },
};
