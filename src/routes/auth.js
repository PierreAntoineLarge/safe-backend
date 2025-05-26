const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email déjà utilisé");
    }
    const user = await User.create({
      email,
      password_hash,
    });
    res.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  console.log("Reçu :", req.body);
  const { email, password } = req.body;
  console.log(email, password);

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match)
    return res.status(401).json({ error: "Email et/ou mot de passe invalide" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  console.log(token);
  res.json({ success: true, token });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ success: "email envoyé" });
});

module.exports = router;
