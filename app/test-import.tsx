import { SearchInput } from './components/ui/index.tsx';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Search Input Focus Test</h1>
      <SearchInput onSearch={console.log} />
    </div>
  );
}
