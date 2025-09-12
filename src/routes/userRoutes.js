const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.put("/emergency-contact", userController.updateEmergencyContact);
//router.post("/request-reset-password", userController.requestResetPassword);

module.exports = router;
