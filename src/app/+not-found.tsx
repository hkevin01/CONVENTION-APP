import React from 'react';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

export default function NotFoundScreen() {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      accessibilityRole="alert"
      accessible
      accessibilityLabel="Screen not found"
    >
      <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
        404 - Not Found
      </ThemedText>
      <ThemedText>
        The page you are looking for does not exist.
      </ThemedText>
    </ThemedView>
  );
}
