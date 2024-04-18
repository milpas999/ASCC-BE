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
        "ImageDocVideo",
        "resourceType",
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          defaultValue: "EMP",
          after: "typeX",
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
      await queryInterface.removeColumn("ImageDocVideo", "resourceType", {
        transaction: t,
      });
    });
  },
};
