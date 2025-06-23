import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
        <Stack.Screen 
          name="event/[id]" 
          options={{ 
            title: 'Event Details',
            presentation: 'modal',
            headerShown: true,
          }} 
        />
        {/* Add more screens/modals here as needed */}
      </Stack>
    </AuthProvider>
  );
}
