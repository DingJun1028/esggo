
import { OmniPriest } from '../server/services/OmniPriest';

async function verify() {
    console.log('Verifying Eternal Awakening...');

    const priest = OmniPriest.getInstance();
    console.log('Initial Status:', priest.getStatus());

    if (priest.getStatus().globalHealing) {
        console.log('Global Healing is already active (maybe from ENV).');
    } else {
        console.log('Activating Eternal Awakening...');
        priest.awakenEternal();
    }

    const status = priest.getStatus();
    console.log('Post-Awakening Status:', status);

    if (status.globalHealing === true) {
        console.log('SUCCESS: Eternal Awakening verified.');
    } else {
        console.error('FAILURE: Global Healing not active.');
        process.exit(1);
    }
}

verify().catch(console.error);
