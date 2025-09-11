// routes/appStatusRoutes.js
const express = require("express");
const router = express.Router();
const appStatus = require("../models/appStatus");

// ✅ Create (POST)
router.post("/", async (req, res) => {
  try {
    const status = await appStatus.create(req.body);
    res.status(201).json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create status" });
  }
});

// ✅ Read All (GET)
router.get("/", async (req, res) => {
  try {
    const statuses = await appStatus.findAll();
    res.json(statuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch statuses" });
  }
});

// ✅ Read One by userId (GET)
router.get("/:userId", async (req, res) => {
  try {
    const status = await appStatus.findOne({
      where: { userId: req.params.userId },
    });
    if (!status) return res.status(404).json({ error: "Status not found" });
    res.json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

// ✅ Update by userId (PUT)
router.put("/:userId", async (req, res) => {
  try {
    const status = await appStatus.findOne({
      where: { userId: req.params.userId },
    });
    if (!status) return res.status(404).json({ error: "Status not found" });

    await status.update(req.body);
    res.json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// ✅ Delete by userId (DELETE)
router.delete("/:userId", async (req, res) => {
  try {
    const status = await appStatus.findOne({
      where: { userId: req.params.userId },
    });
    if (!status) return res.status(404).json({ error: "Status not found" });

    await status.destroy();
    res.json({ message: "Status deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete status" });
  }
});

module.exports = router;
