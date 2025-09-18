const User = require("../../models/user");

async function updateEmergencyContact(req, res) {
  try {
    const { emergencyContactName, emergencyContactEmail } = req.body;
    const userId = req.user.id;

    if (!emergencyContactName || !emergencyContactEmail) {
      return res.status(400).json({ error: "Champs manquants" });
    }

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
