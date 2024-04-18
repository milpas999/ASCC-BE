module.exports = (sequelize, DataTypes) => {
  const UserGroupSystemModuleMapping = sequelize.define(
    "UserGroupSystemModuleMapping",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      userGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      systemModuleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      systemModuleValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      moduleOptionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        // references: {
        //   model: "ModuleOptions",
        //   key: "id",
        // },
      },
      moduleOptionValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  UserGroupSystemModuleMapping.associate = (models) => {
    UserGroupSystemModuleMapping.belongsTo(models.SystemModules, {
      as: "systemModuleInfo",
      foreignKey: "systemModuleId",
      targetKey: "id",
    });
    UserGroupSystemModuleMapping.belongsTo(models.ModuleOptions, {
      as: "moduleOptionsInfo",
      foreignKey: "moduleOptionId",
      targetKey: "id",
    });
    // UserGroupSystemModuleMapping.hasOne(models.SystemModules, {
    //   as: "systemModuleInfo",
    //   foreignKey: "systemModuleId",
    //   targetKey: "id",
    // });
    // UserGroupSystemModuleMapping.hasOne(models.ModuleOptions, {
    //   as: "moduleOptionsInfo",
    //   foreignKey: "moduleOptionId",
    // });
  };

  return UserGroupSystemModuleMapping;
};
