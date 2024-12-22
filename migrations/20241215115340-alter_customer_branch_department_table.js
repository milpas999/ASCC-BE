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
      await queryInterface.removeColumn("Branch", "contactPersonName", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "contactPersonDesignation", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "contactPersonMobileNumber", {
        transaction: t,
      });

      await queryInterface.removeColumn("Department", "contactPersonName", {
        transaction: t,
      });
      await queryInterface.removeColumn(
        "Department",
        "contactPersonDesignation",
        {
          transaction: t,
        }
      );
      await queryInterface.removeColumn(
        "Department",
        "contactPersonMobileNumber",
        {
          transaction: t,
        }
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
  },
};
