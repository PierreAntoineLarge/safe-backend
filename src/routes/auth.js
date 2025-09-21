const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const bcrypt = require("bcrypt");
require("dotenv").config();
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
      role: "user",
    });
    res.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("1️⃣ Login démarré");

    const { email, password } = req.body;
    console.log("2️⃣ Body reçu :", { email, password });

    // Vérifie que email et password existent
    if (!email || !password) {
      console.log("⚠️ Email ou password manquant");
      return res.status(400).json({ error: "Email et password requis" });
    }

    const user = await User.findOne({ where: { email } });
    console.log("3️⃣ Utilisateur trouvé :", user ? true : false);

    if (!user) return res.status(404).json({ error: "User not found" });

    console.log("4️⃣ Hash stocké :", user.password_hash);
    const match = await bcrypt.compare(password, user.password_hash);
    console.log("5️⃣ Mot de passe correct ?", match);

    if (!match)
      return res
        .status(401)
        .json({ error: "Email et/ou mot de passe invalide" });

    if (!process.env.JWT_SECRET) {
      console.log("⚠️ JWT_SECRET non défini");
      return res.status(500).json({ error: "JWT_SECRET non défini" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    console.log("Secret utilisé pour signer :", process.env.JWT_SECRET);

    console.log("6️⃣ JWT généré :", token);

    res.json({ success: true, token });
  } catch (error) {
    console.error("🔥 Erreur login :", error);
    res.status(500).json({ error: "Erreur serveur2" });
  }
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
