const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route pour mettre à jour le contact d'urgence
router.put("/emergency-contact", userController.updateEmergencyContact);

module.exports = router;
