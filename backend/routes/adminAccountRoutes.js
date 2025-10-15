const express = require("express");
const router = express.Router();
const AdminAccounts = require("../db/model/adminAccountsDB");

router.post("/admin-register", async (req, res) => {
  try {
    const newAdmin = await AdminAccounts.create(req.body);
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering admin" });
  }
});

module.exports = router;
