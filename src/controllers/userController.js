const db = require("../../models/index.js");
const crypto = require("crypto");
const { User } = db;
const axios = require("axios");
const BREVO_API_KEY = process.env.BREVO_API_KEY;

exports.updateEmergencyContact = async (req, res) => {
  const { emergencyContactEmail } = req.body;

  if (!emergencyContactEmail) {
    return res.status(400).json({ error: "Le contact d'urgence est requis." });
  }

  try {
    const user = await User.findOne({ where: { id: req.userId } });
    console.log("user");
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

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

exports.requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000);

    user.reset_token = resetToken;
    user.reset_token_expires = resetTokenExpires;
    await user.save({ fields: ["reset_token", "reset_token_expires"] });
    const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

    const emailData = {
      sender: { name: "SAFE", email: "pierreantoine.large@gmail.com" },
      to: [{ email }],
      subject: "Réinitialisation de mot de passe",
      htmlContent: `<p>Cliquez <a href="${resetUrl}">ici</a> pour réinitialiser votre mot de passe. Ce lien expire dans 1 heure.</p>`,
    };

    axios
      .post("https://api.brevo.com/v3/smtp/email", emailData, {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Email envoyé :", response.data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de l'envoi :",
          error.response ? error.response.data : error.message
        );
      });

    res.json({ message: "Password reset link has been sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
