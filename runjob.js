console.log("Le fichier runjob.js démarre...");
const {
  checkPostAppointments,
} = require("../backendsafe/jobs/postAppointmentCheck");
const {
  activateTracking,
  completeAppointments,
} = require("../backendsafe/jobs/scheduler");
const run = async () => {
  try {
    console.log("Exécution de checkPostAppointments...");
    await checkPostAppointments();
    console.log("Job terminé avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'exécution du job :", error);
  }
  try {
    console.log("Exécution de activateTracking...");
    await activateTracking();
    console.log("Job terminé avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'exécution du job :", error);
  }
  try {
    console.log("Exécution de completeAppointments...");
    await completeAppointments();
    console.log("Job terminé avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'exécution du job :", error);
  }
};

run();
