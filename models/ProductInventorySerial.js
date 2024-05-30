module.exports = (sequelize, DataTypes) => {
  const ProductInventorySerial = sequelize.define(
    "ProductInventorySerial",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      productInvenrtoryId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      serialNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        default: "",
      },
      sold: {
        type: DataTypes.ENUM,
        values: ["Y", "N"],
        defaultValue: "N",
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

  return ProductInventorySerial;
};
