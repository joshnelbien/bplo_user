// routes/appStatusRoutes.js
const express = require("express");
const router = express.Router();
const AppStatus = require("../db/model/applicantStatusDB");

router.post("/", async (req, res) => {
  try {
    const appStatus = await appStatus.create(req.body);
    res.status(201).json(appStatus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Get all statuses (GET)
router.get("/", async (req, res) => {
  try {
    const statuses = await AppStatus.findAll();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const statuses = await AppStatus.findAll({ where: { userId } }); // <-- findAll
    if (!statuses || statuses.length === 0) {
      return res.status(404).json({ error: "No applications found" });
    }
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update status (PUT)
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const status = await AppStatus.findByPk(userId);
    if (!status) return res.status(404).json({ error: "Not found" });

    await status.update(req.body);
    res.json(status);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Delete status (DELETE)
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await AppStatus.destroy({ where: { userId } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
