import OmniTableQueryProvider from '@/lib/oa-table/QueryProvider';

export default function DataSourcesLayout({ children }: { children: React.ReactNode }) {
  return <OmniTableQueryProvider>{children}</OmniTableQueryProvider>;
}
