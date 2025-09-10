import React, { useState } from "react";
import { API_URL } from "../../config";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useUser } from "../context/UserContext";

export default function EmergencyContact({ navigation }) {
  const { user } = useUser();
  const token = user?.token;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleValidate = async () => {
    if (!token) {
      Alert.alert("Erreur", "Vous n'êtes pas authentifié.");
      return;
    }

    if (name.trim() === "" || email.trim() === "") {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/emergency-contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emergencyContactName: name,
          emergencyContactEmail: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Succès", data.message);
        setIsSubmitted(true);
      } else {
        Alert.alert("Erreur", data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error);
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  };

  const handleBackToHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {!isSubmitted ? (
        <>
          <Text style={styles.title}>Mon contact d'urgence</Text>

          <TextInput
            style={styles.input}
            placeholder="Nom et Prénom du contact d'urgence"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Son adresse email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={styles.validateButton}
            onPress={handleValidate}
          >
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.message}>Le contact a bien été enregistré !</Text>
          <TouchableOpacity style={styles.okButton} onPress={handleBackToHome}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
