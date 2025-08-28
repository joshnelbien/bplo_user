const express = require("express");
const bcrypt = require("bcryptjs");
const UserAccounts = require("../db/model/userAccounts");

const router = express.Router();

// REGISTER endpoint
router.post("/register", async (req, res) => {
  try {
    const { lastname, firstname, email, password } = req.body;

    // Check if email exists
    const existingUser = await UserAccounts.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // 🔑 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = await UserAccounts.create({
      lastname,
      firstname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await UserAccounts.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserAccounts.findByPk(id, {
      attributes: ["id", "firstname", "lastname", "email"], // only return safe fields
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
