module.exports = (sequelize, DataTypes) => {
  const Leads = sequelize.define(
    "Leads",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      LeadsCustomerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      customerId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["A", "I"],
        defaultValue: "A",
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

  Leads.associate = function (models) {
    Leads.belongsTo(models.LeadsCustomer, {
      foreignKey: "LeadsCustomerId",
      as: "leadCustomerDetails",
    });
    Leads.belongsTo(models.Customer, {
      foreignKey: "customerId",
      as: "customerDetails",
    });
  };

  return Leads;
};
