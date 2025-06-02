const express = require("express");
const router = express.Router();
const { PostAppointmentCheck } = require("../../models");

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const postCheck = await PostAppointmentCheck.findByPk(id);
    if (!postCheck) {
      console.log("Aucun enregistrement trouvé pour l’ID :", id);
    }
    if (!postCheck) {
      return res.status(404).json({ error: "Enregistrement non trouvé" });
    }

    await postCheck.update({
      response_received_at: new Date(),
      status: "completed",
    });

    res.json({ message: "Mise à jour réussie", data: postCheck });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
