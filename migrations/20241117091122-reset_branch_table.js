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
      await queryInterface.removeColumn("Branch", "name", { transaction: t });
      await queryInterface.removeColumn("Branch", "department", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "contactPersonName", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "contactPersonPosition", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "location", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "branchAddress", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "branchContactNumber", {
        transaction: t,
      });
      await queryInterface.removeColumn(
        "Branch",
        "branchAlternateContactNumber",
        { transaction: t }
      );
      await queryInterface.removeColumn("Branch", "branchEmail", {
        transaction: t,
      });
      await queryInterface.removeColumn("Branch", "description", {
        transaction: t,
      });

      await queryInterface.addColumn(
        "Branch",
        "branchName",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "customerId",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Branch",
        "branchAddress",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "branchName",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Branch",
        "location",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "branchAddress",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Branch",
        "contactPersonName",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "location",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Branch",
        "contactPersonDesignation",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "contactPersonName",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Branch",
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
