const express = require("express");
const router = express.Router();
const Businesses_2025 = require("../db/model/businesses2025");
const { Op, Sequelize } = require("sequelize");

router.get("/businesses-2025", async (req, res) => {
  try {
    const businesses = await Businesses_2025.findAll({ limit: 1000 });
    res.json(businesses);
  } catch (error) {
    console.error("Error fetching businesses2025:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/businessProfiles", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? { business_name: { [Op.iLike]: `%${search}%` } } // case-insensitive substring search
      : {};

    const total = await Businesses_2025.count({ where: whereClause });

    const rows = await Businesses_2025.findAll({
      attributes: [
        "business_name",
        "last_name",
        "first_name",
        "middle_name",
        "business_address",
        "application_type",
      ],
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["business_name", "ASC"]],
    });

    res.json({ rows, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ rows: [], total: 0 });
  }
});

module.exports = router;
