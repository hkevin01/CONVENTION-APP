import React from 'react';
import { ScrollView } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';

export default function ExploreScreen() {
  return (
    <ThemedView
      style={{ flex: 1, padding: 24 }}
      role="main"
      accessible
      accessibilityLabel="Explore screen"
    >
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
        accessibilityRole="list"
        accessibilityLabel="Explore features"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          accessibilityRole="header"
          style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}
        >
          Explore Convention Features
        </ThemedText>
        <ThemedText style={{ marginBottom: 8 }}>
          Discover sessions, speakers, and more!
        </ThemedText>
        {/* Add more content or navigation here */}
      </ScrollView>
    </ThemedView>
  );
}
