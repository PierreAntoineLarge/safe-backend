const { Appointment, PostAppointmentCheck } = require("../models");

const checkPostAppointments = async () => {
  const now = new Date();

  // Récupère les RDV terminés il y a 3 heures
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const appointments = await Appointment.findAll({
    where: {
      end_time: {
        [Op.lt]: threeHoursAgo,
      },
      state: "completed", // Assure-toi que l'état est bien 'completed'
    },
  });

  for (const appointment of appointments) {
    // Vérifie si une notification a déjà été envoyée
    const existingCheck = await PostAppointmentCheck.findOne({
      where: { appointmentId: appointment.id },
    });

    if (!existingCheck) {
      // Crée une entrée dans PostAppointmentCheck
      await PostAppointmentCheck.create({
        appointmentId: appointment.id,
        notification_sent_at: now,
        status: "pending",
        alert_sent_to_contact: false,
      });

      // Simule l'envoi d'une notification
      console.log(`Notification envoyée pour le RDV ${appointment.id}`);
    }
  }
};

module.exports = { checkPostAppointments };
