import AITableQueryProvider from '@/lib/aitable/QueryProvider';

export default function DataSourcesLayout({ children }: { children: React.ReactNode }) {
  return <AITableQueryProvider>{children}</AITableQueryProvider>;
}
