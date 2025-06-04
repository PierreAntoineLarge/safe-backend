const express = require("express");
const router = express.Router();
const { Appointment, LocationTracking, User } = require("../../models");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

router.post("/", async (req, res) => {
  const { start_time, end_time } = req.body;
  const userId = req.userId;

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

router.get("/:id/positions", async (req, res) => {
  console.log("titi");
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment non trouvé" });
    }

    const positions = await LocationTracking.findAll({
      where: { appointmentId },
      order: [["timestamp", "ASC"]],
    });

    const result = positions.map((pos) => ({
      latitude: pos.latitude,
      longitude: pos.longitude,
      timestamp: pos.timestamp,
    }));

    res.json({ appointmentId, positions: result });
  } catch (error) {
    console.error("Erreur lors de la récupération des positions :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/:id/positions", async (req, res) => {
  console.log("📡 Requête reçue pour /appointments/:id/positions");
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      // 👇 Forcer JSON même pour les erreurs
      res.setHeader("Content-Type", "application/json");
      return res.status(404).json({ error: "Appointment non trouvé" });
    }

    const positions = await LocationTracking.findAll({
      where: { appointmentId },
      order: [["timestamp", "ASC"]],
    });

    const result = positions.map((pos) => ({
      latitude: pos.latitude,
      longitude: pos.longitude,
      timestamp: pos.timestamp,
    }));

    // 👇 Forcer le Content-Type JSON pour éviter toute confusion ngrok
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ appointmentId, positions: result });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des positions :", error);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: "Erreur serveur" });
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
