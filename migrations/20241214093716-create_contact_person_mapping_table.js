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
        "ContactPersonBranchMapping",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          branchId: {
            type: Sequelize.BIGINT,
            references: {
              model: "Branch", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            allowNull: false,
          },
          contactPersonId: {
            type: Sequelize.BIGINT,
            references: {
              model: "ContactPerson", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            allowNull: false,
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
        "ContactPersonDepartmentMapping",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          departmentId: {
            type: Sequelize.BIGINT,
            references: {
              model: "Department", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            allowNull: false,
          },
          contactPersonId: {
            type: Sequelize.BIGINT,
            references: {
              model: "ContactPerson", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            allowNull: false,
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
      await queryInterface.dropTable("ContactPersonBranchMapping", {
        transaction: t,
      });
      await queryInterface.dropTable("ContactPersonDepartmentMapping", {
        transaction: t,
      });
    });
  },
};
