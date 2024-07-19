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
        "LeadsCustomer",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
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
        "Leads",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          LeadsCustomerId: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: "LeadsCustomer",
              key: "id",
            },
          },
          customerId: {
            type: Sequelize.BIGINT,
            allowNull: true,
            references: {
              model: "Customer",
              key: "id",
            },
          },
          source: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          progress: {
            type: Sequelize.INTEGER,
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
        "Leads",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          LeadsCustomerId: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          customerId: {
            type: Sequelize.BIGINT,
            allowNull: true,
          },
          source: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          progress: {
            type: Sequelize.INTEGER,
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
        "Notes",
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
          followUpData: {
            type: Sequelize.DATEONLY,
            defaultValue: null,
            allowNull: true,
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
      await queryInterface.dropTable("LeadsCustomer", { transaction: t });
      await queryInterface.dropTable("Leads", { transaction: t });
      await queryInterface.dropTable("Notes", { transaction: t });
    });
  },
};
