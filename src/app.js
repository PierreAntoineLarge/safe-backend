const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
require("../jobs/scheduler");
const locationTrackingRoutes = require("./routes/locationTracking");
const passwordRoutes = require("./routes/passwordroutes");
const userRoutes = require("./routes/userRoutes");
const { verifyToken } = require("../src/middleware/auth");
const cron = require("node-cron");
const { checkPostAppointments } = require("../jobs/postAppointmentCheck");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(bodyParser.json());

app.use("/locations", locationTrackingRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/auth", authRoutes);
app.use("/users", verifyToken, userRoutes);
app.use("/newpassword", passwordRoutes);

const PORT = process.env.PORT || 3000;

cron.schedule("*/10 * * * *", async () => {
  console.log("Vérification des RDV terminés...");
  await checkPostAppointments();
});

app.get("/", (req, res) => {
  res.status(200).send("Test route working!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
