import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Table, RefreshCw, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { omniTableService } from '@/services/OmniTableService';

export const OmniTableDashboard: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [tables, setTables] = useState<any[]>([]);


    useEffect(() => {
        const fetchTables = async () => {
            try {
                // Fetch nodes from the configured space
                const nodes = await omniTableService.getSpaceNodes();

                // Filter for Datasheets only and map to display format
                const datasheets = nodes
                    .filter((node: any) => node.type === 'Datasheet')
                    .map((node: any) => ({
                        id: node.id,
                        name: node.name,
                        records: '-', // Node API doesn't return record count, uses placeholder
                        lastSync: new Date().toISOString() // Placeholder for sync time
                    }));

                if (datasheets.length > 0) {
                    setTables(datasheets);
                } else {
                    // Fallback to mock if API returns empty or fails (for demo purposes if no key)
                    setTables([
                        { id: 'dst1', name: 'CRM Contacts (Mock)', records: 1240, lastSync: '2026-02-16T10:00:00Z' },
                        { id: 'dst2', name: 'Project Tracker (Mock)', records: 85, lastSync: '2026-02-16T11:30:00Z' },
                        { id: 'dst3', name: 'ESG Metrics (Mock)', records: 342, lastSync: '2026-02-15T09:15:00Z' }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch tables:', error);
                // Fallback to mock on error
                setTables([
                    { id: 'dst1', name: 'CRM Contacts (Error Fallback)', records: 1240, lastSync: '2026-02-16T10:00:00Z' },
                ]);
            }
        };

        fetchTables();
    }, []);

    const handleSync = async () => {
        setStatus('loading');
        try {
            // Simulate sync
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (e) {
            setStatus('error');
        }
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-[#020617] text-white">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        OmniTable Fusion
                    </h1>
                    <p className="text-white/60 font-mono text-sm mt-2">
                        Data Synchronization & Bi-directional Linkage
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => window.open('https://aitable.ai', '_blank')}>
                        Open AITable <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                    <Button variant="primary" loading={status === 'loading'} onClick={handleSync}>
                        {status === 'success' ? 'Synced!' : 'Sync All Tables'}
                        {status !== 'loading' && status !== 'success' && <RefreshCw className="ml-2 w-4 h-4" />}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tables.map(table => (
                    <motion.div
                        key={table.id}
                        whileHover={{ y: -5 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4 text-purple-400">
                            <Table size={24} />
                            <h3 className="font-bold text-lg">{table.name}</h3>
                        </div>
                        <div className="space-y-2 text-sm text-gray-400 font-mono">
                            <div className="flex justify-between">
                                <span>Records:</span>
                                <span className="text-white">{table.records}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ID:</span>
                                <span>{table.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Last Sync:</span>
                                <span className="text-emerald-400">{new Date(table.lastSync).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default OmniTableDashboard;
