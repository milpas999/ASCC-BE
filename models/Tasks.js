module.exports = (sequelize, DataTypes) => {
  const Tasks = sequelize.define(
    "Tasks",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      assignedTo: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        default: "",
      },
      taskStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        default: "",
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      plannedHours: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      actualHours: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["A", "I"],
        defaultValue: "A",
      },
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

  Tasks.associate = function (models) {
    Tasks.belongsTo(models.Users, {
      foreignKey: "assignedTo",
      as: "assignedUser",
    });
  };

  return Tasks;
};
