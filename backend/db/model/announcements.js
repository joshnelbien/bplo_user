const { DataTypes } = require("sequelize");
const { sequelize } = require("../sequelize");

const Announcements = sequelize.define("Announcements", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  attachedImageBlob: { // Reverted to attachedImageBlob with BLOB
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
});

module.exports = Announcements;