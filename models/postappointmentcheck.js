"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostAppointmentCheck extends Model {}
  PostAppointmentCheck.init(
    {
      appointmentId: DataTypes.INTEGER,
      notification_sent_at: DataTypes.DATE,
      response_received_at: DataTypes.DATE,
      status: DataTypes.STRING,
      support_option_selected: DataTypes.STRING,
      alert_sent_to_contact: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "PostAppointmentCheck",
    }
  );
  return PostAppointmentCheck;
};
