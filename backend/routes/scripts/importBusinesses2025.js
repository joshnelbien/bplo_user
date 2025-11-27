// scripts/importBusinesses2025.js
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { sequelize } = require("../../db/sequelize");
const Businesses_2025 = require("../../db/model/businesses2025");

const CSV_PATH = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "businesses2025.csv"
);
const BATCH_SIZE = 1000;

function cleanKey(key) {
  if (!key && key !== "") return "";
  return key
    .toString()
    .trim()
    .replace(/\uFEFF/g, "")
    .replace(/\//g, " ")
    .replace(/\.+/g, "")
    .replace(/,+/g, "")
    .replace(/['"]/g, "")
    .replace(/\s+/g, "_")
    .replace(/__+/g, "_")
    .replace(/^\_+|\_+$/g, "")
    .toLowerCase();
}

async function runImport() {
  try {
    await sequelize.authenticate();
    console.log("DB connected.");

    const modelFields = Object.keys(Businesses_2025.rawAttributes);
    const modelSet = new Set(modelFields);
    const headerMap = {};

    const rowsBuffer = [];
    let rowCount = 0;

    console.log("Reading CSV:", CSV_PATH);

    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_PATH)
        .pipe(csv({ mapHeaders: ({ header }) => header }))
        .on("headers", (headers) => {
          headers.forEach((h) => {
            const ck = cleanKey(h);
            if (modelSet.has(ck)) headerMap[ck] = ck;
          });
        })
        .on("data", (row) => {
          rowCount++;
          const normalized = {};
          Object.entries(row).forEach(([rawKey, value]) => {
            const cleaned = cleanKey(rawKey);
            normalized[cleaned] = value;
          });
          rowsBuffer.push(normalized);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (!rowsBuffer.length) {
      console.log("No rows to import.");
      return;
    }

    // --- Check existing rows in DB using unique key ---
    const uniqueKey = "bin"; // <-- make sure this is the unique column in your table
    const existingRecords = await Businesses_2025.findAll({
      attributes: [uniqueKey],
    });
    const existingKeys = new Set(existingRecords.map((r) => r[uniqueKey]));

    // Filter only new rows
    const newRows = rowsBuffer.filter(
      (r) => r[uniqueKey] && !existingKeys.has(r[uniqueKey])
    );

    if (!newRows.length) {
      console.log("No new rows to import. All records already exist.");
      return;
    }

    console.log(`Found ${newRows.length} new rows to import.`);

    const skipUpdate = new Set(["id", "createdAt", "updatedAt"]);
    const updatableFields = modelFields.filter((f) => !skipUpdate.has(f));

    console.log("Starting bulk insert...");
    for (let i = 0; i < newRows.length; i += BATCH_SIZE) {
      const batch = newRows.slice(i, i + BATCH_SIZE);

      await Businesses_2025.bulkCreate(batch, {
        updateOnDuplicate: updatableFields,
      });

      console.log(
        `Inserted rows ${i + 1} to ${Math.min(i + BATCH_SIZE, newRows.length)}.`
      );
    }

    console.log("Import finished successfully.");
  } catch (err) {
    console.error("Import failed:", err);
  }
}

// Automatically run when executed directly
if (require.main === module) {
  runImport();
}

module.exports = runImport;
