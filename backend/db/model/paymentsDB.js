const { DataTypes } = require("sequelize");
const { sequelize } = require("../sequelize");

const ClientPayments = sequelize.define("ClientPayments", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  bin: {
    type: DataTypes.STRING,
  },
  BusinessType: DataTypes.STRING,
  dscRegNo: DataTypes.STRING,
  businessName: DataTypes.STRING,
  tinNo: DataTypes.STRING,
  TradeName: DataTypes.STRING,
  firstName: DataTypes.STRING,
  middleName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  amount_due: {
    type: DataTypes.STRING,
  },
  amount_paid: {
    type: DataTypes.STRING,
  },
  due_date: {
    type: DataTypes.STRING,
  },
});

module.exports = ClientPayments;
