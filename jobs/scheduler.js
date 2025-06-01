const moment = require("moment");
const { Appointment, PostAppointmentCheck } = require("../models");
const { Op } = require("sequelize");

const activateTracking = async () => {
  console.log("Scheduler script is running");

  const now = moment().toISOString();
  console.log(now);
  const appointments = await Appointment.findAll({
    where: {
      state: "planned",
      start_time: {
        [Op.lte]: moment(now).add(2.5, "hours").toISOString(),
        [Op.gt]: now,
      },
    },
  });
  appointments.forEach(async (appointment) => {
    appointment.state = "tracking";
    await appointment.save();
    console.log(`Tracking started for appointment ID: ${appointment.id}`);
  });
};

const trackposition = async () => {
  const now = moment().toISOString();
  const trackingstateappointments = await Appointment.findAll({
    where: {
      state: "tracking",
    },
  });
};

const completeAppointments = async () => {
  const now = moment().add(2, "hours").toISOString();
  const appointments = await Appointment.findAll({
    where: {
      state: "tracking",
      end_time: {
        [Op.lte]: now,
      },
    },
  });

  appointments.forEach(async (appointment) => {
    appointment.state = "completed";
    await appointment.save();
    console.log(`Appointment completed for ID: ${appointment.id}`);
  });
};

const checkPostAppointments = async () => {
  console.log("La fonction checkPostAppointments s'exécute !");

  const now = new Date();
  const nowPlus2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const threeHoursAgo = new Date(nowPlus2h.getTime() - 3 * 60 * 60 * 1000);

  const lowerBound = new Date(threeHoursAgo.getTime() - 60_000);
  console.log(lowerBound);
  const upperBound = new Date(threeHoursAgo.getTime() + 60_000);
  console.log(upperBound);
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

// const notifyCompletedAppointments = async () => {
//   const now = new Date();
//   const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

//   const appointments = await Appointment.findAll({
//     where: {
//       state: "completed",
//       end_time: {
//         [Op.lte]: threeHoursAgo,
//       },
//     },
//   });

//   for (const appointment of appointments) {
//     // Ici tu pourrais envoyer une vraie notification (e-mail, push...)
//     console.log(
//       `Notification envoyée à l'utilisateur du RDV ${appointment.id} : "Votre rendez-vous est terminé. Tout s'est-il bien passé ?"`
//     );

//     appointment.state = "sent";
//     await appointment.save();
//   }
// };

const cron = require("node-cron");

cron.schedule("*/1 * * * *", () => {
  activateTracking();
  console.log("activateTracking script is running!");
  trackposition();
  completeAppointments();
  console.log("completeAppointments script is running!");
  checkPostAppointments();
  // notifyCompletedAppointments();
  // console.log("notifyCompletedAppointments script is running!");
});

module.exports = { activateTracking, completeAppointments };
