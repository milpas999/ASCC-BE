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
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactPosition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactAlternateNumber: {
        type: DataTypes.STRING,
        allowNull: true,
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
    Branch.belongsTo(models.Customer, {
      foreignKey: "customerId",
      as: "customer",
    });

    Branch.hasMany(models.Department, {
      foreignKey: "branchId",
      as: "departments", // Optional alias
    });

    Branch.hasMany(models.ContactPerson, {
      foreignKey: "referenceId",
      constraints: false,
      scope: { referenceType: "branch" },
      as: "contactPersonDetails",
    });
  };

  return Branch;
};
