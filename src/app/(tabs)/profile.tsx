import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import useColorScheme from '../../hooks/useColorScheme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  };

  const handleSettings = () => {
    // TODO: Navigate to settings screen
    Alert.alert('Settings', 'Settings functionality coming soon!');
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Not Logged In</ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme].primary }]}
          onPress={() => router.push('/login' as any)}
        >
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Profile</ThemedText>
          <ThemedText style={styles.userName}>{user.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: Colors[colorScheme].border }]}
            onPress={handleEditProfile}
          >
            <ThemedText style={styles.menuText}>Edit Profile</ThemedText>
            <ThemedText style={styles.menuArrow}>→</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: Colors[colorScheme].border }]}
            onPress={handleSettings}
          >
            <ThemedText style={styles.menuText}>Settings</ThemedText>
            <ThemedText style={styles.menuArrow}>→</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: 'transparent' }]}
            onPress={handleLogout}
          >
            <ThemedText style={[styles.menuText, { color: Colors[colorScheme].error }]}>
              Logout
            </ThemedText>
            <ThemedText style={[styles.menuArrow, { color: Colors[colorScheme].error }]}>
              →
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
  },
  menuArrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
