import React from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, MetricCard } from '../../src/components/NativeCards';
import { metrics } from '../../src/data';
import { useTheme } from '../../src/theme';
import { gateway } from '../../src/services/gateway';
import { useGatewayQuery } from '../../src/hooks/useGateway';

export default function DashboardScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { data: health, loading, error } = useGatewayQuery(gateway.health);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 20, backgroundColor: colors.bg },
      ]}
    >
      <Text style={[styles.title, { color: colors.teal }]}>ESGGO Mobile</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        React Native · Hermes · expo-router
      </Text>

      <Card>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: health
                  ? colors.teal
                  : error
                    ? colors.gold
                    : colors.textMuted,
              },
            ]}
          />
          <Text style={[styles.statusText, { color: colors.textPrimary }]}>
            {health ? 'Gateway 連線正常' : error ? 'Gateway 離線 / 未啟動' : '連線中…'}
          </Text>
          {loading && !error ? <ActivityIndicator size="small" color={colors.teal} /> : null}
        </View>
        {health ? (
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            ws_clients: {health.ws_clients} · errors: {health.errors}
          </Text>
        ) : null}
      </Card>

      <Text style={[styles.sectionTitle, { color: colors.teal }]}>重點指標</Text>
      {metrics.slice(0, 3).map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: '700' },
  subtitle: { fontSize: 14, marginBottom: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  statusText: { fontSize: 15, fontWeight: '600' },
  meta: { fontSize: 13, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 8 },
});
