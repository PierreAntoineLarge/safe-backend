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
  },
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
  },
);

router.post(
  "/admin/users/:id/role",
  authenticateJWT,
  authorizeRole("admin"),
  async (req, res) => {
    const userId = req.params.id;
    console.log(
      "➡️ Requête POST reçue pour modifier le rôle de l'utilisateur avec l'ID :",
      userId,
    );

    try {
      const user = await User.findByPk(userId);
      console.log(
        "🔍 Utilisateur trouvé :",
        user ? user.toJSON() : "Aucun utilisateur trouvé",
      );

      if (!user) {
        console.warn("⚠️ Utilisateur non trouvé");
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const roles = ["user", "admin", "inactive"];
      const currentRoleIndex = roles.indexOf(user.role);
      console.log("🔄 Rôle actuel :", user.role, "- Index :", currentRoleIndex);

      const nextRole = roles[(currentRoleIndex + 1) % roles.length];
      console.log("✅ Prochain rôle attribué :", nextRole);

      user.role = nextRole;
      await user.save();
      console.log("💾 Rôle mis à jour et sauvegardé en base");

      res.status(200).json({
        message: `Rôle de l'utilisateur mis à jour : ${nextRole}`,
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("❌ Erreur lors du changement de rôle :", error);
      res.status(500).json({ message: "Erreur serveur interne" });
    }
  },
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
  },
);

module.exports = router;
