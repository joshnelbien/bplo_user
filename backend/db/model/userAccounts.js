const { DataTypes } = require("sequelize");
const { sequelize } = require("../sequelize");

const UserAccounts = sequelize.define("UserAccounts", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  business_type: { type: DataTypes.STRING, allowNull: false },
  dsc_reg_no: { type: DataTypes.STRING, allowNull: false },
  business_name: { type: DataTypes.STRING, allowNull: false },
  tin_no: { type: DataTypes.STRING, allowNull: false },
  trade_name: { type: DataTypes.STRING },
  firstName: { type: DataTypes.STRING, allowNull: false },
  middleName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING, allowNull: false },
  extName: { type: DataTypes.STRING },
  sex: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  tel: { type: DataTypes.STRING },
  mobile: { type: DataTypes.STRING, allowNull: false },
  application_type: { type: DataTypes.STRING },
  BIN: { type: DataTypes.STRING },
  DataPrivacy: { type: DataTypes.STRING },
});

module.exports = UserAccounts;
