import React, { useState } from 'react';
import { registerRootComponent } from 'expo';
import { View, Text, StyleSheet, Image } from 'react-native';

// Simple App component for Expo
function App() {
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.container}>
      {!imageError ? (
        <Image
          source={require('./assets/icon.png')}
          style={styles.logo}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.fallbackLogo}>
          <Text style={styles.fallbackText}>CA</Text>
        </View>
      )}
      <Text style={styles.title}>Convention App</Text>
      <Text style={styles.subtitle}>Welcome to the Convention App!</Text>
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  fallbackLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  fallbackText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  version: {
    fontSize: 14,
    color: '#999',
  }
});

// Register the component directly
registerRootComponent(App);
