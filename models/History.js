module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define(
    "History",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      relatedId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      typeX: {
        type: DataTypes.ENUM,
        values: ["LEADS", "TASKS", "COMPLAINT"],
        defaultValue: "LEADS",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
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

  return History;
};
