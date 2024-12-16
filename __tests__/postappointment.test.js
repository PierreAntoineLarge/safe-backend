const { PostAppointmentCheck } = require("../models");

describe("PostAppointmentCheck Model Tests", () => {
  it("should create a valid instance", async () => {
    const newCheck = await PostAppointmentCheck.create({
      appointmentId: 1,
      notification_sent_at: new Date(),
      response_received_at: new Date(),
      status: "Pending",
      support_option_selected: "Email",
      alert_sent_to_contact: true,
    });

    expect(newCheck).toBeDefined();
    expect(newCheck.appointmentId).toBe(1);
    expect(newCheck.status).toBe("Pending");
  });
});
