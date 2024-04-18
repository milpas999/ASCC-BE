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
        "UserGroupSystemModuleMapping",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          userGroupId: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: "UserGroup",
              key: "id",
            },
          },
          systemModuleId: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: "SystemModules",
              key: "id",
            },
          },
          systemModuleValue: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          moduleOptionId: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: "ModuleOptions",
              key: "id",
            },
          },
          moduleOptionValue: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
      await queryInterface.dropTable("UserGroupSystemModuleMapping", {
        transaction: t,
      });
    });
  },
};
