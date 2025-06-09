const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../../models/user");

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

  console.log("== DEBUG JWT ==");
  console.log("Authorization header brut :", req.headers.authorization);
  console.log("Clé secrète utilisée :", JSON.stringify(process.env.JWT_SECRET));
  console.log("Token sans Bearer :", token);
  console.log("Clé secrète utilisée :", JSON.stringify(process.env.JWT_SECRET));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Erreur JWT :", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    console.log("Utilisateur authentifié :", decoded);
    next();
  });
}

// Middleware d'autorisation par rôle
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
