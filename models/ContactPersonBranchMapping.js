module.exports = (sequelize, DataTypes) => {
  const ContactPersonBranchMapping = sequelize.define(
    "ContactPersonBranchMapping",
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
      branchId: {
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

  ContactPersonBranchMapping.associate = function (models) {
    // ContactPersonBranchMapping.belongsTo(models.ContactPerson, {
    //   foreignKey: "contactPersonId",
    //   as: "contactPersonDetails",
    // });

    // ContactPersonBranchMapping.belongsTo(models.Branch, {
    //   foreignKey: "branchId",
    //   as: "branch",
    // });

    ContactPersonBranchMapping.belongsTo(models.ContactPerson, {
      foreignKey: "contactPersonId",
      as: "contactPersonDetails", // Correct alias for clarity
    });

    ContactPersonBranchMapping.belongsTo(models.Branch, {
      foreignKey: "branchId",
      as: "branch",
    });
  };

  return ContactPersonBranchMapping;
};
