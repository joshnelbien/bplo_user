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

/**
 * 📌 importFSICData
 * - Checks if table already has data → skip if yes
 * - Handles headers & CSV parsing
 * - Inserts in chunks for performance
 */
async function importFSICData() {
  try {
    const tableName = "fsic";
    const csvFilePath = path.join(__dirname, "public", "fsic.csv");

    if (!fs.existsSync(csvFilePath)) {
      console.warn(
        `⚠️ CSV file not found at ${csvFilePath}. Skipping FSIC import.`
      );
      return;
    }

    // ✅ Define Sequelize model
    const Fsic = sequelize.define(
      tableName,
      {
        nature_code: { type: DataTypes.STRING },
        business_nature: { type: DataTypes.TEXT },
        line_code: { type: DataTypes.STRING },
        business_line: { type: DataTypes.TEXT },
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

    // Create / alter table
    await Fsic.sync({ alter: true });
    console.log(`✅ Table '${tableName}' is ready`);

    // 🛑 Check if data already exists
    const existingCount = await Fsic.count();
    if (existingCount > 0) {
      console.log(
        `⚠️ Table '${tableName}' already has ${existingCount} records. Skipping CSV import.`
      );
      return;
    }

    // Helper: normalize empty -> null
    const clean = (val) => {
      if (val === undefined || val === null) return null;
      if (typeof val === "string") {
        const v = val.replace(/^\uFEFF/, "").trim();
        return v === "" ? null : v;
      }
      return val;
    };

    // Read & parse CSV
    const records = [];
    let parsedRows = 0;
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(
          csv({
            separator: ",",
            quote: '"',
            mapHeaders: ({ header }) =>
              header
                ? header.trim().toLowerCase().replace(/\s+/g, "_")
                : header,
          })
        )
        .on("data", (row) => {
          parsedRows++;
          if (parsedRows <= 5) console.log("🧾 CSV row sample:", row);
          records.push({
            nature_code: clean(row.nature_code),
            business_nature: clean(row.business_nature),
            line_code: clean(row.line_code),
            business_line: clean(row.business_line),
            license: clean(row.license),
            permit: clean(row.permit),
            sanitary: clean(row.sanitary),
            garbage: clean(row.garbage),
          });
        })
        .on("end", () => {
          console.log(
            `✅ Finished parsing CSV — total parsed rows: ${parsedRows}`
          );
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ CSV parsing error:", err);
          reject(err);
        });
    });

    if (records.length === 0) {
      console.log("⚠️ No records parsed from CSV. Nothing to insert.");
      return;
    }

    // ✅ Insert in chunks
    const chunkSize = 5000;
    let inserted = 0;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      await Fsic.bulkCreate(chunk, { validate: true });
      inserted += chunk.length;
      console.log(`⬆️ Inserted ${chunk.length} records (so far ${inserted})`);
    }

    const totalInDb = await Fsic.count();
    console.log(`✅ Import complete. Total rows in DB: ${totalInDb}`);
  } catch (error) {
    console.error("❌ Error importing FSIC data:", error);
  }
}

// 📌 Main startup
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await Examiners.sync({ alter: true });
    await File.sync({ alter: true });
    await Backroom.sync({ alter: true });
    await UserAccounts.sync({ alter: true });
    await Announcements.sync({ alter: true });
    await BusinessTax.sync({ alter: true });
    await AppStatus.sync({ alter: true });
    await TreasurersOffice.sync({ alter: true });
    await BusinessProfile.sync({ alter: true });

    // 🆕 Run CSV importer
    await importFSICData();

    console.log("✅ Database ready");
  } catch (err) {
    console.error("❌ Startup error:", err);
  }
})();

// 📌 Routes
app.use("/backroom", BackroomRoutes);
app.use("/examiners", ExaminersRoutes);
app.use("/newApplication", fileRoutes);
app.use("/userAccounts", UserAccountsRoutes);
app.use("/api/announcements", AnnouncementsRoutes);
app.use("/businessTax", BusinessTaxRoutes);
app.use("/appStatus", appStatusRoutes);
app.use("/treasurer", TreasurersOfficeRoutes);
app.use("/businessProfile", businessProfileRoutes);

// 🧪 Simple endpoint to fetch FSIC data
app.get("/api/my-existing-table", async (req, res) => {
  try {
    const [results] = await sequelize.query("SELECT * FROM fsic LIMIT 10000");
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching fsic table:", err);
    res.status(500).json({ error: "Failed to fetch fsic table" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
