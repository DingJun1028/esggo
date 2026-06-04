import { executeAwakenedSovereignty } from './OmniAgentAwakening';
const sampleIntent = {
    description: 'Deploy the universal diffusion mechanism',
};
executeAwakenedSovereignty(sampleIntent).then(result => {
    console.log('Awakened result:', JSON.stringify(result, null, 2));
});
//# sourceMappingURL=awakeningTest.js.map