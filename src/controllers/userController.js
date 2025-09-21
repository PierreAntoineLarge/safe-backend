const { body, validationResult } = require("express-validator");
const { User } = require("../../models");

const updateEmergencyContact = async (req, res) => {
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
    const userId = 1;
    console.log("userId reçu :", req.userId);

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    user.emergency_contact_name = emergencyContactName;
    user.emergency_contact_email = emergencyContactEmail;
    await user.save();

    res.json({ message: "Contact d'urgence mis à jour", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = { updateEmergencyContact };
