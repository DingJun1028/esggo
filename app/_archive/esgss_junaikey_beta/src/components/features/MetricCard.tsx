import { Card } from '@/components/ui/Card.tsx';
import { Badge } from '@/components/ui/Badge.tsx';
import { cn } from '@/lib/utils.js';

interface MetricCardProps {
    title: string;
    value: string;
    unit: string;
    status?: 'verified' | 'draft' | 'warning' | 'error';
    className?: string;
}

export function MetricCard({ title, value, unit, status, className }: MetricCardProps) {
    return (
        <Card className={cn('flex flex-col gap-2', className)} hover glow={status === 'verified'}>
            <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</span>
                {status && <Badge status={status}>{status}</Badge>}
            </div>
            <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-white tracking-tighter">{value}</span>
                <span className="text-sm font-medium text-slate-500">{unit}</span>
            </div>
        </Card>
    );
}
