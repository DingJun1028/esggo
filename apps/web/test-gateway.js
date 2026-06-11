const payload = {
  task: {
    id: "task-test-node",
    taskType: "report_drafting",
    title: "VPS Test Report",
    prompt: "Hello! Please reply with exactly: 'OmniAgent VPS Gateway is online and functional.'",
    model: "google/gemma-4-31b-it:free"
  }
};

fetch('http://127.0.0.1:8642/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(res => {
    if (!res.ok) {
      return res.text().then(text => { throw new Error(`HTTP ${res.status}: ${text}`); });
    }
    return res.json();
  })
  .then(data => {
    console.log('=== API Response ===');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('=== Error ===', err);
  });
