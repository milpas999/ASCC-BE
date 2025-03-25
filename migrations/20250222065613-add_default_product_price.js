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
      try {
        await queryInterface.addColumn(
          "Product",
          "defaultPrice",
          {
            type: Sequelize.DOUBLE(20, 2),
            defaultValue: 0,
            after: "gst",
          },
          { transaction: t }
        );
      } catch (error) {
        console.log("error :::::::: ", error);
        t.rollback();
      }
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
      try {
        await queryInterface.removeColumn("Product", "defaultPrice", {
          transaction: t,
        });
      } catch (error) {
        console.log("error :::::::: ", error);
        t.rollback();
      }
    });
  },
};
