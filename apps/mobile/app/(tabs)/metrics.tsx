import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MetricCard } from '../../src/components/NativeCards';
import { metrics } from '../../src/data';
import { useTheme } from '../../src/theme';

export default function MetricsScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 20, backgroundColor: colors.bg },
      ]}
    >
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
});
