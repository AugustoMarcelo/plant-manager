import React from 'react';
import { StyleSheet, View } from 'react-native'
import LottieView from 'lottie-react-native';

import plantAnimation from '../assets/load.json';

export function Load() {
  return (
    <View style={styles.container}>
      <LottieView
        source={plantAnimation}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  animation: {
    backgroundColor: 'transparent',
    height: 200,
    width: 200,
  }
})