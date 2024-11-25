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
      await queryInterface.removeColumn("Department", "name", {
        transaction: t,
      });

      await queryInterface.removeColumn("Department", "contactPerson", {
        transaction: t,
      });
      await queryInterface.removeColumn("Department", "contactPersonPosition", {
        transaction: t,
      });
      await queryInterface.removeColumn("Department", "contactPersonNumber", {
        transaction: t,
      });

      await queryInterface.removeColumn(
        "Department",
        "alternateContactNumber",
        {
          transaction: t,
        }
      );

      await queryInterface.addColumn(
        "Department",
        "departmentName",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "branchId",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Department",
        "contactPersonName",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "departmentName",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Department",
        "contactPersonDesignation",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "contactPersonName",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Department",
        "contactPersonMobileNumber",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "contactPersonDesignation",
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
  },
};
