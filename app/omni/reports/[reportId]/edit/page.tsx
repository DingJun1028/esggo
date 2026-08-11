import { notFound } from 'next/navigation';
import DynamicFormEngine from '@/components/omni/reports/DynamicFormEngine';
import FloatingFunctionKey428 from '@/components/omni/reports/FloatingFunctionKey428';
import { getSchemaByUUID } from '@/lib/omni-reports/registry';

export const dynamic = 'force-dynamic';

// Next.js 15+ 非同步 params
export default async function ReportEditPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  const schema = await getSchemaByUUID(reportId);

  if (!schema) {
    notFound();
  }

  return (
    <div className="min-h-screen relative p-8">
      <FloatingFunctionKey428 />
      <div className="max-w-4xl mx-auto pt-10">
        <DynamicFormEngine schema={schema} />
      </div>
    </div>
  );
}
