document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const complianceResultsDiv = document.getElementById('compliance-results');
  const logsContainer = document.getElementById('logs-container');
  const runComplianceBtn = document.getElementById('run-compliance');
  
  // Update UI with real-time status from server
  socket.on('service-executed', (data) => {
    addLogEntry(data.service, data.action, data.result, data.compliance);
  });
  
  // Run compliance check when button clicked
  runComplianceBtn.addEventListener('click', async () => {
    // Mock ESG data for demonstration
    const mockPayload = {
      environmental: {
        co2: 8.5, // tons
        water: 3.2, // million liters
        waste: 1.5 // kilotons
      },
      social: {
        laborRights: true,
        humanRights: true,
        communityEngagement: "Active community programs"
      },
      governance: {
        boardDiversity: ["Female", "Minority", "International", "Young Professional"],
        capitalSpending: 2500000, // $2.5M
        ethics: "Comprehensive code of conduct"
      }
    };
    
    try {
      // Call MCP service to run compliance
      socket.emit('call-mcp', {
        service: 'compliance',
        action: 'runAll',
        payload: mockPayload
      });
    } catch (error) {
      complianceResultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
  });
  
  function addLogEntry(service, action, result, compliance) {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry success';
    
    const timestamp = new Date().toLocaleTimeString();
    logEntry.innerHTML = `
      <span>[${timestamp}] ${service}.${action}</span>
      <span>${result ? 'SUCCESS' : 'FAILED'}</span>
    `;
    
    logsContainer.prepend(logEntry);
    
    // Keep only last 20 entries
    while (logsContainer.children.length > 20) {
      logsContainer.removeChild(logsContainer.lastChild);
    }
  }
  
  // Initial load - fetch some sample data
  socket.emit('call-mcp', {
    service: 'firebase',
    action: 'getStats',
    payload: {}
  });
  
  socket.emit('call-mcp', {
    service: 'supabase',
    action: 'getTable',
    payload: { table: 'esg_metrics' }
  });
});