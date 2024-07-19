module.exports = (sequelize, DataTypes) => {
  const LeadsCustomer = sequelize.define(
    "LeadsCustomer",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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

  LeadsCustomer.associate = function (models) {
    LeadsCustomer.hasMany(models.Leads, {
      foreignKey: "LeadsCustomerId",
      as: "leads",
    });
  };

  return LeadsCustomer;
};
