const db = require("../../models/index.js");
const { User } = db;

exports.updateEmergencyContact = async (req, res) => {
  const { emergencyContactEmail } = req.body;

  if (!emergencyContactEmail) {
    return res.status(400).json({ error: "Le contact d'urgence est requis." });
  }

  try {
    const user = await User.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Mettre à jour le contact d'urgence
    user.emergency_contact_email = emergencyContactEmail;
    await user.save();

    res
      .status(200)
      .json({ message: "Contact d'urgence mis à jour avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
