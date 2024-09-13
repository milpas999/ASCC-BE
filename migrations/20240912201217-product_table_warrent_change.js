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
      await queryInterface.addColumn(
        "Product",
        "warrantyTerm",
        {
          type: Sequelize.STRING,
          defaultValue: "",
          after: "warrenty",
        },
        { transaction: t }
      );
      await queryInterface.addColumn(
        "Product",
        "warrantyDescription",
        {
          type: Sequelize.TEXT,
          defaultValue: "",
          after: "warrantyTerm",
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
    await queryInterface.removeColumn("Product", "warrantyTerm", {
      transaction: t,
    });
    await queryInterface.removeColumn("Product", "warrantyDescription", {
      transaction: t,
    });
  },
};
