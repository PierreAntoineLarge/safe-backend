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
      res.json(plainUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.delete(
  "/admin/users/:id",
  authenticateJWT,
  authorizeRole("admin"),
  async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      await user.destroy();

      res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      res.status(500).json({ message: "Erreur serveur interne" });
    }
  }
);

module.exports = router;
