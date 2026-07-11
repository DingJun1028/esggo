import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, MetricCard } from '../../src/components/NativeCards';
import { metrics } from '../../src/data';
import { useTheme } from '../../src/theme';

// Native showcase: same content as the web UI tab, but rendered with the
// React Native components styled from @esggo/shared (now theme-aware).
export default function UiShowcaseScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 20, backgroundColor: colors.bg },
      ]}
    >
      <Card variant="highlight">
        <Text style={[styles.note, { color: colors.textSecondary }]}>
          此畫面由 React Native 元件渲染（packages/shared 設計令牌上色，支援深色模式），與 Web 版 UI 共用同一份資料與主題。
        </Text>
      </Card>
      {metrics.slice(0, 3).map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  note: { fontSize: 13 },
});
