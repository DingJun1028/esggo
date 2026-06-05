async function main() {
    console.log('--- 啟動萬能元件：萬能書櫃 文件管理中心重構 ---');

    // 1. 確保 Wiki 目錄結構存在
    for (const categoryCode in MECE_CATEGORIES) {
        if (Object.prototype.hasOwnProperty.call(MECE_CATEGORIES, categoryCode)) {
            ensureDirExists(resolve(WIKI_DIR, categoryCode));
        }
    }
    console.log('Wiki 目錄結構已初始化。');

    // 2. 掃描所有 Markdown 文件
    // 過濾掉 node_modules 和 .git 等目錄
    const allMarkdownFiles = globSync('**/*.md', {
        cwd: projectRoot,
        ignore: ['node_modules/**', '.git/**', '.vscode/**', '.next/**', '.agents/**', 'dist/**', 'build/**'],
    });

    console.log(`掃描到 ${allMarkdownFiles.length} 份 Markdown 文件 (已排除部分目錄)。`);

    const categorizedFiles = new Map(); // Map<categoryCode, Array<{id, name, path}>>
    let devFileCounter = 0; // 用於 02-DEV 的編號

    for (const relativePath of allMarkdownFiles) {
        const fullPath = resolve(projectRoot, relativePath);
        let content = readFileContent(fullPath);
        let metadata = {};
        let originalFileName = relativePath.split('/').pop().replace(/\.md$/, '');
        let meceCategory = classifyFile(relativePath);
        let meceId = '';

        // 如果文件已經在 docs/wiki/ 下的 MECE 目錄中，則從路徑中提取分類和編號
        const wikiMatch = relativePath.match(/docs\/wiki\/(0[0-5]-\w+)\/(0[0-5]-\w+-\d+-.+)\.md$/);
        if (wikiMatch) {
            meceCategory = wikiMatch[1];
            meceId = wikiMatch[2];
            originalFileName = meceId.split('-').slice(2).join('-'); // 從編號中提取名稱
        } else {
            // 如果不在 MECE 目錄下，則進行自動分類並生成編號
            switch (meceCategory) {
                case '00-SYS':
                case '01-GOV':
                case '03-PRO':
                case '04-OPS':
                case '05-ARC':
                    meceId = `${meceCategory}-待編號-${originalFileName}`;
                    break;
                case '02-DEV':
                    devFileCounter++;
                    meceId = `${meceCategory}-${String(devFileCounter).padStart(3, '0')}-${originalFileName}`;
                    break;
                default:
                    meceId = `待分類-${originalFileName}`;
                    break;
            }
        }

        // 檢查是否是長篇文章，並進行分章處理
        // 判斷為長篇文章的簡易標準：至少有兩個頂級或次頂級標題
        const headings = (content.match(/^(#\s.+|##\s.+)/gm) || []).length;
        if (headings >= 2 && !relativePath.includes(originalFileName + '/')) { // 避免重複處理已分章的文件
            console.log(`正在分章處理長篇文章: ${relativePath}`);
            const chapters = splitArticleIntoChapters(content, relativePath, originalFileName, meceCategory);
            chapters.forEach(chapter => {
                if (!categorizedFiles.has(meceCategory)) {
                    categorizedFiles.set(meceCategory, []);
                }
                categorizedFiles.get(meceCategory).push(chapter);
            });
            // 跳過對原始文件的處理，因為它已經被分拆成多個章節
            continue; // 跳過對原始長文件的後續處理
        }

        // 確保文件開頭有 IComponentCore 元數據
        if (!hasIComponentCoreMetadata(content)) {
            metadata = generateIComponentCoreMetadata(relativePath);
            content = formatMetadataAsFrontMatter(metadata) + content;
            writeToFile(fullPath, content); // 寫回文件
            console.log(`已為 ${relativePath} 添加 IComponentCore 元數據。`);
        } else {
            // 如果已有元數據，則讀取它，這裡簡化處理，實際可能需要解析 YAML
            const frontMatterEndIndex = content.indexOf('---\n', 4); // 查找第二個 ---
            if (frontMatterEndIndex !== -1) {
                const frontMatterContent = content.substring(0, frontMatterEndIndex + 4);
                // 這裡可以解析 frontMatterContent 提取現有元數據，然後更新
            }
        }

        // 記錄分類文件
        if (!categorizedFiles.has(meceCategory)) {
            categorizedFiles.set(meceCategory, []);
        }
        categorizedFiles.get(meceCategory).push({
            id: meceId,
            name: originalFileName,
            path: relativePath,
        });

        // 遷移文件到 docs/wiki/[Category] (如果不在正確位置)
        const targetDir = resolve(WIKI_DIR, meceCategory);
        const targetPath = resolve(targetDir, `${meceId}.md`);
        
        if (relativePath !== targetPath.replace(projectRoot + '/', '')) {
            ensureDirExists(targetDir);
            // writeToFile(targetPath, content); 
            // console.log(`建議將 ${relativePath} 遷移到 ${targetPath}`);
        }
    }

    // 3. 生成並寫入 WIKI_INDEX.md
    const indexContent = generateWikiIndex(categorizedFiles);
    writeToFile(WIKI_INDEX_FILE, indexContent);
    console.log(`文件管理中心總索引已生成於 ${WIKI_INDEX_FILE}`);

    console.log('\n--- 萬能元件：萬能書櫃 文件管理中心重構完成報告 ---');
    console.log('為確保數據一致性，以下是建議的後續手動操作：');
    console.log('1. 請審閱生成的 WIKI_INDEX.md 索引文件，確認分類和編號是否符合預期。');
    console.log('2. 根據每個文件的 MECE 分類，將文件手動移動到 `docs/wiki/[Category]/` 對應的目錄。');
    console.log('3. 對於 DOCX 轉換功能，可能需要進一步擴展 `documentConverters.ts` 以支援更複雜的 HTML 到 Word 轉換。');
    console.log('4. 對於分類邏輯 (`classifyFile` 函數)，可以根據實際需求進一步細化。');
}

main();