import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import '../global.css';
import { queryClient } from '@/lib/queryClient';
import { initSentry } from '@/lib/sentry';
import { initPostHog } from '@/lib/posthog';
import { configureRevenueCat } from '@/lib/revenuecat';
import { useAuth, ritualStepFor } from '@/lib/auth';

initSentry();
void initPostHog();
void configureRevenueCat();

function AuthRouter() {
  const router = useRouter();
  const segments = useSegments();
  const { loading, session, profile, tier, hydrate } = useAuth();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (loading) return;
    const group = segments[0] as string | undefined;

    if (!session) {
      if (group !== '(marketing)' && group !== '(auth)') {
        router.replace('/(marketing)');
      }
      return;
    }

    const step = ritualStepFor(profile, tier);
    if (step !== 'complete') {
      if (group !== '(onboarding)') {
        router.replace(`/(onboarding)/${step}` as never);
      }
      return;
    }

    if (group !== '(app)') {
      router.replace('/(app)');
    }
  }, [loading, session, profile, tier, segments, router]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" />
          <AuthRouter />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0E0F12' } }}>
            <Stack.Screen name="(marketing)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
