module.exports = (sequelize, DataTypes) => {
  const TaskCategory = sequelize.define(
    "TaskCategory",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      taskCategoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      status: {
        type: DataTypes.ENUM,
        values: ["A", "I"],
        defaultValue: "A",
      },
      // Timestamps
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      // delete flag
      endeffdt: {
        allowNull: true,
        type: DataTypes.DATE,
        default: null,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  TaskCategory.associate = (models) => {
    TaskCategory.hasMany(models.Tasks, {
      foreignKey: "taskCategoryId",
      as: "tasks", // Optional alias
    });
  };

  return TaskCategory;
};
