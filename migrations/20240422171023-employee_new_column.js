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
        "Users",
        "permanentAddress",
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
          after: "address",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Users",
        "dob",
        {
          type: Sequelize.DataTypes.DATEONLY,
          allowNull: true,
          defaultValue: null,
          after: "dateOfJoining",
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        "Users",
        "anniversaryDate",
        {
          type: Sequelize.DataTypes.DATEONLY,
          allowNull: true,
          defaultValue: null,
          after: "dateOfJoining",
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

    await queryInterface.removeColumn("Users", "permanentAddress", {
      transaction: t,
    });
    await queryInterface.removeColumn("Users", "dob", {
      transaction: t,
    });
    await queryInterface.removeColumn("Users", "anniversaryDate", {
      transaction: t,
    });
  },
};
