const { Appointment, PostAppointmentCheck } = require("../models");
const { Op } = require("sequelize");

const checkPostAppointments = async () => {
  console.log("La fonction checkPostAppointments s'exécute !");

  const now = new Date();
  const nowPlus2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  console.log(nowPlus2h);

  console.log(now);
  // Calcul de la date 3h avant maintenant
  const threeHoursAgo = new Date(nowPlus2h.getTime() - 3 * 60 * 60 * 1000);

  // On définit une tolérance de ±1 minute (60 000 ms)
  const lowerBound = new Date(threeHoursAgo.getTime() - 60_000);
  const upperBound = new Date(threeHoursAgo.getTime() + 60_000);

  const appointments = await Appointment.findAll({
    where: {
      end_time: {
        [Op.between]: [lowerBound, upperBound],
      },
      state: "completed",
    },
  });

  for (const appointment of appointments) {
    const existingCheck = await PostAppointmentCheck.findOne({
      where: { appointmentId: appointment.id },
    });

    if (!existingCheck) {
      await PostAppointmentCheck.create({
        appointmentId: appointment.id,
        notification_sent_at: nowPlus2h,
        status: "pending",
        alert_sent_to_contact: false,
      });

      console.log(`Notification envoyée pour le RDV ${appointment.id}`);
    }
  }
};

module.exports = { checkPostAppointments };
