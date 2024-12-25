module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",

    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      alternateContactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dob: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      anniversaryDate: {
        allowNull: true,
        type: DataTypes.DATE,
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

  Customer.associate = (models) => {
    Customer.hasMany(models.Branch, {
      foreignKey: "customerId",
      as: "branches",
    });

    Customer.hasMany(models.Leads, {
      foreignKey: "customerId",
      as: "leads",
    });

    Customer.hasMany(models.Department, {
      foreignKey: "customerId",
      as: "departments", // Optional alias
    });
  };

  return Customer;
};
