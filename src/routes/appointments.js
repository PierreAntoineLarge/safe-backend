const express = require("express");
const router = express.Router();
const { Appointment, LocationTracking, User } = require("../../models");
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

router.post("/:id/locations", async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, timestamp } = req.body;

  try {
    const appointment = await Appointment.findOne({
      where: { id, userId: req.userId },
    });
    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });

    // Vérifie que le RDV est en état "tracking"
    if (appointment.state !== "tracking") {
      return res
        .status(400)
        .json({ error: "Location tracking not allowed for this appointment" });
    }

    const location = await LocationTracking.create({
      appointmentId: id,
      latitude,
      longitude,
      timestamp,
    });

    res.json({ success: true, location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/post-check", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status, support_option } = req.body;

  try {
    const postCheck = await PostAppointmentCheck.findOne({
      where: { appointmentId: id },
    });
    if (!postCheck)
      return res
        .status(404)
        .json({ error: "Post-appointment check not found" });

    postCheck.status = status;
    postCheck.response_received_at = new Date();
    if (status === "problem") {
      postCheck.support_option_selected = support_option;
    }
    await postCheck.save();

    res.json({ success: true, postCheck });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
