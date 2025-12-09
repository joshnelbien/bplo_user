const express = require("express");
const router = express.Router();
const Businesses_2025 = require("../db/model/businesses2025");
const { Op } = require("sequelize");
const axios = require("axios");

const GOOGLE_SECRET = process.env.RECAPTCHA_SECRET_KEY;

let captchaPassedSessions = new Set();

router.get("/businessProfiles", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 100, token, sessionId } = req.query;

    // Skip captcha if session already verified
    if (!captchaPassedSessions.has(sessionId)) {
      if (!token)
        return res.status(400).json({ message: "Captcha token missing." });

      const { data } = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        {},
        { params: { secret: GOOGLE_SECRET, response: token } }
      );

      if (!data.success)
        return res
          .status(400)
          .json({ message: "Captcha verification failed." });

      captchaPassedSessions.add(sessionId); // mark session as verified
    }

    const offset = (page - 1) * limit;

    // Exact match (case-insensitive)
    const whereClause = search ? { business_name: { [Op.iLike]: search } } : {};

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

    return res.json({ rows, total });
  } catch (err) {
    console.error("Captcha Search Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
