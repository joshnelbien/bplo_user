// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./db/sequelize");

// Import your existing models and routes
const Examiners = require("./db/model/examiners");
const ExaminersRoutes = require("./routes/examiners");

const File = require("./db/model/files");
const fileRoutes = require("./routes/newApp");

const Backroom = require("./db/model/backroomLocal");
const BackroomRoutes = require("./routes/backroom");

const UserAccounts = require("./db/model/userAccounts");
const UserAccountsRoutes = require("./routes/UserAccounts");

// Import the new Announcements model and route
const Announcements = require("./db/model/announcements");
const AnnouncementsRoutes = require("./routes/announcements");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

// DB setup
(async () => {
  await sequelize.authenticate();
  await Examiners.sync();
  await File.sync();
  await Backroom.sync();
  await UserAccounts.sync();
  await Announcements.sync(); // Add this line to sync the new model
  console.log("Database ready");
})();

// Use your existing routes
app.use("/backroom", BackroomRoutes);
app.use("/examiners", ExaminersRoutes);
app.use("/newApplication", fileRoutes);
app.use("/userAccounts", UserAccountsRoutes);

// Add the new announcements route
app.use("/api/announcements", AnnouncementsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));