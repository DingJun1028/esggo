import OmniTableQueryProvider from '@/lib/omni-table/QueryProvider';

export default function DataSourcesLayout({ children }: { children: React.ReactNode }) {
  return <OmniTableQueryProvider>{children}</OmniTableQueryProvider>;
}
