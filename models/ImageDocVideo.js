module.exports = (sequelize, DataTypes) => {
  const ImageDocVideo = sequelize.define(
    "ImageDocVideo",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      relatedId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        default: null,
      },
      typeX: {
        type: DataTypes.ENUM,
        values: ["IMG", "DOC", "VDO"],
        defaultValue: "IMG",
      },
      resourceType: {
        type: DataTypes.STRING,
        defaultValue: "EMP",
      },
      metaData: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resizedParams: {
        type: DataTypes.TEXT,
        allowNull: true,
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

  return ImageDocVideo;
};
