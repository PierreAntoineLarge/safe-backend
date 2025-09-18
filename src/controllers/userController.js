const { body, validationResult } = require("express-validator");
const User = require("../../models/user");

async function updateEmergencyContact(req, res) {
  try {
    await Promise.all([
      body("emergencyContactName")
        .isString()
        .withMessage("Le nom doit être une chaîne de caractères")
        .notEmpty()
        .withMessage("Le nom du contact d'urgence est obligatoire")
        .run(req),

      body("emergencyContactEmail")
        .isEmail()
        .withMessage("L'email doit être valide")
        .normalizeEmail()
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { emergencyContactName, emergencyContactEmail } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { emergencyContactName, emergencyContactEmail },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({ message: "Contact d'urgence mis à jour", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
module.exports = { updateEmergencyContact };
