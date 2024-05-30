module.exports = (sequelize, DataTypes) => {
  const ProductInventory = sequelize.define(
    "ProductInventory",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      invenrtoryId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      direction: {
        type: DataTypes.ENUM,
        values: ["I", "O"],
        defaultValue: "I",
      },
      dateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      productId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      costPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      sellingPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      bottemPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
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

  return ProductInventory;
};
