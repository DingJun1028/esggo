import { useState, useEffect } from 'react';

// Types
interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  updated: boolean;
}

interface LogEntry {
  id: string;
  itemId: string;
  itemName: string;
  change: number;
  type: 'in' | 'out';
  timestamp: Date;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-1001', name: 'Quantum Processors', quantity: 145, threshold: 50, updated: false },
  { id: 'INV-1002', name: 'Neural Engine Chips', quantity: 32, threshold: 40, updated: false },
  { id: 'INV-1003', name: 'Optical Sensors V4', quantity: 890, threshold: 200, updated: false },
  { id: 'INV-1004', name: 'Holographic Displays', quantity: 12, threshold: 15, updated: false },
  { id: 'INV-1005', name: 'Titanium Casings', quantity: 450, threshold: 100, updated: false },
  { id: 'INV-1006', name: 'Lithium-ion Cells', quantity: 2300, threshold: 500, updated: false },
];

function App() {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [activityLog, setActivityLog] = useState<LogEntry[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random item to update
      const randomIndex = Math.floor(Math.random() * inventory.length);
      const itemToUpdate = inventory[randomIndex];
      
      // Determine change type and amount (more likely to be an outgoing order)
      const isOutgoing = Math.random() > 0.3;
      // If outgoing, reduce by 1-5 units. If incoming, add 10-50 units
      const changeAmount = isOutgoing 
        ? Math.floor(Math.random() * 5) + 1 
        : Math.floor(Math.random() * 40) + 10;
        
      // Don't drop below 0
      if (isOutgoing && itemToUpdate.quantity - changeAmount < 0) return;
      
      const newQuantity = isOutgoing 
        ? itemToUpdate.quantity - changeAmount 
        : itemToUpdate.quantity + changeAmount;
        
      // Update inventory state
      setInventory(prev => prev.map((item, index) => {
        if (index === randomIndex) {
          return { ...item, quantity: newQuantity, updated: true };
        }
        return { ...item, updated: false };
      }));
      
      // Clear the "updated" animation flag after 1s
      setTimeout(() => {
        setInventory(prev => prev.map(item => 
          item.id === itemToUpdate.id ? { ...item, updated: false } : item
        ));
      }, 1000);
      
      // Add to activity log
      const newLogEntry: LogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        itemId: itemToUpdate.id,
        itemName: itemToUpdate.name,
        change: changeAmount,
        type: isOutgoing ? 'out' : 'in',
        timestamp: new Date()
      };
      
      setActivityLog(prev => [newLogEntry, ...prev].slice(0, 8)); // Keep last 8
      
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, [inventory]);

  const getStatusClass = (quantity: number, threshold: number) => {
    if (quantity <= threshold * 0.5) return 'status-critical';
    if (quantity <= threshold) return 'status-low';
    return 'status-optimal';
  };
  
  const getStatusText = (quantity: number, threshold: number) => {
    if (quantity <= threshold * 0.5) return 'Critical';
    if (quantity <= threshold) return 'Low Stock';
    return 'Optimal';
  };

  return (
    <div>
      <header>
        <h1>Nexus Inventory</h1>
        <p className="subtitle">Real-time Global Tracking System</p>
      </header>

      <div className="dashboard">
        <main className="glass-panel">
          <div className="inventory-grid">
            {inventory.map(item => {
              const statusClass = getStatusClass(item.quantity, item.threshold);
              
              return (
                <div key={item.id} className="item-card">
                  <div className="item-header">
                    <span className="item-name">{item.name}</span>
                    <span className="item-id">{item.id}</span>
                  </div>
                  
                  <div className="stock-info">
                    <span className={`stock-value ${item.updated ? 'updated' : ''}`}>
                      {item.quantity}
                    </span>
                    <span className="stock-label">Units</span>
                  </div>
                  
                  <span className={`status-badge ${statusClass}`}>
                    {getStatusText(item.quantity, item.threshold)}
                  </span>
                </div>
              );
            })}
          </div>
        </main>
        
        <aside className="glass-panel">
          <h3>Live Activity</h3>
          <div className="activity-feed">
            {activityLog.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Waiting for updates...</p>
            ) : (
              activityLog.map(log => (
                <div key={log.id} className="feed-item">
                  <div className={`feed-icon ${log.type === 'in' ? 'icon-in' : 'icon-out'}`}>
                    {log.type === 'in' ? '↓' : '↑'}
                  </div>
                  <div className="feed-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ color: log.type === 'in' ? 'var(--success-color)' : 'var(--text-primary)' }}>
                        {log.type === 'in' ? '+' : '-'}{log.change} {log.itemName}
                      </strong>
                    </div>
                    <span className="feed-time">
                      {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
