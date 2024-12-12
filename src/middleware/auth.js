const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, "secret-key", (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });

    req.userId = decoded.userId; // Ajouter l'ID utilisateur au req
    next();
  });
};

module.exports = { verifyToken };
