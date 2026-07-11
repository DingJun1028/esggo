import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// @esggo/ui is a web-only (HTML/DOM) component library, so it is only imported
// on the web platform via this *.web.tsx file. Metro strips it from native builds.
import { Section, SolidCard, MetricCard } from '@esggo/ui';
import { metrics } from '../../src/data';
import { DESIGN_TOKENS } from '@esggo/shared';
import { useTheme } from '../../src/theme';

// Provide the CSS custom properties that @esggo/ui references (var(--accent-teal) ...).
const cssVars = {
  '--accent-teal': DESIGN_TOKENS.teal,
  '--accent-gold': DESIGN_TOKENS.gold,
  '--accent-blue': DESIGN_TOKENS.zkpBlue,
  '--accent-green': DESIGN_TOKENS.teal,
  '--bg-secondary': DESIGN_TOKENS.surface,
  '--border-color': DESIGN_TOKENS.border,
  '--text-primary': DESIGN_TOKENS.textPrimary,
  '--text-secondary': DESIGN_TOKENS.textSecondary,
  '--text-muted': DESIGN_TOKENS.textMuted,
} as unknown as React.CSSProperties;

// Web-only showcase: reuses @esggo/ui directly; container theming via useTheme().
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
      <div style={cssVars}>
        <Section title="UI 展示（Web）" subtitle="直接複用 @esggo/ui 與 @esggo/shared">
          <SolidCard variant="highlight">
            <Text style={[styles.note, { color: colors.textSecondary }]}>
              此畫面由 packages/ui 的 SolidCard / MetricCard 渲染，主題色來自 packages/shared 設計令牌。
            </Text>
          </SolidCard>
          {metrics.slice(0, 3).map((m) => (
            <MetricCard
              key={m.label}
              label={m.label}
              value={m.value}
              unit={m.unit}
              change={m.change}
              trend={m.trend}
            />
          ))}
        </Section>
      </div>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  note: { fontSize: 13 },
});
