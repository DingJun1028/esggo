import React, { useState } from 'react';
import { useOmniAgent } from '../hooks/useOmniAgent';

/**
 * OmniReasoningView Component
 * Visualizes the AI's Deep Reasoning process and content
 */
export const OmniReasoningView: React.FC = () => {
  const { executeTask, loading, error, result } = useOmniAgent();
  const [prompt, setPrompt] = useState('分析 ESG 數據誠信對企業長期估值的影響。');

  const handleExecute = async () => {
    await executeTask({
      id: `web-task-${Date.now()}`,
      taskType: 'reasoning_analysis',
      prompt: prompt,
      includeReasoning: true
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px' }}>
      <h2>🤖 OmniAgent Reasoning Console</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea 
          style={{ width: '100%', height: '80px', borderRadius: '8px', padding: '10px' }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button 
          onClick={handleExecute}
          disabled={loading}
          style={{ 
            marginTop: '10px', 
            padding: '10px 20px', 
            borderRadius: '6px', 
            background: '#0070f3', 
            color: 'white', 
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Reasoning...' : 'Summon Gemma 4'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>⚠️ Error: {error}</div>}

      {result && (
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3>✅ Analysis Result</h3>
          <div style={{ whiteSpace: 'pre-wrap' }}>{result.artifact.content}</div>
          
          {result.execution.reasoningLog && (
            <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
              <h4 style={{ color: '#666' }}>🧠 Chain of Thought (Reasoning Log)</h4>
              <div style={{ 
                fontSize: '0.9em', 
                color: '#444', 
                background: '#eee', 
                padding: '10px', 
                fontFamily: 'monospace' 
              }}>
                {result.execution.reasoningLog}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
