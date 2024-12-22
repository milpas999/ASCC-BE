module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    "Department",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      customerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      branchId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      departmentName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactPosition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactAlternateNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        default: "",
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

  Department.associate = function (models) {
    Department.belongsTo(models.Customer, {
      foreignKey: "customerId",
      as: "customerDetails",
    });

    Department.belongsTo(models.Branch, {
      foreignKey: "branchId",
      as: "branch",
    });

    Department.hasMany(models.ContactPerson, {
      foreignKey: "referenceId",
      constraints: false,
      scope: { referenceType: "department" },
      as: "contactPersonDetails",
    });
  };

  return Department;
};
