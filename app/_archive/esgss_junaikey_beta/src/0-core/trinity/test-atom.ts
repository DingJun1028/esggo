
import { OmniAtom } from '../../0-domain/bases/OmniAtom';

class TestAtom extends OmniAtom {
    async sync() { console.log('Syncing'); }
}

async function test() {
    console.log('--- OmniAtom Test ---');
    try {
        const atom = new TestAtom({} as any, {} as any, {} as any);
        console.log('Atom instance created');
    } catch (e) {
        console.error('Atom failure:', e);
    }
}
test();
