const { DataTypes } = require("sequelize");
const { sequelize } = require("../sequelize");

const AdminAccounts = sequelize.define("AdminAccounts", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  MiddleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Office: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING,
  },
});

module.exports = AdminAccounts;
