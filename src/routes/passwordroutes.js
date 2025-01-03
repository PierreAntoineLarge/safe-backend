const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/request-reset-password", userController.requestResetPassword);

module.exports = router;
