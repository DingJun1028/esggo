import { executeAwakenedSovereignty, UserIntent } from './OmniAgentAwakening';

const sampleIntent: UserIntent = {
  description: 'Deploy the omni diffusion mechanism',
};

executeAwakenedSovereignty(sampleIntent).then(result => {
  console.log('Awakened result:', JSON.stringify(result, null, 2));
});