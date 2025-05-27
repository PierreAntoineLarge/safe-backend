const express = require("express");
const router = express.Router();
const {
  authorizeRole,
  authenticateJWT,
} = require("../middleware/authorizeRole");
const { User } = require("../../models");

router.post(
  "/admin/dashboard",
  authenticateJWT,
  authorizeRole("admin"),
  (req, res) => {
    console.log("titi");
    res.json({ message: "Welcome admin!" });
  }
);

router.post(
  "/admin/users",
  authenticateJWT,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const users = await User.findAll();
      const plainUsers = users.map((user) => user.toJSON());
      res.json(plainUsers); // On renvoie directement un tableau JSON
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
