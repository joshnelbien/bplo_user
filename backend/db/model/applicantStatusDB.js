const { DataTypes } = require("sequelize");
const { sequelize } = require("../sequelize");

const appStatus = sequelize.define(
  "appStatus",
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true, // ✅ set as primary key
    },
    BPLO: { type: DataTypes.STRING, defaultValue: "Pending" },
    Examiners: { type: DataTypes.STRING, defaultValue: "Pending" },
    CSMWO: { type: DataTypes.STRING, defaultValue: "Pending" },
    CHO: { type: DataTypes.STRING, defaultValue: "Pending" },
    ZONING: { type: DataTypes.STRING, defaultValue: "Pending" },
    CENRO: { type: DataTypes.STRING, defaultValue: "Pending" },
    OBO: { type: DataTypes.STRING, defaultValue: "Pending" },
    BUSINESSTAX: { type: DataTypes.STRING, defaultValue: "Pending" },
  },
  {
    freezeTableName: true,
    tableName: "appStatus",
  }
);

module.exports = appStatus;
