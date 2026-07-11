import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, type AppColors } from '../theme';
import type { Metric } from '../data';

type Variant = 'default' | 'highlight' | 'success' | 'warning' | 'error';

const borderColorForVariant = (variant: Variant, colors: AppColors): string | undefined => {
  switch (variant) {
    case 'highlight':
    case 'success':
      return colors.teal;
    case 'warning':
      return colors.gold;
    case 'error':
      return colors.gold;
    default:
      return undefined;
  }
};

function makeStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 20,
      marginBottom: 16,
    },
    metricRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    metricLabel: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    metricValue: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
    },
    metricUnit: {
      fontSize: 14,
      fontWeight: '400',
    },
    metricChange: {
      fontSize: 13,
      marginTop: 4,
      fontWeight: '500',
    },
    button: {
      borderRadius: 6,
      paddingVertical: 10,
      paddingHorizontal: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
    },
  });
}

export function Card({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  const colors = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const borderLeft = borderColorForVariant(variant, colors);
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        borderLeft ? { borderLeftWidth: 4, borderLeftColor: borderLeft } : null,
      ]}
    >
      {children}
    </View>
  );
}

export function MetricCard({ label, value, unit, change, trend }: Metric) {
  const colors = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const trendColor =
    trend === 'up' ? colors.teal : trend === 'down' ? colors.gold : colors.textMuted;
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return (
    <Card>
      <View style={styles.metricRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{label}</Text>
          <Text style={[styles.metricValue, { color: colors.teal }]}>
            {value}
            {unit ? <Text style={[styles.metricUnit, { color: colors.textSecondary }]}> {unit}</Text> : null}
          </Text>
          {change !== undefined ? (
            <Text style={[styles.metricChange, { color: trendColor }]}>
              {trendIcon} {Math.abs(change)}% vs 上期
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}) {
  const colors = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const bg =
    variant === 'primary'
      ? colors.teal
      : variant === 'danger'
        ? colors.gold
        : colors.surface;
  const fg = variant === 'primary' || variant === 'danger' ? '#FFFFFF' : colors.textPrimary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}
    >
      <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}
