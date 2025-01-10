const moment = require("moment");
const { Appointment } = require("../models");
const { Op } = require("sequelize");

const activateTracking = async () => {
  console.log("Scheduler script is running!");

  const now = moment().toISOString();
  const appointments = await Appointment.findAll({
    where: {
      state: "planned",
      start_time: {
        [Op.lte]: moment(now).add(30, "minutes").toISOString(),
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
  const now = moment().toISOString();
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

const cron = require("node-cron");

cron.schedule("*/1 * * * *", () => {
  activateTracking();
  console.log("activateTracking script is running!");
  trackposition();
  completeAppointments();
  console.log("completeAppointments script is running!");
});

module.exports = { activateTracking, completeAppointments };
