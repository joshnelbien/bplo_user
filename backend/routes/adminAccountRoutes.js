const express = require("express");
const router = express.Router();
const AdminAccounts = require("../db/model/adminAccountsDB");
const bcrypt = require("bcrypt");

// ✅ REGISTER (already exists)
router.post("/admin-register", async (req, res) => {
  try {
    const { Password, ...rest } = req.body;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newAdmin = await AdminAccounts.create({
      ...rest,
      Password: hashedPassword,
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering admin" });
  }
});

// ✅ LOGIN (new)
router.post("/admin-login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const admin = await AdminAccounts.findOne({ where: { Email } });

    if (!admin) {
      return res.status(404).json({ message: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(Password, admin.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin.id,
        FirstName: admin.FirstName,
        LastName: admin.LastName,
        Office: admin.Office,
        Position: admin.Position,
        Email: admin.Email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
