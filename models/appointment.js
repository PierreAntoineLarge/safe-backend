"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appointment.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  Appointment.init(
    {
      userId: DataTypes.INTEGER,
      start_time: DataTypes.DATE,
      end_time: DataTypes.DATE,
      state: DataTypes.STRING,
      location_data_retained: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Appointment",
    },
  );

  return Appointment;
};
