
import { exemplarReportService } from '../src/services/ExemplarReportService';
import chalk from 'chalk';

async function generateSample() {
    console.log(chalk.cyan('💎 Generating Exemplar Sustainability Report Sample...'));
    console.log(chalk.gray('--------------------------------------------------'));

    try {
        const report = await exemplarReportService.generateExemplarReport(2025);

        console.log(chalk.yellow(`Report ID: ${report.id}`));
        console.log(chalk.white(`Title: ${report.title}`));
        console.log(chalk.green(`Total Pages (Simulated): ${report.totalPageCount}`));
        console.log(chalk.magenta(`Global Resonance (Aura): ${report.globalResonance.toFixed(4)}`));
        console.log(chalk.gray(`Protocol Sealed: ${report.protocolSealed}`));
        console.log(chalk.gray(`Generated At: ${report.generatedAt}`));

        console.log(chalk.cyan('\n📚 Volumes:'));
        report.volumes.forEach((vol, idx) => {
            console.log(chalk.white(`\n[Volume ${idx + 1}] ${vol.title}`));
            console.log(chalk.gray(`   - Pages: ${vol.pageCount}`));
            console.log(chalk.gray(`   - Data Points: ${vol.dataPoints.length}`));
            console.log(chalk.blue(`   - Narrative: ${vol.narrativeSummary.substring(0, 80)}...`));
            if (vol.auraSnapshot) {
                console.log(chalk.magenta(`   - Aura Snapshot: ${JSON.stringify(vol.auraSnapshot)}`));
            }
        });

        // Simulate Infinite Polish
        console.log(chalk.cyan('\n✨ Initiating Infinite Polish Simulation...'));
        const refinementScore = await exemplarReportService.simulateInfinitePolish(report.id);
        console.log(chalk.green(`   ✅ Refinement Score: ${refinementScore.toFixed(4)}`));

        console.log(chalk.cyan('\n--------------------------------------------------'));
        console.log(chalk.green('✅ Exemplar Report Generation Complete.'));
        process.exit(0);

    } catch (error) {
        console.error(chalk.red('❌ Generation Failed:'), error);
        process.exit(1);
    }
}

generateSample();
