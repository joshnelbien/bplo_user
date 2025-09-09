const express = require("express");
const Announcements = require("../db/model/announcements");
const router = express.Router();

// GET all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcements.findAll({
      order: [["createdAt", "DESC"]],
    });
    // Convert BLOB to base64 for frontend compatibility
    const response = announcements.map(ann => ({
      ...ann.toJSON(),
      attachedImageBlob: ann.attachedImageBlob ? ann.attachedImageBlob.toString('base64') : null,
    }));
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new announcement
router.post("/", async (req, res) => {
  const { text, startDate, endDate, createdBy, attachedImageBlob } = req.body;

  if (!text || !startDate || !endDate || !createdBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Convert base64 string to Buffer for BLOB storage
    const imageBuffer = attachedImageBlob ? Buffer.from(attachedImageBlob, 'base64') : null;

    const newAnnouncement = await Announcements.create({
      text,
      startDate,
      endDate,
      createdBy,
      attachedImageBlob: imageBuffer,
    });
    res.status(201).json({
      ...newAnnouncement.toJSON(),
      attachedImageBlob: newAnnouncement.attachedImageBlob ? newAnnouncement.attachedImageBlob.toString('base64') : null,
    });
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