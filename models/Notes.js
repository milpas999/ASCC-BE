module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define(
    "Notes",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
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
      followUpData: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
        allowNull: true,
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

  Notes.associate = (models) => {
    Notes.belongsTo(models.Users, { foreignKey: "userId", as: "user" });
  };

  return Notes;
};
