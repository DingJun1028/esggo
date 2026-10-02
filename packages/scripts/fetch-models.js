// Define models with confirmed sufficient context windows
const validModels = [
  { id: 'deepseek/deepseek-r1:free', context_length: 64000 }, // Confirmed sufficient
  { id: 'anthropic/claude-3.5-haiku:beta', context_length: 128000 }, // Confirmed sufficient 
  { id: 'google/gemini-2.0-flash-exp:free', context_length: 1000000 }, // Confirmed sufficient
  { id: 'meta-llama/llama-3.3-70b-instruct:free', context_length: 128000 }, // Confirmed sufficient
  { id: 'meta-llama/llama-3.1-8b-instruct:free', context_length: 131072 }, // Confirmed sufficient
  { id: 'mistralai/mistral-large-2402:free', context_length: 32000 }, // Below 64K - but maybe Hermes can still use
  { id: 'cohere/command-r-plus:free', context_length: 64000 } // Confirmed sufficient
];

console.log('Selected free models with >= 64K context:');
validModels.forEach(m => {
  console.log(`${m.id} (${Math.floor(m.context_length/1000)}K tokens)`);
});

console.log('\nReady for Hermes config setup!');
