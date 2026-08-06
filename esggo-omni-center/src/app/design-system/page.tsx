'use client';

import React, { useState } from 'react';
import {
  SolidCard,
  CardHeader,
  MetricCard,
  Badge,
  Button,
  Section,
  Grid,
  Divider,
  ProgressBar,
} from '@esggo/ui';

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<'components' | 'colors' | 'typography'>('components');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-teal)', margin: 0 }}>
            Solid Card Design System
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            ESGGO UI Component Library — Teal + Gold + ZKP Blue
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['components', 'colors', 'typography'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'components' ? '元件' : tab === 'colors' ? '色彩' : '字體'}
            </Button>
          ))}
        </div>

        {activeTab === 'components' && <ComponentsShowcase />}
        {activeTab === 'colors' && <ColorsShowcase />}
        {activeTab === 'typography' && <TypographyShowcase />}
      </div>
    </div>
  );
}

function ComponentsShowcase() {
  return (
    <>
      <Section title="指標卡片" subtitle="Metric Cards — 關鍵數據一目了然">
        <Grid columns={4}>
          <MetricCard label="碳排放量" value="12,450" unit="tCO2e" change={-8} trend="up" />
          <MetricCard label="再生能源占比" value="67" unit="%" change={12} trend="up" />
          <MetricCard label="員工流動率" value="8.2" unit="%" change={3} trend="down" />
          <MetricCard label="董事會獨立性" value="75" unit="%" trend="neutral" />
        </Grid>
      </Section>

      <Divider />

      <Section title="卡片" subtitle="Solid Cards — 內容分塊容器">
        <Grid columns={2}>
          <SolidCard>
            <CardHeader title="預設卡片" subtitle="Default variant with standard border" />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              用於一般內容區塊，左側無色塊標記。
            </p>
          </SolidCard>

          <SolidCard variant="highlight">
            <CardHeader title="重點卡片" subtitle="Highlight variant with teal left border" />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              用於需要強調的重要資訊，左側青色色塊標記。
            </p>
          </SolidCard>

          <SolidCard variant="success">
            <CardHeader title="成功卡片" subtitle="Success variant with green left border" />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              用於正面指標或完成狀態。
            </p>
          </SolidCard>

          <SolidCard variant="warning">
            <CardHeader title="警告卡片" subtitle="Warning variant with amber left border" />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              用於需要注意的警示資訊。
            </p>
          </SolidCard>
        </Grid>
      </Section>

      <Divider />

      <Section title="標籤" subtitle="Badges — 狀態與分類標記">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge variant="teal">環境</Badge>
          <Badge variant="gold">社會</Badge>
          <Badge variant="blue">治理</Badge>
          <Badge variant="success">合規</Badge>
          <Badge variant="warning">待改善</Badge>
          <Badge variant="error">高風險</Badge>
          <Badge variant="muted">一般</Badge>
        </div>
      </Section>

      <Divider />

      <Section title="按鈕" subtitle="Buttons — 操作觸發器">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary">主要按鈕</Button>
          <Button variant="secondary">次要按鈕</Button>
          <Button variant="ghost">幽靈按鈕</Button>
          <Button variant="danger">危險按鈕</Button>
          <Button variant="primary" disabled>禁用狀態</Button>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'center' }}>
          <Button variant="primary" size="sm">小按鈕</Button>
          <Button variant="primary" size="md">中按鈕</Button>
          <Button variant="primary" size="lg">大按鈕</Button>
        </div>
      </Section>

      <Divider />

      <Section title="進度條" subtitle="Progress Bars — 完成度可視化">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>GRI 指標覆蓋率</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-teal)' }}>78%</span>
            </div>
            <ProgressBar value={78} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>SBTi 目標進度</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-gold)' }}>45%</span>
            </div>
            <ProgressBar value={45} color="var(--accent-gold)" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>CSRD 合規度</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-blue)' }}>92%</span>
            </div>
            <ProgressBar value={92} color="var(--accent-blue)" />
          </div>
        </div>
      </Section>
    </>
  );
}

function ColorsShowcase() {
  const colors = [
    { name: 'Teal (Primary)', var: 'var(--accent-teal)', desc: '主色調、標題、重點標記' },
    { name: 'Gold (Accent)', var: 'var(--accent-gold)', desc: '輔助色、進度、警示' },
    { name: 'ZKP Blue', var: 'var(--accent-blue)', desc: '資訊、連結、驗證標記' },
    { name: 'Success', var: 'var(--status-success)', desc: '正面指標、完成狀態' },
    { name: 'Warning', var: 'var(--status-warning)', desc: '注意、待改善' },
    { name: 'Error', var: 'var(--status-error)', desc: '錯誤、高風險' },
    { name: 'Background', var: 'var(--bg)', desc: '頁面背景' },
    { name: 'Surface', var: 'var(--surface)', desc: '卡片背景' },
    { name: 'Text Primary', var: 'var(--text-primary)', desc: '主要文字' },
    { name: 'Text Secondary', var: 'var(--text-secondary)', desc: '次要文字' },
    { name: 'Border', var: 'var(--border)', desc: '邊框' },
  ];

  return (
    <Section title="色彩系統" subtitle="Solid Card Palette — 主題自動切換">
      <Grid columns={3}>
        {colors.map((c) => (
          <SolidCard key={c.var}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: c.var, border: '1px solid var(--border)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{c.var}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.desc}</div>
              </div>
            </div>
          </SolidCard>
        ))}
      </Grid>
    </Section>
  );
}

function TypographyShowcase() {
  return (
    <Section title="字體系統" subtitle="Typography Scale">
      <SolidCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>H1 / 28px / 800</span>
            <h1 style={{ margin: '4px 0', fontSize: '28px', fontWeight: 800, color: 'var(--accent-teal)' }}>永續報告書</h1>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>H2 / 20px / 700</span>
            <h2 style={{ margin: '4px 0', fontSize: '20px', fontWeight: 700, color: 'var(--accent-teal)' }}>氣候策略與轉型計畫</h2>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>H3 / 16px / 600</span>
            <h3 style={{ margin: '4px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>範疇一排放盤查</h3>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Body / 14px / 400</span>
            <p style={{ margin: '4px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              透過科學基礎減量目標（SBTi）框架，本公司承諾在 2030 年前將範疇一與範疇二碳排放減少 50%。
            </p>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Caption / 12px / 400</span>
            <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              資料來源：2024 永續報告書，頁 42。查證機構：SGS Taiwan。
            </p>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Code / 13px / monospace</span>
            <code style={{ display: 'block', margin: '4px 0', padding: '8px', background: 'var(--surface-alt)', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              emissions_reduction = baseline * (1 - target_pct) → 12,450 tCO2e
            </code>
          </div>
        </div>
      </SolidCard>
    </Section>
  );
}
