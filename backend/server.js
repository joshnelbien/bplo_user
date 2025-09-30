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

const TreasurersOffice = require("./db/model/treasurersOfficeDB");
const TreasurersOfficeRoutes = require("./routes/treasurerRoutes");

const BusinessProfile = require("./db/model/businessProfileDB");
const businessProfileRoutes = require("./routes/businessProfileRoutes");
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/api/health", (_, res) => res.json({ ok: true }));

(async () => {
  await sequelize.authenticate();
  await Examiners.sync({ alter: true });
  await File.sync({ alter: true });
  await Backroom.sync({ alter: true });
  await UserAccounts.sync({ alter: true });
  await Announcements.sync({ alter: true });
  await BusinessTax.sync({ alter: true });
  await AppStatus.sync({ alter: true });
  await TreasurersOffice.sync({ alter: true });
  await BusinessProfile.sync({ alter: true });

  // await Examiners.sync();
  // await File.sync();
  // await Backroom.sync();
  // await UserAccounts.sync();
  // await Announcements.sync();
  // await BusinessTax.sync();
  // await AppStatus.sync();
  // await TreasurersOffice.sync();
  // await BusinessProfile.sync();
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
app.use("/businessProfile", businessProfileRoutes);

app.get("/api/my-existing-table", async (req, res) => {
  try {
    const [results] = await sequelize.query("SELECT * FROM FSICDB");

    if (results.length > 0) {
      res.json(results);
    } else {
      console.warn("⚠️ FSICDB table is empty or no data found.");
      res.status(404).json({ error: "No data found in FSICDB" });
    }
  } catch (err) {
    console.error("❌ Error fetching FSICDB table:", err);
    res.status(500).json({ error: "Failed to fetch FSICDB table" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
