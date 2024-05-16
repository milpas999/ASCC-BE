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
        "Product",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
            default: "",
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          categoryId: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: 0,
          },
          subCategoryId: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: 0,
          },
          brandId: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: 0,
          },
          hsnCode: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "",
          },
          modelNumber: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "",
          },
          warrenty: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },
          gst: {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: 0,
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
      await queryInterface.dropTable("Product", { transaction: t });
    });
  },
};
