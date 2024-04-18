module.exports = (sequelize, DataTypes) => {
  const SystemModules = sequelize.define(
    "SystemModules",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["A", "I"],
        defaultValue: "A",
      },
      endeffdt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  SystemModules.associate = (models) => {
    SystemModules.hasMany(models.ModuleOptions, {
      as: "arrModuleOption",
      foreignKey: "systemModuleId",
    });
  };

  return SystemModules;
};
