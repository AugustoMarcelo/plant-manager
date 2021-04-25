import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { formatDistance } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgFromUri } from 'react-native-svg';
import { useNavigation } from '@react-navigation/core';
import { Header } from '../components/Header';
import { Load } from '../components/Load';
import { loadPlants, removePlant } from '../libs/storage';
import { PlantProps } from '../types';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

import waterdropImg from '../assets/waterdrop.png';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyPlants() {
  const navigation = useNavigation();
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantProps>();

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlants();

      if (plantsStoraged.length === 0) {
        setNextWatered('Você ainda não cadastrou plantas para regar');
        setLoading(false);
        return;
      }

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date(),
        { locale: ptBR }
      );

      setNextWatered(`Regue sua ${plantsStoraged[0].name} daqui a ${nextTime}`);

      setMyPlants(plantsStoraged);
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function handleRemove() {
    if (!selectedPlant) return;

    try {
      await removePlant(selectedPlant.id);
      setMyPlants((oldState) =>
        oldState.filter((item) => item.id !== selectedPlant.id)
      );
      setModalIsOpen(false);
    } catch {
      Alert.alert('Ops', 'Não foi possível remover a plantinha.');
    }
  }

  function handleSelectPlant(plant: PlantProps) {
    setSelectedPlant(plant);
    setModalIsOpen(true);
  }

  function handleUpdatePlant(plant: PlantProps) {
    navigation.navigate('PlantUpdate', { plant });
  }

  if (loading) {
    return <Load />;
  }

  return (
    <View style={styles.container}>
      <Header title="Minhas" subtitle="Plantinhas" />

      <View style={styles.spotlight}>
        <Image source={waterdropImg} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}>{nextWatered}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={myPlants}
          ListEmptyComponent={() => (
            <View style={styles.emptyComponent}>
              <Text style={styles.emptyText}>Nenhuma plantinha encontrada</Text>
            </View>
          )}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              handleRemove={() => handleSelectPlant(item)}
              onPress={() => handleUpdatePlant(item)}
            />
          )}
        />
      </View>
      <Modal animationType="fade" statusBarTranslucent transparent visible={modalIsOpen}>
        <View style={styles.modal}>
          <View style={styles.card}>
            <LinearGradient
              style={styles.imageContainer}
              colors={['#F5FAF7', '#F0F0F0']}
              start={[0.1, 0.5]}
              end={[0.5, 1]}
            >
              {selectedPlant?.photo && (
                <SvgFromUri
                  uri={selectedPlant.photo}
                  width={100}
                  height={100}
                />
              )}
            </LinearGradient>
            <Text style={styles.question}>
              Deseja mesmo deletar sua{' '}
              <Text style={styles.plantName}>{selectedPlant?.name}</Text>?
            </Text>
            <View style={styles.buttons}>
              <Pressable
                onPress={() => setModalIsOpen(false)}
                style={styles.button}
              >
                <LinearGradient
                  style={styles.button}
                  colors={['#F5FAF7', '#F0F0F0']}
                >
                  <Text style={styles.cancelTextButton}>Cancelar</Text>
                </LinearGradient>
              </Pressable>
              <Pressable onPress={handleRemove}>
                <LinearGradient
                  style={styles.button}
                  colors={['#F5FAF7', '#F0F0F0']}
                >
                  <Text style={styles.deleteTextButton}>Deletar</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingLeft: 20,
    fontFamily: fonts.text,
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  card: {
    width: 265,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 32,
    position: 'absolute',
  },
  imageContainer: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 20,
  },
  question: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    lineHeight: 25,
  },
  plantName: {
    fontFamily: fonts.heading,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    height: 48,
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  cancelTextButton: {
    fontFamily: fonts.text,
    fontSize: 15,
    lineHeight: 23,
    color: colors.heading,
  },
  deleteTextButton: {
    fontFamily: fonts.text,
    fontSize: 15,
    lineHeight: 23,
    color: colors.red,
  },
  emptyComponent: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 15,
  },
});
