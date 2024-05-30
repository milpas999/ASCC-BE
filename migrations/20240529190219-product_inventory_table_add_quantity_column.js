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
        "ProductInventory",
        "quantity",
        {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
          after: "productId",
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
      await queryInterface.removeColumn("ProductInventory", "endeffdt", {
        transaction: t,
      });
    });
  },
};
