const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const postAppointmentRoutes = require("./routes/postAppointment");
require("../jobs/scheduler");
const locationTrackingRoutes = require("./routes/locationTracking");
const adminRoute = require("./routes/admin");
const passwordRoutes = require("./routes/passwordroutes");
const userRoutes = require("./routes/userRoutes");
const mapRoutes = require("./routes/map");
const cron = require("node-cron");
require("dotenv").config();
require("../jobs/runjob");
const cors = require("cors");
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const allowedOrigins = [
  "http://localhost:8081",
  "https://imn-46q-anonymous-8081.exp.direct",
  "https://5f38f7006002.ngrok-free.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(bodyParser.json());

app.use("/locations", locationTrackingRoutes);
app.use("/admin", adminRoute);
app.use("/appointments", appointmentRoutes);
app.use("/map", mapRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/newpassword", passwordRoutes);
app.use("/postAppointment", postAppointmentRoutes);

const PORT = process.env.PORT || 3000;

cron.schedule("0 */10 * * *", async () => {
  console.log("Vérification des RDV terminés pour lancer la notification...");
});

app.get("/", (req, res) => {
  res.status(200).send("Test route working!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
