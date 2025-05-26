// src/middleware/authorizeRole.js
const jwt = require("jsonwebtoken");

function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access forbidden: insufficient rights" });
    }
    next();
  };
}

// Exemple de middleware JWT (à adapter selon ton code)
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      // Assigne les infos du token à req.user
      req.user = decoded;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }
}

module.exports = {
  authorizeRole,
  authenticateJWT,
};
