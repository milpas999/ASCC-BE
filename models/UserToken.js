const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtOPTIONS = require("../config/jwtOptions.json");

module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define(
    "UserToken",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      guuId: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      deviceDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fcmTokem: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      authTokem: {
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

  UserToken.associate = (models) => {
    // User.hasMany(models.FCMToken, { as: "fcmTokens", foreignKey: "userId" });
  };

  return UserToken;
};
