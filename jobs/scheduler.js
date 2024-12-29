const moment = require("moment");
const { Appointment } = require("../models");
const { Op } = require("sequelize");

const activateTracking = async () => {
  const now = moment().toISOString();
  console.log(now);
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
  completeAppointments();
});

module.exports = { activateTracking, completeAppointments };
