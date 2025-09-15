const { DataTypes } = require("sequelize");
const { sequelize } = require("../sequelize");

const AppStatus = sequelize.define(
  "appStatus",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
    },
    BPLO: { type: DataTypes.STRING, defaultValue: "Pending" },
    BPLOtimeStamp: { type: DataTypes.STRING },
    Examiners: { type: DataTypes.STRING, defaultValue: "Pending" },
    ExaminerstimeStamp: { type: DataTypes.STRING },
    CSMWO: { type: DataTypes.STRING, defaultValue: "Pending" },
    CSMWOdecline: { type: DataTypes.STRING },
    CSMWOtimeStamp: { type: DataTypes.STRING },
    CHO: { type: DataTypes.STRING, defaultValue: "Pending" },
    CHOdecline: { type: DataTypes.STRING },
    CHOtimeStamp: { type: DataTypes.STRING },
    ZONING: { type: DataTypes.STRING, defaultValue: "Pending" },
    ZONINGtimeStamp: { type: DataTypes.STRING },
    CENRO: { type: DataTypes.STRING, defaultValue: "Pending" },
    CENROdecline: { type: DataTypes.STRING },
    CENROtimeStamp: { type: DataTypes.STRING },
    OBO: { type: DataTypes.STRING, defaultValue: "Pending" },
    OBOdecline: { type: DataTypes.STRING },
    OBOtimeStamp: { type: DataTypes.STRING },
    BUSINESSTAX: { type: DataTypes.STRING, defaultValue: "Pending" },
    BUSINESSTAXtimeStamp: { type: DataTypes.STRING },
  },
  {
    freezeTableName: true,
    tableName: "appStatus",
  }
);

module.exports = AppStatus;
