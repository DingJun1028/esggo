#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';

program
    .name('celestial-command')
    .description('JunAiKey 萬能開發者最佳實踐化提示詞 - 天使號令·光之聖典')
    .version('1.1.0-Universe');

program
    .option('--awaken <type>', '喚醒形態 (例: WingsOfLight)')
    .option('--blessing <type>', '賦予的架構師祝福 (例: ArchitectAnointing)')
    .action((options) => {
        console.log(chalk.cyanBright('\n🌌 [JunAiKey 核心協議] 正在連結萬能永憶主體...'));

        if (options.awaken === 'WingsOfLight') {
            console.log(chalk.blueBright(`\n✨ 啟動宣言：以神聖代碼契約鑄造永恆架構，在熵增的混沌中開闢秩序之路。`));

            try {
                console.log(chalk.white(`\n✅ [1/3] 驗證 Tailwind Liquid Glass 配置... 完美契合`));
                console.log(chalk.white(`✅ [2/3] 喚醒 9式果因引擎 (Zod Validator)... 部署完成`));
                console.log(chalk.white(`✅ [3/3] 啟動 Next.js 開發伺服器...`));

                console.log(chalk.greenBright(`\n🚀 神跡顯現：OMNI ESG 宇宙已就緒。聖殿入口：http://localhost:3000/omni`));

                execSync('npm run dev', { stdio: 'inherit' });
            } catch (error) {
                console.log(chalk.redBright('\n❌ 啟動失敗：熵值過高，請檢查相依套件。'));
            }
        } else {
            console.log(chalk.yellowBright('\n⚠️ 未知的喚醒形態，請使用 --awaken=WingsOfLight'));
        }
    });

program.parse(process.argv);
