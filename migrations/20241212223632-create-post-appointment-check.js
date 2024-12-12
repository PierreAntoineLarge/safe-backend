'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PostAppointmentChecks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appointmentId: {
        type: Sequelize.INTEGER
      },
      notification_sent_at: {
        type: Sequelize.DATE
      },
      response_received_at: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      support_option_selected: {
        type: Sequelize.STRING
      },
      alert_sent_to_contact: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PostAppointmentChecks');
  }
};