const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { sequelize } = require("../db/sequelize");
const BusinessProfile = require("../db/model/BusinessProfileExisting");
const router = require("express").Router();

router.get("/imported-businesses", async (req, res) => {
  try {
    const businesses = await BusinessProfile.findAll();
    res.json(businesses);
  } catch (error) {
    console.error("❌ Error fetching businesses:", error);
    res.status(500).json({ error: "Failed to fetch businesses" });
  }
});

module.exports = router;

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
  }
}

importBusinesses();
