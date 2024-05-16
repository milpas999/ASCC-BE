module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      subCategoryId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      brandId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      hsnCode: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      modelNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      warrenty: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      gst: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
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

  return Product;
};
