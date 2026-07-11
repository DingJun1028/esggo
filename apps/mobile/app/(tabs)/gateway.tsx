import React from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Button } from '../../src/components/NativeCards';
import { useTheme } from '../../src/theme';
import { gateway, type GatewayStatus, type SkillEntry } from '../../src/services/gateway';
import { useGatewayQuery } from '../../src/hooks/useGateway';

export default function GatewayScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const status = useGatewayQuery<GatewayStatus>(gateway.status);
  const skills = useGatewayQuery<{ skills: SkillEntry[] }>(gateway.skills);
  const swarm = useGatewayQuery(gateway.swarmEvents);

  const loading = status.loading || skills.loading || swarm.loading;
  const error = status.error || skills.error || swarm.error;

  const reload = () => {
    status.refetch();
    skills.refetch();
    swarm.refetch();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 20, backgroundColor: colors.bg },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.teal }]}>OmniAgent Gateway</Text>
        <Button title="重新整理" onPress={reload} variant="ghost" />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.teal} />
        </View>
      ) : error ? (
        <Card variant="warning">
          <Text style={[styles.body, { color: colors.textPrimary }]}>無法連線：{error}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            請確認 Gateway 已啟動（預設 http://localhost:8642）。
          </Text>
        </Card>
      ) : (
        <>
          <Card>
            <Text style={[styles.body, { color: colors.textPrimary }]}>Providers</Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              Gemini: {String(status.data?.providers.gemini)} · OpenRouter:{' '}
              {String(status.data?.providers.openrouter)} · Groq:{' '}
              {String(status.data?.providers.groq)}
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              Free models: {status.data?.providers.free_models} · Groq models:{' '}
              {status.data?.providers.groq_models}
            </Text>
          </Card>

          <Text style={[styles.sectionTitle, { color: colors.teal }]}>
            技能（{skills.data?.skills.length ?? 0}）
          </Text>
          {(skills.data?.skills ?? []).slice(0, 10).map((s, i) => (
            <Card key={s.id ?? i}>
              <Text style={[styles.body, { color: colors.textPrimary }]}>
                {s.name ?? s.id ?? '未命名技能'}
              </Text>
              {s.description ? (
                <Text style={[styles.meta, { color: colors.textSecondary }]}>{s.description}</Text>
              ) : null}
            </Card>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.teal }]}>
            Swarm 事件（{swarm.data?.total ?? 0}）
          </Text>
          <Card>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {swarm.data?.events.length ?? 0} 筆最近事件
            </Text>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '600' },
  meta: { fontSize: 13, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  center: { padding: 40, alignItems: 'center' },
});
