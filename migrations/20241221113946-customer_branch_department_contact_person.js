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
        "alternateContactNumber",
        {
          type: Sequelize.STRING,
          defaultValue: "",
          after: "phone",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Branch",
        "contactName",
        {
          type: Sequelize.STRING,
          defaultValue: "",
          after: "branchAddress",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Branch",
        "contactPosition",
        {
          type: Sequelize.STRING,
          defaultValue: "",
          after: "contactName",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Branch",
        "contactNumber",
        {
          type: Sequelize.STRING,
          defaultValue: "",
          after: "contactPosition",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Branch",
        "contactAlternateNumber",
        {
          type: Sequelize.STRING,
          defaultValue: "",
          after: "contactNumber",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Department",
        "contactName",
        {
          type: Sequelize.STRING,
          defaultValue: "",
          after: "departmentName",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Department",
        "contactPosition",
        {
          type: Sequelize.STRING,
          defaultValue: "",
          after: "contactName",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Department",
        "contactNumber",
        {
          type: Sequelize.STRING,
          defaultValue: "",
          after: "contactPosition",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Department",
        "contactAlternateNumber",
        {
          type: Sequelize.STRING,
          defaultValue: "",
          after: "contactNumber",
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
      await queryInterface.removeColumn("Customer", "alternateContactNumber", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "contactName", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "contactPosition", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "contactNumber", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "contactAlternateNumber", {
        transaction: t,
      });

      await queryInterface.removeColumn("Department", "contactName", {
        transaction: t,
      });
      await queryInterface.removeColumn("Department", "contactPosition", {
        transaction: t,
      });
      await queryInterface.removeColumn("Department", "contactNumber", {
        transaction: t,
      });
      await queryInterface.removeColumn(
        "Department",
        "contactAlternateNumber",
        {
          transaction: t,
        }
      );
    });
  },
};
