const express = require("express");
const router = express.Router();
const {
  authorizeRole,
  authenticateJWT,
} = require("../middleware/authorizeRole");

router.post(
  "/admin/dashboard",
  authenticateJWT,
  authorizeRole("admin"),
  (req, res) => {
    console.log("titi");
    res.json({ message: "Welcome admin!" });
  }
);

module.exports = router;
