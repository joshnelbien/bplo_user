require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { DataTypes } = require("sequelize");
const { sequelize } = require("./db/sequelize");

// 📌 Import your existing models and routes
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

// 📌 Function to create FSIC table and import CSV data
async function importFSICData() {
  try {
    const tableName = "fsic";
    const csvFilePath = path.join(__dirname, "public", "fsic.csv");

    // ✅ Define Sequelize model dynamically
    const Fsic = sequelize.define(
      tableName,
      {
        nature_code: { type: DataTypes.STRING },
        business_nature: { type: DataTypes.STRING },
        line_code: { type: DataTypes.STRING },
        business_line: { type: DataTypes.STRING },
        license: { type: DataTypes.STRING },
        permit: { type: DataTypes.STRING },
        sanitary: { type: DataTypes.STRING },
        garbage: { type: DataTypes.STRING },
      },
      {
        tableName,
        timestamps: false,
      }
    );

    // ✅ Sync the table (creates it if not exists)
    await Fsic.sync({ alter: true });
    console.log(`✅ Table '${tableName}' is ready`);

    // ✅ Read CSV data
    const records = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
          records.push({
            nature_code: row.nature_code,
            business_nature: row.business_nature,
            line_code: row.line_code,
            business_line: row.business_line,
            license: row.license,
            permit: row.permit,
            sanitary: row.sanitary,
            garbage: row.garbage,
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // ✅ Insert records
    if (records.length > 0) {
      await Fsic.bulkCreate(records, { ignoreDuplicates: true });
      console.log(`✅ Inserted ${records.length} records into '${tableName}'`);
    } else {
      console.log("⚠️ No data found in fsic.csv");
    }
  } catch (error) {
    console.error("❌ Error importing FSIC data:", error);
  }
}

// 📌 Main startup function
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Sync your existing tables
    await Examiners.sync({ alter: true });
    await File.sync({ alter: true });
    await Backroom.sync({ alter: true });
    await UserAccounts.sync({ alter: true });
    await Announcements.sync({ alter: true });
    await BusinessTax.sync({ alter: true });
    await AppStatus.sync({ alter: true });
    await TreasurersOffice.sync({ alter: true });
    await BusinessProfile.sync({ alter: true });

    // 🆕 Import FSIC CSV after syncing
    await importFSICData();

    console.log("✅ Database ready");
  } catch (err) {
    console.error("❌ Startup error:", err);
  }
})();

// 📌 Use existing routes
app.use("/backroom", BackroomRoutes);
app.use("/examiners", ExaminersRoutes);
app.use("/newApplication", fileRoutes);
app.use("/userAccounts", UserAccountsRoutes);
app.use("/api/announcements", AnnouncementsRoutes);
app.use("/businessTax", BusinessTaxRoutes);
app.use("/appStatus", appStatusRoutes);
app.use("/treasurer", TreasurersOfficeRoutes);
app.use("/businessProfile", businessProfileRoutes);

// 📌 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
