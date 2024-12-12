const express = require("express");
const router = express.Router();
const { Appointment, User } = require("../../models");
const { verifyToken } = require("../middleware/auth"); // Middleware à créer pour vérifier le JWT

// Middleware pour vérifier le token
router.use(verifyToken);

// Créer un RDV
router.post("/", async (req, res) => {
  const { start_time, end_time } = req.body;
  const userId = req.userId; // Récupéré via le token

  try {
    const appointment = await Appointment.create({
      userId,
      start_time,
      end_time,
      state: "planned",
      location_data_retained: true,
    });
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Récupérer les RDV de l'utilisateur
router.get("/", async (req, res) => {
  const userId = req.userId;

  try {
    const appointments = await Appointment.findAll({ where: { userId } });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les détails d'un RDV
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const appointment = await Appointment.findOne({ where: { id, userId } });
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
