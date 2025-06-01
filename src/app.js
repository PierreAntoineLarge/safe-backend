const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
require("../jobs/scheduler");
const locationTrackingRoutes = require("./routes/locationTracking");
const adminRoute = require("./routes/admin");
const passwordRoutes = require("./routes/passwordroutes");
const userRoutes = require("./routes/userRoutes");
const { verifyToken } = require("../src/middleware/auth");
const cron = require("node-cron");
const { checkPostAppointments } = require("../jobs/postAppointmentCheck");
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

// ⚠️ Supprimé : app.use(cors());

const allowedOrigins = [
  "http://localhost:8081",
  "https://imn-46q-anonymous-8081.exp.direct",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Requête CORS reçue depuis :", origin);

      // Autoriser les requêtes sans origin (ex: curl, mobile app)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"], // ← ajoute ici
    credentials: true,
  })
);

// Prévol (preflight) OPTIONS requests pour tous les endpoints
app.options("*", cors());

app.use(bodyParser.json());

app.use("/locations", locationTrackingRoutes);
app.use("/admin", adminRoute);
app.use("/appointments", appointmentRoutes);
app.use("/auth", authRoutes);
app.use("/users", verifyToken, userRoutes);
app.use("/newpassword", passwordRoutes);

const PORT = process.env.PORT || 3000;

cron.schedule("*/1 * * * *", async () => {
  console.log("Vérification des RDV terminés pour lancer la notification...");
  await checkPostAppointments();
});

app.get("/", (req, res) => {
  res.status(200).send("Test route working!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
