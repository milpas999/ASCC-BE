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
        "Customer",
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
          website: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          address: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          dob: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          anniversaryDate: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
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
        "Branch",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          customerId: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: "Customer",
              key: "id",
            },
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          department: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          contactPersonName: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          contactPersonPosition: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          location: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          branchAddress: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          branchContactNumber: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          branchAlternateContactNumber: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          branchEmail: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          flagDefault: {
            type: Sequelize.ENUM,
            values: ["Y", "N"],
            defaultValue: "N",
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
      await queryInterface.dropTable("Customer", { transaction: t });
    });

    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("Branch", { transaction: t });
    });
  },
};
