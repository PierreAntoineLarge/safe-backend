const express = require("express");
const router = express.Router();
const { PostAppointmentCheck } = require("../../models");

/**
 * EN: This route handles updating a "PostAppointmentCheck" record by its ID.
 *     - It first retrieves the record from the database using the provided ID.
 *     - If the record is not found, it returns a 404 error.
 *     - If found, it updates the record by setting the response date to "now"
 *       and changing the status to "completed".
 *     - Finally, it sends back the updated record in the response.
 *
 * FR : Cette route permet de mettre à jour un enregistrement "PostAppointmentCheck"
 *      en fonction de son ID.
 *      - Elle commence par rechercher l’enregistrement correspondant dans la base.
 *      - Si aucun enregistrement n’est trouvé, elle retourne une erreur 404.
 *      - Si trouvé, elle met à jour l’enregistrement en ajoutant la date de réponse
 *        (date actuelle) et en modifiant le statut en "completed".
 *      - Elle renvoie ensuite l’enregistrement mis à jour dans la réponse.
 */
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
