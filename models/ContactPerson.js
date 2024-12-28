module.exports = (sequelize, DataTypes) => {
  const ContactPerson = sequelize.define(
    "ContactPerson",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      referenceId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      referenceType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactPersonName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactPersonPosition: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      contactPersonNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      contactPersonAlternateNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
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

  ContactPerson.associate = function (models) {
    // ContactPerson.hasMany(models.ContactPersonBranchMapping, {
    //   foreignKey: "contactPersonId",
    //   as: "contactPersonMappingDetails",
    // });

    ContactPerson.belongsTo(models.Branch, {
      foreignKey: "referenceId",
      constraints: false,
      // scope: { referenceType: "branch" }, // Discriminator for Post
    });

    ContactPerson.belongsTo(models.Department, {
      foreignKey: "referenceId",
      constraints: false,
      // scope: { referenceType: "department" }, // Discriminator for Post
    });
  };

  return ContactPerson;
};
