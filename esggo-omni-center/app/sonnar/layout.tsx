export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ESGSonar — ESG 法規信號雷達',
  description: '即時監控全球 ESG 法規變動與企業永續報告動態',
};

export default function SonnarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
