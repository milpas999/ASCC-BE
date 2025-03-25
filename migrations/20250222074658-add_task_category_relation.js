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
        "Tasks",
        "taskCategoryId",
        {
          type: Sequelize.BIGINT,
          references: {
            model: "TaskCategory", // name of Target model
            key: "id", // key in Target model that we're referencing
          },
          allowNull: true,
          defaultValue: null,
          after: "id",
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
      await queryInterface.removeColumn("Tasks", "taskCategoryId", {
        transaction: t,
      });
    });
  },
};
