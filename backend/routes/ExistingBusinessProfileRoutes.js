const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { sequelize } = require("../db/sequelize");
const BusinessProfile = require("../db/model/BusinessProfileExisting");

async function importBusinesses() {
  try {
    // ✅ Path to your CSV file
    const csvFilePath = path.join(__dirname, "../public/businesses.csv");

    const businesses = [];

    // ✅ Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
          businesses.push(row);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`✅ Read ${businesses.length} records from CSV file.`);

    // ✅ Sync table if not yet created
    await sequelize.sync();

    // ✅ Insert records into database
    await BusinessProfile.bulkCreate(businesses, {
      ignoreDuplicates: true, // optional, if you don’t want duplicates
    });

    console.log("🎉 Businesses successfully imported to database!");
  } catch (error) {
    console.error("❌ Error importing businesses:", error);
  } finally {
    await sequelize.close();
  }
}

importBusinesses();
