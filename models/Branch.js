module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define(
    "Branch",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      branchName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      branchAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactPersonName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactPersonDesignation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactPersonMobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      flagDefault: {
        type: DataTypes.ENUM,
        values: ["Y", "N"],
        defaultValue: "N",
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

  Branch.associate = (models) => {
    Branch.belongsTo(models.Customer, { foreignKey: "customerId" });

    Branch.hasMany(models.Department, {
      foreignKey: "branchId",
      as: "departments", // Optional alias
    });
  };

  return Branch;
};
