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
        "Tasks",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          assignedTo: {
            type: Sequelize.BIGINT,
            references: {
              model: "Users", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            allowNull: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
            default: "",
          },
          startDate: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          endDate: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          plannedHours: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },
          actualHours: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
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

      await queryInterface.createTable(
        "History",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          userId: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          relatedId: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          typeX: {
            type: Sequelize.ENUM,
            values: ["LEADS", "TASKS", "COMPLAINT"],
            defaultValue: "LEADS",
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false,
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
      await queryInterface.dropTable("Tasks", { transaction: t });
      await queryInterface.dropTable("History", { transaction: t });
    });
  },
};
