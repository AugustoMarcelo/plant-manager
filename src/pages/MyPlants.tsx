import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { formatDistance } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Header } from '../components/Header';
import { loadPlants } from '../libs/storage';
import { PlantProps } from '../types';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

import waterdropImg from '../assets/waterdrop.png';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlants();

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date(),
        { locale: ptBR }
      );

      setNextWatered(
        `Regue sua ${plantsStoraged[0].name} daqui a ${nextTime}`
      );

      setMyPlants(plantsStoraged);
      setLoading(false);
    }

    loadStorageData();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={waterdropImg} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}>{nextWatered}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={myPlants}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PlantCardSecondary data={item} />
          )}
        />
      </View>
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
    justifyContent: 'space-between'
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
    width: '100%'
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
