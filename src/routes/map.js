const express = require("express");
const router = express.Router();
const { LocationTracking, Appointment } = require("../../models");

router.get("/:id/positions", async (req, res) => {
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

module.exports = router;
