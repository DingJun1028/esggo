#!/usr/bin/env bash
set -euo pipefail

# 1. Ensure OmniAgentBus file exists (basic stub if missing)
BUS_FILE="C:/var/www/esggo/lib/agents/omni-agent-bus.ts"
if [ ! -f "$BUS_FILE" ]; then
  echo "🛠️ Creating minimal OmniAgentBus stub at $BUS_FILE"
  mkdir -p "$(dirname "$BUS_FILE")"
  cat > "$BUS_FILE" <<'EOF'
export class OmniAgentBus {
  private static instance: OmniAgentBus;
  private listeners: Record<string, ((payload:any)=>void)[]> = {};

  private constructor() {}
  static getInstance() {
    if (!OmniAgentBus.instance) OmniAgentBus.instance = new OmniAgentBus();
    return OmniAgentBus.instance;
  }

  publish(event:string, payload:any) {
    (this.listeners[event]||[]).forEach(cb=>cb(payload));
    console.log(`[OmniAgentBus] publish ${event}`, payload);
  }

  subscribe(event:string, cb:(payload:any)=>void) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(cb);
    return () => {
      this.listeners[event] = this.listeners[event].filter(fn=>fn!==cb);
    };
  }
}
EOF
fi

# 2. Insert Bus startup into start-orchestrator.sh if not already present
START_SCRIPT="C:/var/www/esggo/scripts/start-orchestrator.sh"
if ! grep -q "omni-agent-bus.ts" "$START_SCRIPT"; then
  echo "🔧 Adding OmniAgentBus background start to $START_SCRIPT"
  # Insert before the final echo line (line containing 'Orchestrator 已完成啟動')
  sed -i "/✅ Orchestrator 已完成啟動與復原/a \\
# Start OmniAgentBus in background\nhermes -p orchestrator exec \"node lib/agents/omni-agent-bus.ts\" &" "$START_SCRIPT"
fi

echo "✅ setup-omniagentbus 完成，請再次執行 bash scripts/start-orchestrator.sh"