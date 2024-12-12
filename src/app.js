const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
require("../jobs/scheduler");
const locationTrackingRoutes = require("./routes/locationTracking");

const app = express();

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Définir les routes
app.use("/locations", locationTrackingRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/auth", authRoutes);

// Port d'écoute
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("Test route working!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
