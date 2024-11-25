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
      await queryInterface.removeColumn("Customer", "name", {
        transaction: t,
      });

      await queryInterface.addColumn(
        "Customer",
        "companyName",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "id",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Customer",
        "customerName",
        {
          type: Sequelize.STRING,
          allowNull: true,
          after: "companyName",
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
