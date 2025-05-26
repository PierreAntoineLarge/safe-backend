"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Appointment, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
      },
      emergency_contact_email: DataTypes.STRING,
      reset_token: DataTypes.STRING,
      reset_token_expires: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
