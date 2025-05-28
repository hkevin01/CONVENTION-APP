import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HelloWave() {
  return (
    <View style={styles.container}>
      <Text style={styles.wave}>👋</Text>
      <Text style={styles.text}>Hello, Convention!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', margin: 16 },
  wave: { fontSize: 48 },
  text: { fontSize: 18, marginTop: 8 },
});
