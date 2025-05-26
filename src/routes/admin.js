const express = require("express");
const router = express.Router();
const {
  authorizeRole,
  authenticateJWT,
} = require("../middleware/authorizeRole");

router.get(
  "/admin/dashboard",
  authenticateJWT,
  authorizeRole("admin"),
  (req, res) => {
    console.log("titi");
    res.send("Welcome admin!");
  }
);

module.exports = router;
