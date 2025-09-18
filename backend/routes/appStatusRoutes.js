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
  const { userId } = req.params; // from useParams

  try {
    // Fetch all statuses for this userId
    const statuses = await AppStatus.findAll({
      where: {
        userId: userId, // filter by userId
      },
    });

    if (!statuses || statuses.length === 0) {
      console.log("No statuses found for this userId");
      return res.status(404).json({ error: "No applications found" });
    }

    res.json(statuses);
  } catch (error) {
    console.error("Error fetching tracker:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update status (PUT)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const status = await AppStatus.findByPk(id);
    if (!status) return res.status(404).json({ error: "Not found" });

    await status.update(req.body);
    res.json(status);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Delete status (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AppStatus.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
