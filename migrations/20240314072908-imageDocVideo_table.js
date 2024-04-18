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
        "ImageDocVideo",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          relatedId: {
            type: Sequelize.BIGINT,
            allowNull: true,
            default: null,
          },
          typeX: {
            type: Sequelize.ENUM,
            values: ["IMG", "DOC", "VDO"],
            defaultValue: "IMG",
          },
          metaData: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          resizedParams: {
            type: Sequelize.TEXT,
            allowNull: true,
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
      await queryInterface.dropTable("ImageDocVideo", { transaction: t });
    });
  },
};
