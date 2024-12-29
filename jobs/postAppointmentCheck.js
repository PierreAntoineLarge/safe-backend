const { Appointment, PostAppointmentCheck } = require("../models");
const { Op } = require("sequelize");

const checkPostAppointments = async () => {
  console.log("La fonction checkPostAppointments s'exécute !");

  const now = new Date();

  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const appointments = await Appointment.findAll({
    where: {
      end_time: {
        [Op.lt]: threeHoursAgo,
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
        notification_sent_at: now,
        status: "pending",
        alert_sent_to_contact: false,
      });

      console.log(`Notification envoyée pour le RDV ${appointment.id}`);
    }
  }
};

module.exports = { checkPostAppointments };
