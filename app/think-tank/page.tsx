import type { Metadata } from 'next';
import ThinkTankControl from '@/components/omni/ThinkTankControl';

export const metadata: Metadata = {
  title: '萬能智庫 Mission Control | ESGGO',
  description: 'Omnipotent Think Tank — Real-time Agent Orchestration, HITL Review & Scheduled Sync Dashboard',
};

export default function ThinkTankPage() {
  return <ThinkTankControl />;
}
