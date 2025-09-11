require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./db/sequelize");

// Import your existing models and routes
const Examiners = require("./db/model/examiners");
const ExaminersRoutes = require("./routes/examinersRoutes");

const File = require("./db/model/files");
const fileRoutes = require("./routes/newAppRoutes");

const Backroom = require("./db/model/backroomLocal");
const BackroomRoutes = require("./routes/backroomRoutes");

const UserAccounts = require("./db/model/userAccounts");
const UserAccountsRoutes = require("./routes/UserAccountsRoutes");

const Announcements = require("./db/model/announcements");
const AnnouncementsRoutes = require("./routes/announcements");

const BusinessTax = require("./db/model/businessTax");
const BusinessTaxRoutes = require("./routes/businessTaxRoutes");

const AppStatus = require("./db/model/applicantStatusDB");
const appStatusRoutes = require("./routes/appStatusRoutes");

const TreasurersOffifce = require("./db/model/treasurersOfficeDB");
const TreasurersOfficeRoutes = require("./routes/treasurerRoutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit for large images

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

// DB setup
(async () => {
  await sequelize.authenticate();
  await Examiners.sync();
  await File.sync();
  await Backroom.sync();
  await UserAccounts.sync();
  await Announcements.sync();
  await BusinessTax.sync();
  await AppStatus.sync();
  await TreasurersOffifce.sync();
  console.log("Database ready");
})();

// Use your existing routes
app.use("/backroom", BackroomRoutes);
app.use("/examiners", ExaminersRoutes);
app.use("/newApplication", fileRoutes);
app.use("/userAccounts", UserAccountsRoutes);
app.use("/api/announcements", AnnouncementsRoutes);
app.use("/businessTax", BusinessTaxRoutes);
app.use("/appStatus", appStatusRoutes);
app.use("/treasurer", TreasurersOfficeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
