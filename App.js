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

const routineDays = [
  {
    title: 'Dia A',
    exercises: [
      {
        name: 'Jalon al pit / Lat Pulldown',
        prescription: '3 series x 10-12 repeticions',
        focus: 'Dorsal ample, espatlles i postura.',
        tutorial: 'Seu amb el pit obert i esquena neutra. Agafa la barra una mica mes ampla que les espatlles. Baixa cap a la part alta del pit portant els colzes cap avall. Evita tirar amb el coll o arquejar la lumbar.'
      },
      {
        name: 'Press de pit amb maquina o manuelles inclinades',
        prescription: '3 x 10-12',
        focus: 'Opcio mes segura que barra lliure si hi ha historial lumbar.',
        tutorial: 'Mantingues esquena recolzada i peus estables. Baixa amb control fins que els colzes quedin lleugerament per sota de l espatlla. Puja sense bloquejar agressivament els colzes ni aixecar la lumbar.'
      },
      {
        name: 'Rem assegut amb politja',
        prescription: '3 x 10-12',
        focus: 'Compensa hores assegut i reforca esquena mitjana.',
        tutorial: 'Seu alt, columna neutra. Inicia amb les escapules lleugerament enrere i porta el cable cap a abdomen superior o part baixa del pit. No facis impuls amb la lumbar.'
      },
      {
        name: 'Curl de biceps amb manuelles',
        prescription: '3 x 10-12',
        focus: 'Biceps amb control i sense compensacions.',
        tutorial: 'Colzes enganxats al cos. Puja sense balancejar el tronc i controla la baixada. Prioritza recorregut net abans que pes.'
      },
      {
        name: 'Face Pull',
        prescription: '3 x 15',
        focus: 'Deltoide posterior, romboides i part alta de l esquena. Ajuda amb espatlles avancades.',
        tutorial: 'Usa corda a l altura de la cara. Estira cap al front o nas i obre la corda al final. Mantingues colzes alts sense tensar el coll ni arquejar la lumbar.'
      },
      {
        name: 'Planxa',
        prescription: '3 x 30-45 segons',
        focus: 'Core sense carregar la lumbar.',
        tutorial: 'Colzes sota espatlles i cos en linia recta. Abdomen actiu i glutis lleugerament contrets. Atura la serie si notes carrega directa a la lumbar.'
      }
    ]
  },
  {
    title: 'Dia B',
    exercises: [
      {
        name: 'Rem amb maquina suportada al pit',
        prescription: '3 x 10-12',
        focus: 'Treball d esquena evitant carrega lumbar.',
        tutorial: 'Pit ben recolzat al suport. Estira portant colzes enrere i fes una pausa curta quan les escapules s ajunten. Baixa controlant sense separar el pit del suport.'
      },
      {
        name: 'Press de pit horitzontal',
        prescription: '3 x 10-12',
        focus: 'Pectoral amb estabilitat i control.',
        tutorial: 'Esquena i cap recolzats, peus ferms. Baixa amb control, mantingues espatlles estables i puja sense bloquejar de forma agressiva.'
      },
      {
        name: 'Jalon amb agafada neutra',
        prescription: '3 x 10-12',
        focus: 'Dorsal i biceps amb millor confort articular.',
        tutorial: 'Agafa les nanses amb palmells mirant-se. Baixa cap a la part alta del pit portant colzes cap avall i lleugerament enrere. No compensis tirant el cos enrere.'
      },
      {
        name: 'Curl martell',
        prescription: '3 x 10-12',
        focus: 'Biceps i avantbrac.',
        tutorial: 'Palmells mirant-se durant tot el moviment. Colzes quiets al costat del cos. Puja sense balanceig i baixa lentament, evitant carregar trapezi.'
      },
      {
        name: 'Reverse Fly amb maquina o cables',
        prescription: '3 x 15',
        focus: 'Postura, deltoide posterior i esquena alta.',
        tutorial: 'Pit obert i bracos lleugerament flexionats. Obre fins notar treball a la part posterior de l espatlla. No facis impuls ni forcis la lumbar.'
      },
      {
        name: 'Bird Dog',
        prescription: '3 x 10 per costat',
        focus: 'Estabilitzacio lumbar.',
        tutorial: 'Mans sota espatlles i genolls sota malucs. Esten brac i cama contraria mantenint pelvis estable. Moviment lent, sense arquejar la lumbar.'
      }
    ]
  }
];

const quickCircuit = [
  'Jalon al pit',
  'Press pit',
  'Rem assegut',
  'Curl biceps',
  'Face Pull'
];

const avoidExercises = [
  'Pes mort pesat',
  'Rem inclinat amb barra',
  'Squat molt pesat',
  'Press militar dret molt carregat',
  'Sit-up o crunch agressiu'
];

const priorityExercises = [
  'Jalon al pit',
  'Rem assegut',
  'Face Pull',
  'Press de pit',
  'Planxa / Bird Dog'
];

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

          <Text style={styles.sectionTitle}>Calorias</Text>
          <Text style={styles.text}>{analysis.calories_estimate} kcal</Text>

          <Text style={styles.sectionTitle}>Proteina</Text>
          <Text style={styles.text}>{analysis.protein_estimate} g</Text>

          <Text style={styles.sectionTitle}>Veredicto</Text>
          <Text style={styles.text}>{analysis.paufit_verdict}</Text>
        </View>
      )}

      <View style={styles.routineHeader}>
        <Text style={styles.kicker}>Modo98 v1.1</Text>
        <Text style={styles.routineTitle}>Rutina superior lumbar-safe</Text>
        <Text style={styles.text}>
          Alterna Dia A i Dia B durant 2-3 dies per setmana. Objectiu: 60% esquena i postura, 40% pit i bracos. Descans recomanat: 60-90 segons.
        </Text>
      </View>

      {routineDays.map((day) => (
        <View key={day.title} style={styles.card}>
          <Text style={styles.dayTitle}>{day.title}</Text>
          {day.exercises.map((exercise, index) => (
            <View key={exercise.name} style={styles.exerciseBlock}>
              <Text style={styles.exerciseName}>{index + 1}. {exercise.name}</Text>
              <Text style={styles.prescription}>{exercise.prescription}</Text>
              <Text style={styles.text}>{exercise.focus}</Text>
              <Text style={styles.tutorialLabel}>Tutorial</Text>
              <Text style={styles.text}>{exercise.tutorial}</Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.card}>
        <Text style={styles.dayTitle}>Si nomes tens 30 minuts</Text>
        <Text style={styles.text}>Fes aquest circuit: 3 rondes, 10-12 repeticions, descans 60-90 segons.</Text>
        {quickCircuit.map((item, index) => (
          <Text key={item} style={styles.listItem}>{index + 1}. {item}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.dayTitle}>Exercicis que evitaria de moment</Text>
        {avoidExercises.map((item) => (
          <Text key={item} style={styles.listItem}>- {item}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.dayTitle}>Exercicis amb mes retorn</Text>
        {priorityExercises.map((item, index) => (
          <Text key={item} style={styles.listItem}>{index + 1}. {item}</Text>
        ))}
        <Text style={styles.text}>
          Aquests cinc exercicis ajuden a tonificar pectoral, fer creixer biceps indirectament, enfortir esquena, millorar postura i protegir la lumbar.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050914'
  },
  content: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40
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
    marginTop: 20
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
  },
  routineHeader: {
    marginTop: 38,
    marginBottom: 2
  },
  kicker: {
    color: '#00ff99',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  routineTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 8
  },
  dayTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8
  },
  exerciseBlock: {
    borderTopWidth: 1,
    borderTopColor: '#1b2a3f',
    paddingTop: 14,
    marginTop: 14
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22
  },
  prescription: {
    color: '#00ff99',
    marginTop: 5,
    fontWeight: '700'
  },
  tutorialLabel: {
    color: 'white',
    fontWeight: '700',
    marginTop: 10
  },
  listItem: {
    color: '#cdd6e3',
    marginTop: 8,
    lineHeight: 22
  }
});