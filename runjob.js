console.log("Le fichier runjob.js démarre...");
const {
  checkPostAppointments,
} = require("../backendsafe/jobs/postAppointmentCheck");
const run = async () => {
  try {
    console.log("Exécution de checkPostAppointments...");
    await checkPostAppointments();
    console.log("Job terminé avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'exécution du job :", error);
  }
};

run();
