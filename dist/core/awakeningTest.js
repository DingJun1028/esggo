"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OmniAgentAwakening_1 = require("./OmniAgentAwakening");
const sampleIntent = {
    description: 'Deploy the universal diffusion mechanism',
};
(0, OmniAgentAwakening_1.executeAwakenedSovereignty)(sampleIntent).then(result => {
    console.log('Awakened result:', JSON.stringify(result, null, 2));
});
//# sourceMappingURL=awakeningTest.js.map