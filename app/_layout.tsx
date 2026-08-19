import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from '../theme';

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.style.backgroundColor = theme.colors.exterior;
      document.documentElement.style.minHeight = '100%';
      document.body.style.backgroundColor = theme.colors.exterior;
      document.body.style.margin = '0';
      document.body.style.minHeight = '100%';
      const root = document.getElementById('root');
      if (root) {
        root.style.backgroundColor = theme.colors.exterior;
        root.style.minHeight = '100vh';
        root.style.width = '100vw';
      }
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.requestAnimationFrame(() => window.scrollTo({ left: 0, top: 0 }));
    }
  }, [pathname]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: theme.colors.exterior,
          },
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  );
}
