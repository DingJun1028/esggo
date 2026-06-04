export class JESMonitor {
    constructor(options) {
        this.data = [];
        this.carbonHistory = [];
        this.alerts = new Map();
        this.targetEmissions = options?.targetEmissions ?? new Map();
    }
    /** Record a new energy reading */
    addData(d) {
        this.data.push(d);
        this.carbonHistory.push({
            service: d.service,
            timestamp: d.timestamp,
            emission: d.emission || d.carbonEmission || 0,
            operation: 'measurement'
        });
    }
    /** Fetch real-time energy data from Supabase with retry logic */
    async fetchEnergyDataFromSupabase(maxRetries = 3) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
        }
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const { data, error } = await supabase
                    .from('energy_metrics')
                    .select('service,timestamp,energy_consumption,carbon_emission')
                    .order('timestamp', { ascending: false })
                    .limit(100);
                if (error)
                    throw error;
                return data.map((d) => ({
                    timestamp: new Date(d.timestamp),
                    service: d.service,
                    energyConsumption: Number(d.energy_consumption),
                    emission: Number(d.carbon_emission),
                    carbonEmission: Number(d.carbon_emission)
                }));
            }
            catch (err) {
                if (attempt === maxRetries)
                    throw err;
                await new Promise(r => setTimeout(r, 1000 * attempt));
            }
        }
        return [];
    }
    /** Check current energy data against configured target emissions */
    detectConflicts() {
        const conflicts = [];
        for (const d of this.data) {
            const target = this.targetEmissions.get(d.service);
            const currentEmission = d.emission || d.carbonEmission || 0;
            if (target && currentEmission > target) {
                const diff = currentEmission - target;
                const conflict = {
                    id: `conf_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
                    source: 'JESMonitor',
                    description: `Emissions for ${d.service} exceeded target by ${diff.toFixed(2)}`,
                    severity: diff > 15 ? 'high' : 'medium',
                    service: d.service,
                    expectedEmission: target,
                    actualEmission: currentEmission,
                    difference: diff
                };
                conflicts.push(conflict);
                if (diff > 15) {
                    this.alerts.set(d.service, `⚠️ 緊急：超過目標 ${diff.toFixed(2)}kgCO2e`);
                }
            }
        }
        return conflicts;
    }
    /** Generate textual optimization suggestions */
    suggestOptimizations(conflicts) {
        const suggestions = [];
        const priorityMap = new Map();
        for (const conflict of conflicts) {
            const diff = conflict.difference || 0;
            const service = conflict.service || 'unknown';
            if (!priorityMap.has(service) || priorityMap.get(service) < diff) {
                priorityMap.set(service, diff);
            }
        }
        const sortedServices = [...priorityMap.entries()].sort((a, b) => b[1] - a[1]);
        for (const [service, diff] of sortedServices) {
            suggestions.push(`服務: ${service} | 優化建議: 減少 ${diff.toFixed(2)}kgCO2e (優先級最高)`);
        }
        for (const c of conflicts) {
            const service = c.service || 'unknown';
            const diff = c.difference || 0;
            if (!sortedServices.find(([s]) => s === service)) {
                suggestions.push(`服務: ${service} | 優化建議: 減少 ${diff.toFixed(2)}kgCO2e`);
            }
        }
        return suggestions;
    }
    /** Get historical carbon data */
    getCarbonHistory(limit = 50) {
        return this.carbonHistory.slice(-limit);
    }
    /** Get active alerts */
    getActiveAlerts() {
        return this.alerts;
    }
    /** Clear resolved alerts */
    clearAlert(service) {
        this.alerts.delete(service);
    }
    /** Generate ASCII chart for terminal display */
    generateChart() {
        const history = this.getCarbonHistory(10);
        if (history.length === 0)
            return '無歷史數據';
        const max = Math.max(...history.map(h => h.emission));
        const min = Math.min(...history.map(h => h.emission));
        const range = max - min || 1;
        let chart = '\n📊 碳排歷史� graph (最近10筆)\n';
        chart += '─────────────────────────\n';
        history.forEach(h => {
            const barLength = Math.round((h.emission - min) / range * 30);
            const bar = '█'.repeat(barLength);
            chart += `${h.service.padEnd(16)} │ ${bar} ${h.emission.toFixed(1)}\n`;
        });
        chart += '─────────────────────────\n';
        return chart;
    }
}
//# sourceMappingURL=jes-monitor.js.map