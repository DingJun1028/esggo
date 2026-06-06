import Dexie from 'dexie';
import MiniSearch from 'minisearch';

// 初始化 IndexedDB
const db = new Dexie('OmniNotesDB');
db.version(1).stores({
    notes: 'id, title, *tags, updatedAt'
});

// 記憶體快取變數
let memoryCache = null;
let miniSearch = null; // MiniSearch instance

// 將資料從 IndexedDB 載入記憶體
async function initCache() {
    // 一次性將所有筆記載入 Worker 的記憶體中
    memoryCache = await db.notes.toArray();
    // 預先依據更新時間排序，方便後續直接取用
    memoryCache.sort((a, b) => b.updatedAt - a.updatedAt);

    // 初始化 MiniSearch 搜尋索引
    miniSearch = new MiniSearch({
        fields: ['title', 'tags', 'content'], // 建立索引的欄位
        storeFields: ['id'], // 索引中只儲存 id 以節省記憶體，後續再從 memoryCache 映射回來
        searchOptions: {
            boost: { title: 3, tags: 2, content: 1 }, // 權重設定
            fuzzy: 0.2, // 模糊容錯 (0.2 表示長度 5 的字允許 1 個錯字)
            prefix: true // 支援前綴搜尋 (打一半也能搜到)
        },
        // MiniSearch 內建提取欄位機制，我們可以在這裡安全地截斷內文和處理陣列
        extractField: (document, fieldName) => {
            if (fieldName === 'tags' && Array.isArray(document.tags)) {
                return document.tags.join(' ');
            }
            if (fieldName === 'content' && document.content) {
                return document.content.substring(0, 3000); // 在索引階段截斷過長文字以優化效能
            }
            return document[fieldName];
        }
    });

    // 將所有記憶體資料批次加入索引 (使用倒排索引，速度極快)
    miniSearch.addAll(memoryCache);
}

self.onmessage = async (e) => {
    const { type, payload } = e.data;

    try {
        if (type === 'INIT') {
            await initCache();
            self.postMessage({ type: 'READY' }); // 通知主執行緒快取已就緒
        }
        else if (type === 'SYNC_CACHE') {
            // 接收單筆新增或修改的筆記，直接做局部快取更新
            const updatedNote = payload;
            if (memoryCache && updatedNote) {
                const index = memoryCache.findIndex(n => n.id === updatedNote.id);
                if (index !== -1) {
                    memoryCache.splice(index, 1); // 移除舊版本的紀錄
                    miniSearch.discard(updatedNote.id); // 從倒排索引中快速移除舊版
                }
                // 因為是剛儲存的筆記，時間最新，直接插入到陣列最前面即可保持排序正確
                memoryCache.unshift(updatedNote);
                miniSearch.add(updatedNote); // 加入新版本到索引
            } else {
                // 容錯機制：若快取尚未建立，或沒有傳入單筆資料，則重新載入全部
                await initCache();
            }
        }
        else if (type === 'DELETE_CACHE') {
            // 補充：若刪除筆記，也同樣進行局部移除以保持快取同步
            const noteIdToDelete = payload;
            if (memoryCache && noteIdToDelete) {
                const index = memoryCache.findIndex(n => n.id === noteIdToDelete);
                if (index !== -1) {
                    memoryCache.splice(index, 1);
                    miniSearch.discard(noteIdToDelete); // 移除索引中的項目
                }
            }
        }
        else if (type === 'SEARCH') {
            // 防呆：若快取尚未建立，先建立快取
            if (!memoryCache) await initCache();
            if (!miniSearch) return; // 如果索引尚未建立，則不進行搜尋

            const keyword = payload.trim();
            let results = [];

            if (!keyword) {
                // 無關鍵字時，直接回傳前 50 筆最新筆記
                // 將結果包裝成與 Fuse.js 相同的格式以統一處理
                results = memoryCache.slice(0, 50).map(note => ({ item: note }));
            } else {
                // 解析進階搜尋語法
                let searchKeyword = keyword;
                const searchOpts = {}; // 動態搜尋選項，會覆蓋 initCache 時的預設值
                const negativeTerms = [];

                // 0. 提取排除關鍵字 (例如 -carbon)
                searchKeyword = searchKeyword.replace(/(?:^|\s)-([^\s]+)/g, (match, p1) => {
                    negativeTerms.push(p1.toLowerCase());
                    return ''; // 從搜尋字串中移除
                }).trim();

                // 1. 指定欄位搜尋 (例如 tags:esg)
                if (searchKeyword.startsWith('tags:')) {
                    searchOpts.fields = ['tags'];
                    searchKeyword = searchKeyword.slice(5).trim();
                }

                // 2. 精確匹配 (包裝在雙引號中，例如 "carbon footprint")
                if (searchKeyword.startsWith('"') && searchKeyword.endsWith('"')) {
                    searchOpts.fuzzy = false;       // 關閉模糊容錯
                    searchOpts.prefix = false;      // 關閉前綴比對
                    searchOpts.combineWith = 'AND'; // 強制多個單字時必須全部出現
                    searchKeyword = searchKeyword.slice(1, -1).trim();
                }

                if (!searchKeyword && negativeTerms.length > 0) {
                    // 防呆：如果拔除排除字後沒有任何正面關鍵字 (例如只輸入 "-carbon")
                    // 直接從完整快取中反向過濾，並回傳最新 50 筆
                    results = memoryCache.filter(note => {
                        return !negativeTerms.some(term =>
                            note.title.toLowerCase().includes(term) ||
                            note.content.toLowerCase().includes(term) ||
                            note.tags.some(tag => tag.toLowerCase().includes(term))
                        );
                    }).slice(0, 50).map(note => ({ item: note }));
                } else {
                    // 3. 套用排除過濾器 (交給 MiniSearch 處理)
                    if (negativeTerms.length > 0) {
                        searchOpts.filter = (result) => {
                            const note = memoryCache.find(n => n.id === result.id);
                            if (!note) return false;

                            // 檢查該筆記是否包含任何排除關鍵字，不包含 (!hasNegative) 才保留
                            return !negativeTerms.some(term =>
                                note.title.toLowerCase().includes(term) ||
                                note.content.toLowerCase().includes(term) ||
                                note.tags.some(tag => tag.toLowerCase().includes(term))
                            );
                        };
                    }

                    // 使用 MiniSearch 執行進階搜尋
                    const searchResults = miniSearch.search(searchKeyword, searchOpts);
                    // 取前 50 筆，並利用 ID 對應回 memoryCache 的完整筆記內容
                    results = searchResults.slice(0, 50).map(res => ({
                        score: res.score,
                        matchTerms: res.match, // MiniSearch 提供的比對單字資訊，供高亮使用
                        item: memoryCache.find(n => n.id === res.id) || res
                    }));
                }
            }
            self.postMessage({ type: 'RESULT', payload: results });
        }
    } catch (error) {
        self.postMessage({ type: 'ERROR', payload: error.message });
    }
};