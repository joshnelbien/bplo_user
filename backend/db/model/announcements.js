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
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING, // Use STRING to store the creator's name
    allowNull: false, // Ensure this is not null to prevent "Unknown" from appearing
    defaultValue: "Admin", // Set a default value if not provided
  },
  attachedImageBlob: {
    type: DataTypes.TEXT("long"), // Use TEXT("long") to store a potentially large base64 image string
    allowNull: true, // This field can be null if no image is attached
  },
});

module.exports = Announcements;