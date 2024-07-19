const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtOPTIONS = require("../config/jwtOptions.json");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "Users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      permanentAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfJoining: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      anniversaryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      profileImageId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["A", "I"],
        defaultValue: "I",
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

  User.prototype.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  };
  User.prototype.validPassword = function (password) {
    return this.password ? bcrypt.compareSync(password, this.password) : false;
  };
  User.prototype.genToken = function () {
    const payload = { id: this.id, userGroupId: this.userGroupId };
    return jwt.sign(payload, jwtOPTIONS.secretOrKey, {
      expiresIn: jwtOPTIONS.expiry,
    });
  };

  // User.associate = (models) => {
  //   // User.hasMany(models.FCMToken, { as: "fcmTokens", foreignKey: "userId" });
  // };

  User.associate = (models) => {
    User.hasMany(models.Notes, { foreignKey: "userId", as: "notes" });
  };

  return User;
};
