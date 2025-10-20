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

const AdminAccounts = require("./db/model/adminAccountsDB");
const AdminAccountRoutes = require("./routes/adminAccountRoutes");

const feedback = require("./routes/feedback");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

app.get("/api/health", (_, res) => res.json({ ok: true }));

function getFsicModel() {
  const tableName = "fsic";

  if (sequelize.models && sequelize.models[tableName]) {
    return sequelize.models[tableName];
  }

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

  return Fsic;
}

const clean = (val) => {
  if (val === undefined || val === null) return null;
  if (typeof val !== "string") return val;
  const v = val.replace(/^\uFEFF/, "").trim();
  return v === "" ? null : v;
};

async function parseCsvFile(csvFilePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let parsedRows = 0;

    fs.createReadStream(csvFilePath)
      .pipe(
        csv({
          separator: ",",
          quote: '"',
          mapHeaders: ({ header }) =>
            header ? header.trim().toLowerCase().replace(/\s+/g, "_") : header,
        })
      )
      .on("data", (row) => {
        parsedRows++;
        if (parsedRows <= 5) console.log("🧾 CSV row sample:", row);

        rows.push({
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
        resolve(rows);
      })
      .on("error", (err) => {
        console.error(" CSV parsing error:", err);
        reject(err);
      });
  });
}

async function importFSICData() {
  try {
    const csvFilePath = path.join(__dirname, "public", "fsic.csv");
    const Fsic = getFsicModel();

    if (!fs.existsSync(csvFilePath)) {
      console.warn(
        `⚠️ CSV file not found at ${csvFilePath}. Skipping FSIC import.`
      );
      return;
    }

    await Fsic.sync({ alter: true });
    console.log(` Table '${Fsic.getTableName()}' is ready`);

    const existingCount = await Fsic.count();
    if (existingCount > 0) {
      console.log(
        ` Table '${Fsic.getTableName()}' already has ${existingCount} records. Skipping initial CSV import.`
      );
      return;
    }

    const records = await parseCsvFile(csvFilePath);
    if (!records || records.length === 0) {
      console.log("⚠️ No records parsed from CSV. Nothing to insert.");
      return;
    }

    const chunkSize = 5000;
    let inserted = 0;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      await Fsic.bulkCreate(chunk, { validate: true });
      inserted += chunk.length;
      console.log(`⬆️ Inserted ${chunk.length} records (so far ${inserted})`);
    }

    const totalInDb = await Fsic.count();
    console.log(` Initial import complete. Total rows in DB: ${totalInDb}`);
  } catch (err) {
    console.error(" Error in importFSICData:", err);
  }
}

let importMutex = false;
async function importNewFSICRows() {
  if (importMutex) {
    console.log(" importNewFSICRows already running — skipping this trigger.");
    return;
  }
  importMutex = true;

  try {
    const csvFilePath = path.join(__dirname, "public", "fsic.csv");
    const Fsic = getFsicModel();

    if (!fs.existsSync(csvFilePath)) {
      console.warn(` CSV file not found at ${csvFilePath}. Skipping import.`);
      importMutex = false;
      return;
    }

    await Fsic.sync();

    const existingRows = await Fsic.findAll({
      attributes: ["nature_code", "line_code"],
      raw: true,
    });

    const existingKeySet = new Set(
      existingRows.map((r) => `${r.nature_code ?? ""}||${r.line_code ?? ""}`)
    );

    const parsed = await parseCsvFile(csvFilePath);
    if (!parsed || parsed.length === 0) {
      console.log(" No rows in CSV to consider for new import.");
      importMutex = false;
      return;
    }

    const toInsert = [];
    for (const r of parsed) {
      const key = `${r.nature_code ?? ""}||${r.line_code ?? ""}`;
      if (!existingKeySet.has(key)) {
        toInsert.push(r);
        existingKeySet.add(key);
      }
    }

    if (toInsert.length === 0) {
      console.log(" No new rows to insert (CSV and DB are in sync).");
      importMutex = false;
      return;
    }

    const chunkSize = 5000;
    let inserted = 0;
    for (let i = 0; i < toInsert.length; i += chunkSize) {
      const chunk = toInsert.slice(i, i + chunkSize);
      await Fsic.bulkCreate(chunk, { validate: true });
      inserted += chunk.length;
      console.log(
        `⬆️ Inserted ${chunk.length} new records (so far ${inserted})`
      );
    }

    const totalInDb = await Fsic.count();
    console.log(
      ` importNewFSICRows complete. New rows inserted: ${inserted}. Total in DB: ${totalInDb}`
    );
  } catch (err) {
    console.error(" Error in importNewFSICRows:", err);
  } finally {
    importMutex = false;
  }
}

function watchFSICFile() {
  const csvFilePath = path.join(__dirname, "public", "fsic.csv");
  if (!fs.existsSync(csvFilePath)) {
    console.warn(`⚠️ Cannot watch '${csvFilePath}' — file not found.`);
    return;
  }

  let timer = null;
  try {
    fs.watch(csvFilePath, (eventType, filename) => {
      if (eventType === "change") {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          console.log(
            `Detected change in ${
              filename || "fsic.csv"
            } — checking for new rows...`
          );
          try {
            await importNewFSICRows();
          } catch (err) {
            console.error(" Error while auto-importing new rows:", err);
          }
        }, 1000);
      }
    });
  } catch (err) {
    console.error("Failed to watch CSV file:", err);
  }
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log(" Database connected");

    // await Examiners.sync();
    // await File.sync();
    // await Backroom.sync();
    // await UserAccounts.sync();
    // await Announcements.sync();
    // await BusinessTax.sync();
    // await AppStatus.sync();
    // await TreasurersOffice.sync();
    // await BusinessProfile.sync();
    // await AdminAccounts.sync();

    await Examiners.sync({ alter: true });
    await File.sync({ alter: true });
    await Backroom.sync({ alter: true });
    await UserAccounts.sync({ alter: true });
    await Announcements.sync({ alter: true });
    await BusinessTax.sync({ alter: true });
    await AppStatus.sync({ alter: true });
    await TreasurersOffice.sync({ alter: true });
    await BusinessProfile.sync({ alter: true });

    await importFSICData();

    watchFSICFile();

    console.log(" Database ready");
  } catch (err) {
    console.error(" Startup error:", err);
  }
})();

/* ---------- Routes ---------- */
app.use("/backroom", BackroomRoutes);
app.use("/examiners", ExaminersRoutes);
app.use("/newApplication", fileRoutes);
app.use("/userAccounts", UserAccountsRoutes);
app.use("/api/announcements", AnnouncementsRoutes);
app.use("/businessTax", BusinessTaxRoutes);
app.use("/appStatus", appStatusRoutes);
app.use("/treasurer", TreasurersOfficeRoutes);
app.use("/businessProfile", businessProfileRoutes);
app.use("/user-feedback", feedback);
app.use("/adminAccounts", AdminAccountRoutes);

// Endpoint to fetch FSIC rows (limited)
app.get("/api/my-existing-table", async (req, res) => {
  try {
    const [results] = await sequelize.query("SELECT * FROM fsic LIMIT 10000");
    res.json(results);
  } catch (err) {
    console.error(" Error fetching fsic table:", err);
    res.status(500).json({ error: "Failed to fetch fsic table" });
  }
});

/* ---------- Start server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
