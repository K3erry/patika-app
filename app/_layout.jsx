import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/lib/AuthContext';

// Keep the splash screen visible while fonts and auth state load
SplashScreen.preventAutoHideAsync();

// -----------------------------------------------
// NavigationGuard
// Watches the auth state and redirects the user
// to the right place:
//  - Not logged in → welcome screen (auth flow)
//  - Logged in     → main app (tabs)
// -----------------------------------------------
const NavigationGuard = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router   = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Not logged in and not on an auth screen → send to welcome
      router.replace('/(auth)/welcome');
    } else if (user && inAuthGroup) {
      // Logged in but still on an auth screen → send to main app
      router.replace('/(tabs)');
    }
  }, [user, isLoading]);

  return null;
};

// -----------------------------------------------
// RootLayoutInner
// Loads fonts and hides the splash screen once ready.
// -----------------------------------------------
const RootLayoutInner = () => {
  const [fontsLoaded] = useFonts({
    // You can add custom fonts here later.
    // For now Expo uses the system font.
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <NavigationGuard />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)"  options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"  options={{ headerShown: false }} />
        <Stack.Screen
          name="business/[slug]"
          options={{
            headerShown:          true,
            headerTitle:          '',
            headerBackTitle:      'Back',
            headerTransparent:    true,
          }}
        />
      </Stack>
    </>
  );
};

// -----------------------------------------------
// RootLayout — exported as the app entry point.
// Wraps everything in AuthProvider so every screen
// can access the current user.
// -----------------------------------------------
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
