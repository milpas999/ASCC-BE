module.exports = (sequelize, DataTypes) => {
  const ContactPersonDepartmentMapping = sequelize.define(
    "ContactPersonDepartmentMapping",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      contactPersonId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
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

  ContactPersonDepartmentMapping.associate = function (models) {
    ContactPersonDepartmentMapping.belongsTo(models.ContactPerson, {
      foreignKey: "id",
      as: "contactPersonDetails",
    });

    ContactPersonDepartmentMapping.belongsTo(models.Department, {
      foreignKey: "departmentId",
      as: "departmentDetail",
    });
  };

  return ContactPersonDepartmentMapping;
};
