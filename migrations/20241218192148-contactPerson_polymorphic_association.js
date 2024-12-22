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
        "ContactPerson",
        "referenceType",
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          defaultValue: "branch",
          enumm: ["branch", "department"],
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "ContactPerson",
        "referenceId",
        {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: false,
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
      await queryInterface.removeColumn("ContactPerson", "referenceType", {
        transaction: t,
      });
      await queryInterface.removeColumn("ContactPerson", "referenceId", {
        transaction: t,
      });
    });
  },
};
