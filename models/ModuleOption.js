module.exports = (sequelize, DataTypes) => {
  const ModuleOptions = sequelize.define(
    "ModuleOptions",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      systemModuleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
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
        default: null
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  ModuleOptions.associate = (models) => {
    ModuleOptions.belongsTo(models.SystemModules, {
      as: "systemModuleInfo",
      foreignKey: "systemModuleId",
    });
  };

  return ModuleOptions;
};
