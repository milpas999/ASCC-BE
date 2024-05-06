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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactPersonName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactPersonPosition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      branchAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      branchContactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      branchAlternateContactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      branchEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
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
    Branch.belongsTo(models.Customer, { foreignKey: "customerId" });
  };

  return Branch;
};
