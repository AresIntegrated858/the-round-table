import { Tabs } from 'expo-router';
import { Text } from 'react-native';

/**
 * Authenticated app shell. v1 surfaces:
 *   - Feed (primary, ungated)
 *   - Library (tier-gated content)
 *   - Standards (member's own check-ins + standards review)
 *   - Settings (subscription, account deletion, sign out)
 */
export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0E0F12',
          borderTopColor: '#2A2A30',
        },
        tabBarActiveTintColor: '#B08D57',
        tabBarInactiveTintColor: '#7A7466',
        tabBarLabelStyle: { fontSize: 11, letterSpacing: 1 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'TABLE',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>◆</Text>,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'LIBRARY',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>◇</Text>,
        }}
      />
      <Tabs.Screen
        name="standards"
        options={{
          title: 'STANDARDS',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✱</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>≡</Text>,
        }}
      />
    </Tabs>
  );
}
