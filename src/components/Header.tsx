import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, Image } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>{title}</Text>
        <Text style={styles.username}>{subtitle}</Text>
      </View>
      <Image source={{ uri: 'https://github.com/augustomarcelo.png' }} style={styles.image} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  username: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 35,
  },
})