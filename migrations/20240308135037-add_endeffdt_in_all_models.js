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
      // await queryInterface.dropTable("ModuleOptions", { transaction: t });

      await queryInterface.addColumn(
        "Users",
        "endeffdt",
        {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "UserToken",
        "endeffdt",
        {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "SystemModules",
        "endeffdt",
        {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "ModuleOptions",
        "endeffdt",
        {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
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
      // await queryInterface.dropTable("ModuleOptions", { transaction: t });
      await queryInterface.removeColumn("Users", "endeffdt", {
        transaction: t,
      });
      await queryInterface.removeColumn("UserToken", "endeffdt", {
        transaction: t,
      });
      await queryInterface.removeColumn("SystemModules", "endeffdt", {
        transaction: t,
      });
      await queryInterface.removeColumn("ModuleOptions", "endeffdt", {
        transaction: t,
      });
    });
  },
};
