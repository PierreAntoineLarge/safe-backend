console.log("Le fichier runjob.js démarre...");

const { activateTracking, completeAppointments } = require("./scheduler");
const run = async () => {
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
