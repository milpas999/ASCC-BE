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
      contactPersonName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactPersonDesignation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactPersonMobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
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
  };

  return Department;
};
