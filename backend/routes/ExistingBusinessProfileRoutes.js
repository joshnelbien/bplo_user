const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const BusinessProfile = require("../db/model/BusinessProfileExisting");
const router = require("express").Router();

// --------------------------
// GET all imported businesses
// --------------------------
router.get("/imported-businesses", async (req, res) => {
  try {
    const businesses = await BusinessProfile.findAll({
      attributes: [
        "business_name",
        "incharge_last_name",
        "incharge_first_name",
        "incharge_middle_name",
        "incharge_barangay",
      ],
    });
    res.json(businesses);
  } catch (error) {
    console.error("❌ Error fetching businesses:", error);
    res.status(500).json({ error: "Failed to fetch businesses" });
  }
});

// --------------------------
// GET searchable businesses with pagination
// --------------------------
router.get("/businessProfiles", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? { business_name: { [Op.like]: `${search}%` } } // prefix search for index
      : {};

    const files = await BusinessProfile.findAll({
      attributes: [
        "business_name",
        "incharge_last_name",
        "incharge_first_name",
        "incharge_middle_name",
        "incharge_barangay",
      ],
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["business_name", "ASC"]],
    });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

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

module.exports = router;
