import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Header } from '../components/Header';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { Load } from '../components/Load';

interface EnvironmentProps {
  key: string;
  title: string;
}

interface Plant {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: string[];
  frequency: {
    times: number;
    repeat_every: string;
  };
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreDataToLoad, setHasMoreDataToLoad] = useState(false);

  async function fetchPlants() {
    const { data } = await api.get('plants', {
      params: {
        _sort: 'name',
        _order: 'asc',
        _page: page,
        _limit: 8,
      },
    });

    if (!data) {
      return setLoading(true);
    }

    if (page > 1) {
      setPlants([...plants, ...data]);
      setFilteredPlants([...filteredPlants, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  function handleSelectEnvironment(environment: string) {
    setSelectedEnvironment(environment);

    if (environment === 'all') {
      return setFilteredPlants(plants);
    }

    const filtered = plants.filter((plant) =>
      plant.environments.includes(environment)
    );

    setFilteredPlants(filtered);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) {
      return;
    }
    setLoadingMore(true);
    setPage(page + 1);
    fetchPlants();
  }

  useEffect(() => {
    async function fetchEnvironments() {
      const { data } = await api.get('plants_environments', {
        params: {
          _sort: 'title',
          _order: 'asc',
        },
      });
      setEnvironments([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data,
      ]);
    }

    fetchEnvironments();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) {
    return <Load />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          data={environments}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <EnvironmentButton
              title={item.title}
              active={item.key === selectedEnvironment}
              onPress={() => handleSelectEnvironment(item.key)}
            />
          )}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => <PlantCardPrimary data={item} />}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: fonts.text,
    lineHeight: 20,
    color: colors.heading,
  },
  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    paddingHorizontal: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: 'center',
  },
});