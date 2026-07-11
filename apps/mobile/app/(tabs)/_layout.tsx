import { Tabs } from 'expo-router';
import { DESIGN_TOKENS } from '@esggo/shared';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTintColor: DESIGN_TOKENS.teal,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: DESIGN_TOKENS.teal,
        tabBarInactiveTintColor: DESIGN_TOKENS.textMuted,
        tabBarStyle: { backgroundColor: DESIGN_TOKENS.surface, borderTopColor: DESIGN_TOKENS.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: '儀表板', tabBarLabel: '首頁' }} />
      <Tabs.Screen name="metrics" options={{ title: 'ESG 指標', tabBarLabel: '指標' }} />
      <Tabs.Screen name="gateway" options={{ title: 'Gateway', tabBarLabel: 'Gateway' }} />
      <Tabs.Screen name="ui" options={{ title: 'UI 展示', tabBarLabel: 'UI' }} />
    </Tabs>
  );
}
