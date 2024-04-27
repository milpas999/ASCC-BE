module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      parentCategoryId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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

  Category.associate = (models) => {
    Category.hasMany(models.Category, {
      foreignKey: "parentCategoryId",
      as: "subCategories", // Optional alias for the association
      constraints: false, // To allow circular references (optional)
    });
  };

  return Category;
};
