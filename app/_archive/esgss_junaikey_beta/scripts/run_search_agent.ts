import { SearchWorkflow } from '../src/adk/workflows/SearchWorkflow';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function runCli() {
    console.log('\n==================================================');
    console.log('🤖 ADK 搜尋工作流 - CLI 深度研究模式 (深貫廣通)');
    console.log('==================================================');
    console.log('輸入您的研究課題，或輸入 "exit" 退出。\n');

    const askQuestion = () => {
        rl.question('👤 研究課題: ', async (input) => {
            if (input.toLowerCase() === 'exit') {
                console.log('\n再見！ 👋\n');
                rl.close();
                process.exit(0);
                return;
            }

            console.log('\n🚀 啟動深貫廣通工作流...\n');

            try {
                const workflow = new SearchWorkflow(input);

                // 為了 CLI 體驗，我們可以手動監控進度（如果需要）
                // 這裡我們直接執行並獲取最終結果
                const result = await workflow.execute();

                console.log('\n' + '='.repeat(50));
                console.log('📝 研究摘要 (深貫廣通)');
                console.log('='.repeat(50));
                console.log(result.text);
                console.log('\n📚 引用來源:');
                result.sources.forEach((s: any, i: number) => {
                    console.log(`[${i + 1}] ${s.title} (${s.source})`);
                });
                console.log('='.repeat(50) + '\n');

            } catch (error) {
                console.error('❌ 工作流執行出錯:', error);
            }

            askQuestion();
        });
    };

    askQuestion();
}

runCli();
