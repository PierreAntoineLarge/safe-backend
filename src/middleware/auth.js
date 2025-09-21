const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    console.log("1️⃣ Vérification du token commencée");
    console.log(
      "JWT_SECRET utilisé pour vérification :",
      process.env.JWT_SECRET
    );

    const tokenHeader = req.headers["authorization"];
    console.log("2️⃣ Header Authorization :", tokenHeader);

    if (!tokenHeader) {
      console.log("⚠️ Aucun token fourni");
      return res.status(403).json({ error: "No token provided" });
    }

    const token = tokenHeader.split(" ")[1]; // Bearer <token>
    console.log("3️⃣ Token extrait :", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("⚠️ Erreur JWT, JWT_SECRET :", process.env.JWT_SECRET);
        console.error("Erreur JWT :", err);
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("4️⃣ Token décodé :", decoded);
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    console.error("🔥 Middleware verifyToken erreur :", error);
    res.status(500).json({ error: "Erreur serveur token" });
  }
};

module.exports = { verifyToken };
