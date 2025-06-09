const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  console.log("Authorization header reçu :", req.headers.authorization);

  if (!token) return res.status(403).json({ error: "No token provided" });
  console.log("Clé utilisée pour vérification :", process.env.JWT_SECRET);

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Erreur JWT :", err);
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = decoded.id;
    console.log(req.userId);
    next();
  });
};

module.exports = { verifyToken };
