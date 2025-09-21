const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Authorization header reçu :", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization header missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token is missing after Bearer",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Erreur JW-T :", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    console.log("Utilisateur authentifié :", decoded);
    next();
  });
}

function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({
        message: "User role missing from token",
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access forbidden: insufficient rights",
      });
    }

    next();
  };
}

module.exports = {
  authenticateJWT,
  authorizeRole,
};
