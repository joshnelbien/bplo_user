const express = require("express");
const Announcements = require("../db/model/announcements");
const router = express.Router();

// GET all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcements.findAll({
      order: [["date", "DESC"]],
    });
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new announcement
router.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }
  try {
    const newAnnouncement = await Announcements.create({ text });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE an announcement by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Announcements.destroy({
      where: { id },
    });
    if (deleted) {
      return res.status(204).json({ message: "Announcement deleted" });
    }
    res.status(404).json({ error: "Announcement not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;