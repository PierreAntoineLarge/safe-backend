const express = require("express");
const router = express.Router();
const {
  authenticateJWT,
  authorizeRole,
} = require("../middleware/authorizeRole"); // adapte le chemin si nécessaire

router.get(
  "/admin/dashboard",
  authenticateJWT,
  authorizeRole("admin"),
  (req, res) => {
    res.send("Welcome admin!");
  }
);

module.exports = router;
