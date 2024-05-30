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
        "ProductInventory",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          invenrtoryId: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          direction: {
            type: Sequelize.ENUM,
            values: ["I", "O"],
            defaultValue: "I",
          },
          dateTime: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          productId: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          costPrice: {
            type: Sequelize.FLOAT,
            allowNull: true,
          },
          sellingPrice: {
            type: Sequelize.FLOAT,
            allowNull: true,
          },
          bottemPrice: {
            type: Sequelize.FLOAT,
            allowNull: true,
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

    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "ProductInventorySerial",
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
          },
          productInvenrtoryId: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          serialNumber: {
            type: Sequelize.STRING,
            allowNull: true,
            default: "",
          },
          sold: {
            type: Sequelize.ENUM,
            values: ["Y", "N"],
            defaultValue: "N",
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
      await queryInterface.dropTable("ProductInventory", { transaction: t });
    });

    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("ProductInventorySerial", {
        transaction: t,
      });
    });
  },
};
