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
        "Users",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          mobileNumber: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          userGroupId: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          address: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          dateOfJoining: {
            type: Sequelize.DATEONLY,
            allowNull: true,
          },
          profileImageId: {
            type: Sequelize.BIGINT,
            allowNull: true,
          },
          status: {
            type: Sequelize.ENUM,
            values: ["A", "I"],
            defaultValue: "I",
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
      await queryInterface.dropTable("Users", { transaction: t });
    });
  },
};
