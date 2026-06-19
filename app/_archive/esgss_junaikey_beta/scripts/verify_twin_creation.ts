
import { digitalTwinService } from '../server/services/DigitalTwinService';
import { IPersonalTwin, ICorporateTwin } from '../src/types/twin/index';

async function verifyTwinCreation() {
    console.log('🔍 Starting Digital Twin 5T Verification...');

    try {
        // 1. Verify Personal Twin Creation
        console.log('\n👤 Minting Personal Twin...');
        const personalTwin = await digitalTwinService.mintPersonalTwin({
            userId: 'user-test-01',
            displayName: 'Neo Generator',
            description: 'The One who brings balance.',
            avatarProfile: {
                avatarName: 'Echo',
                archetype: 'Seeker'
            } as any
        });

        console.log(`   > UUID: ${personalTwin.uuid}`);
        console.log(`   > Hash Lock: ${personalTwin.evidence?.trustworthy?.hash_lock}`);

        if (personalTwin.uuid && personalTwin.evidence?.trustworthy?.hash_lock && personalTwin.evidence?.trustworthy?.is_frozen) {
            console.log('✅ Personal Twin 5T Verification: PASSED');
        } else {
            console.error('❌ Personal Twin 5T Verification: FAILED (Missing 5T attributes)');
            process.exit(1);
        }

        // 2. Verify Corporate Twin Creation
        console.log('\n🏢 Minting Corporate Twin...');
        const corporateTwin = await digitalTwinService.mintCorporateTwin({
            companyId: 'comp-test-99',
            displayName: 'Cyberdyne Systems',
            description: 'AI and Robotics manufacturing.',
            taxId: 'TAX-001',
            industry: 'Technology'
        });

        console.log(`   > UUID: ${corporateTwin.uuid}`);
        console.log(`   > Hash Lock: ${corporateTwin.evidence?.trustworthy?.hash_lock}`);
        console.log(`   > ESG Rating: ${corporateTwin.esgStatus?.rating || 'N/A'}`);

        if (corporateTwin.uuid && corporateTwin.evidence?.trustworthy?.hash_lock && corporateTwin.evidence?.trustworthy?.is_frozen) {
            console.log('✅ Corporate Twin 5T Verification: PASSED');
        } else {
            console.error('❌ Corporate Twin 5T Verification: FAILED (Missing 5T attributes)');
            process.exit(1);
        }

        console.log('\n✨ All Digital Twin Systems Verified Successfully.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Error:', error);
        process.exit(1);
    }
}

verifyTwinCreation();
