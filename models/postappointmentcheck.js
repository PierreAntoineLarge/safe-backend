'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostAppointmentCheck extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PostAppointmentCheck.init({
    appointmentId: DataTypes.INTEGER,
    notification_sent_at: DataTypes.DATE,
    response_received_at: DataTypes.DATE,
    status: DataTypes.STRING,
    support_option_selected: DataTypes.STRING,
    alert_sent_to_contact: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PostAppointmentCheck',
  });
  return PostAppointmentCheck;
};