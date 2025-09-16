// backendsafe/src/controllers/userController.js
const User = require("../../models/user"); // exemple de modèle Mongoose

async function updateEmergencyContact(req, res) {
  try {
    const { emergencyContactName, emergencyContactEmail } = req.body;
    const userId = req.user.id; // supposons que l'user est authentifié

    if (!emergencyContactName || !emergencyContactEmail) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      userId,
      { emergencyContactName, emergencyContactEmail },
      { new: true }
    );

    res.json({ message: "Contact d'urgence mis à jour", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = { updateEmergencyContact };
