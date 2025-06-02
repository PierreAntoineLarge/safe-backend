const moment = require("moment");
const { Appointment, PostAppointmentCheck, User } = require("../models");
const { Op } = require("sequelize");
require("dotenv").config();

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
const notifyCompletedAppointments = async (userId, AppointmentId) => {
  console.log("✅ La fonction notifyCompletedAppointments s'exécute !");

  const SibApiV3Sdk = require("sib-api-v3-sdk");

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("❌ La clé API BREVO n'est pas définie !");
    return;
  }
  SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey = apiKey;
  console.log("🔑 Clé API BREVO configurée.");

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const link = `${process.env.API_URL}/${AppointmentId}`;
  console.log("🔗 Lien généré :", link);
  const user = await User.findOne({
    where: { Id: userId },
  });
  const userEmail = user.dataValues.emergency_contact_email;
  console.log(userEmail);

  const sendEmail = async () => {
    try {
      console.log("🚀 Tentative d'envoi de l'email à :", userEmail);
      const sendSmtpEmail = {
        to: [{ email: userEmail }],
        templateId: 1,
        params: {
          link: link,
        },
        headers: {
          "X-Mailin-custom": "custom-header-value",
        },
      };

      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("✅ Email envoyé avec succès !");
      console.log("📬 ID du message :", data.messageId || data);
    } catch (error) {
      console.error("❌ Erreur lors de l’envoi du mail :");
      console.error(error.response?.body || error);
    }
  };

  console.log("📤 Appel de la fonction sendEmail...");
  await sendEmail();
  console.log("🏁 Fin de notifyCompletedAppointments.");
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

      const userId = appointment.userId;
      console.log("User ID:", userId);
      notifyCompletedAppointments(userId, appointment.id);

      console.log(`Notification envoyée pour le RDV ${appointment.id}`);
    }
  }
};

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
