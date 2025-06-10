const express = require("express");
const router = express.Router();
const { LocationTracking, Appointment } = require("../../models");
const { verifyToken } = require("../middleware/auth");

const verifyAppointmentState = async (req, res, next) => {
  const { appointmentId } = req.body;

  if (!appointmentId) {
    return res.status(404).json({ error: "Appointment not found at all" });
  }
  const appointment = await Appointment.findOne({
    where: {
      id: appointmentId,
      userId: req.userId, // sécurité
    },
  });
  if (appointment.state !== "tracking") {
    return res
      .status(200)
      .json({ backendmessage: "Appointment is not in tracking state" });
  }
  req.appointment = appointment;
  next();
};

router.post("/", verifyToken, verifyAppointmentState, async (req, res) => {
  const { appointmentId, latitude, longitude, timestamp } = req.body;

  try {
    const location = await LocationTracking.create({
      appointmentId,
      latitude,
      longitude,
      timestamp,
    });
    res.json({ success: true, location });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:appointmentId", verifyToken, async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const locations = await LocationTracking.findAll({
      where: { appointmentId },
      order: [["timestamp", "ASC"]],
    });
    res.json({ success: true, locations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
