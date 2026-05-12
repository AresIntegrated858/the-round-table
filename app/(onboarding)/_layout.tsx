import { Stack } from 'expo-router';

/**
 * The signup ritual route group. Each step gates the next via DB state
 * checked in `lib/auth.ts → ritualStepFor`. Hardware back is disabled
 * once a user has entered the ritual.
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        contentStyle: { backgroundColor: '#0E0F12' },
      }}
    />
  );
}
