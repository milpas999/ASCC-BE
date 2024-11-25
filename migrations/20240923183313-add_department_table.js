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
      await queryInterface.createTable(
        "Department",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          customerId: {
            type: Sequelize.BIGINT,
            references: {
              model: "Customer", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            allowNull: false,
          },
          branchId: {
            type: Sequelize.BIGINT,
            references: {
              model: "Branch", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          contactPerson: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          contactPersonPosition: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          contactPersonNumber: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          alternateContactNumber: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
            default: "",
          },
          status: {
            type: Sequelize.ENUM,
            values: ["A", "I"],
            defaultValue: "A",
          },
          // Timestamps
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          // delete flag
          endeffdt: {
            allowNull: true,
            type: Sequelize.DATE,
            default: null,
          },
        },
        { transaction: t, timestamps: true }
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
      await queryInterface.dropTable("Department", { transaction: t });
    });
  },
};
