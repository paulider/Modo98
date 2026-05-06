import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: false
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      analyzeFood(result.assets[0].uri);
    }
  }

  async function analyzeFood(imageUri) {
    try {
      setLoading(true);
      setAnalysis(null);

      const response = await fetch('https://YOUR_BACKEND_URL/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageUri })
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo analizar la comida');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style='light' />

      <Text style={styles.title}>PauFit</Text>
      <Text style={styles.subtitle}>
        Analiza tu comida con IA
      </Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Subir comida</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {loading && (
        <ActivityIndicator size='large' color='#00ff99' style={{ marginTop: 20 }} />
      )}

      {analysis && (
        <View style={styles.card}>
          <Text style={styles.rating}>{analysis.rating}</Text>

          <Text style={styles.sectionTitle}>Calorías</Text>
          <Text style={styles.text}>{analysis.calories_estimate} kcal</Text>

          <Text style={styles.sectionTitle}>Proteína</Text>
          <Text style={styles.text}>{analysis.protein_estimate} g</Text>

          <Text style={styles.sectionTitle}>Veredicto</Text>
          <Text style={styles.text}>{analysis.paufit_verdict}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050914',
    paddingTop: 80,
    paddingHorizontal: 20
  },
  title: {
    color: 'white',
    fontSize: 42,
    fontWeight: '700'
  },
  subtitle: {
    color: '#8b9bb4',
    marginTop: 8,
    marginBottom: 30,
    fontSize: 16
  },
  button: {
    backgroundColor: '#00ff99',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: '#050914',
    fontWeight: '700',
    fontSize: 16
  },
  image: {
    width: '100%',
    height: 320,
    borderRadius: 20,
    marginTop: 20
  },
  card: {
    backgroundColor: '#0c1626',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 40
  },
  rating: {
    color: '#00ff99',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12
  },
  text: {
    color: '#cdd6e3',
    marginTop: 4,
    lineHeight: 22
  }
});
