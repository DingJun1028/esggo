import React, { useState, useEffect, useRef, useCallback } from 'react';

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * 根據 MiniSearch 的匹配結果，渲染高亮文字的輔助元件
 * @param {string} text - 原始文本
 * @param {Object} matchTerms - MiniSearch 提供的 match 物件 (ex: { "term": ["title", "content"] })
 * @param {string} targetKey - 要高亮的特定 key (e.g., 'title', 'content')
 * @returns {JSX.Element}
 */
function Highlight({ text, matchTerms, targetKey }) {
    if (!matchTerms || !text) {
        return <span>{text}</span>;
    }

    // 找出在當前欄位 (targetKey) 中比對成功的詞彙
    const termsToHighlight = Object.keys(matchTerms).filter(term =>
        matchTerms[term].includes(targetKey)
    );

    if (termsToHighlight.length === 0) {
        return <span>{text}</span>;
    }

    // 將詞彙進行跳脫(Escape)，避免特殊字元破壞正規表達式
    const escapedTerms = termsToHighlight.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

    // 建立全域、不分大小寫的正規表達式 (使用 () 捕捉群組，讓 split 切割後能保留匹配的單字)
    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) => (
                // 若切出來的字串符合我們搜尋的單字 (不分大小寫)，就加上 highlight
                termsToHighlight.some(t => t.toLowerCase() === part.toLowerCase()) ? (
                    <mark key={i} style={{ backgroundColor: 'yellow', padding: '0 1px', borderRadius: '2px', color: 'black' }}>
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            ))}
        </>
    );
}

export function NoteSearch() {
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    // 新增狀態來管理搜尋選項
    const [rawKeyword, setRawKeyword] = useState('');
    const [matchMode, setMatchMode] = useState('fuzzy'); // 'fuzzy' | 'exact'
    const [searchField, setSearchField] = useState('all'); // 'all' | 'tags'
    const [offset, setOffset] = useState(0);
    const LIMIT = 50;

    const workerRef = useRef(null);

    useEffect(() => {
        workerRef.current = new Worker(
            new URL('./workers/searchWorker.js', import.meta.url),
            { type: 'module' }
        );

        workerRef.current.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'READY') {
                setIsReady(true);
                // 快取準備好後，發起一次空搜尋來渲染初始列表
                workerRef.current.postMessage({ type: 'SEARCH', payload: '' });
                workerRef.current.postMessage({ type: 'SEARCH', payload: { keyword: '', offset: 0, limit: LIMIT } });
            } else if (type === 'RESULT') {
                setResults(payload);
                if (payload.offset === 0) {
                    setResults(payload.results);
                } else {
                    setResults(prev => [...prev, ...payload.results]);
                }
                setHasMore(payload.hasMore);
                setIsSearching(false);
            } else if (type === 'ERROR') {
                console.error("Worker Error:", payload);
                setIsSearching(false);
            }
        };

        // 啟動時通知 Worker 將 IndexedDB 載入其記憶體中
        workerRef.current.postMessage({ type: 'INIT' });

        return () => workerRef.current.terminate();
    }, []);

    // 將發送訊息的功能獨立並防抖
    const triggerSearch = useCallback(
        debounce((query, searchOffset = 0) => {
            if (workerRef.current) {
                workerRef.current.postMessage({
                    type: 'SEARCH',
                    payload: { keyword: query, offset: searchOffset, limit: LIMIT }
                });
            }
        }, 300),
        []
    );

    // 將組合查詢字串的邏輯抽離，方便共用
    const getBuiltQuery = useCallback(() => {
        let query = rawKeyword.trim();
        if (query) {
            // 1. 檢查使用者是否已經手打 'tags:' 前綴
            let hasTagsPrefix = query.startsWith('tags:');
            if (searchField === 'tags' && !hasTagsPrefix) {
                query = `tags:${query}`;
                hasTagsPrefix = true;
            }

            // 2. 取出關鍵字主體，檢查是否已經被雙引號包裝
            const keywordPart = hasTagsPrefix ? query.slice(5).trim() : query;
            const hasQuotes = keywordPart.startsWith('"') && keywordPart.endsWith('"');
            if (matchMode === 'exact' && !hasQuotes) {
                query = hasTagsPrefix ? `tags:"${keywordPart}"` : `"${keywordPart}"`;
            }
        }
        return query;
    }, [rawKeyword, matchMode, searchField]);

    // 監聽狀態改變，自動組裝進階查詢字串並觸發全新搜尋
    useEffect(() => {
        if (!isReady) return;
        setOffset(0); // 條件改變時重置分頁
        setIsSearching(true);
        triggerSearch(getBuiltQuery(), 0);
    }, [rawKeyword, matchMode, searchField, isReady, triggerSearch, getBuiltQuery]);

    // 載入更多的處理函數
    const handleLoadMore = () => {
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
        setIsSearching(true);
        triggerSearch(getBuiltQuery(), nextOffset);
    };

    // 當筆記新增或修改時，將「單筆筆記資料」傳遞給 Worker 進行局部快取更新
    const handleNoteSaved = async (savedNote) => {
        // 實際專案中，這裡會是存入資料庫的操作
        // await db.notes.put(savedNote); 

        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'SYNC_CACHE', payload: savedNote });
        }
    };

    // 如果是刪除筆記，可以呼叫這個方法
    const handleNoteDeleted = async (noteId) => {
        // await db.notes.delete(noteId);
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'DELETE_CACHE', payload: noteId });
        }
    };

    return (
        <div>
            {/* 搜尋列與過濾器 UI 佈局 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder={isReady ? "搜尋筆記..." : "載入資料庫中..."}
                    disabled={!isReady}
                    value={rawKeyword}
                    onChange={(e) => setRawKeyword(e.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <select
                    value={matchMode}
                    onChange={(e) => setMatchMode(e.target.value)}
                    disabled={!isReady}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="fuzzy">模糊容錯</option>
                    <option value="exact">精確匹配</option>
                </select>
                <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    disabled={!isReady}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="all">全文檢索</option>
                    <option value="tags">僅限標籤 (Tags)</option>
                </select>
            </div>

            {isSearching && <span style={{ color: 'gray' }}> 搜尋中...</span>}

            <ul>
                {results.map(({ item: note, matchTerms, score }) => (
                    <li key={note.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                        <strong>
                            <Highlight text={note.title} matchTerms={matchTerms} targetKey="title" />
                        </strong>
                        <p style={{ fontSize: '0.9em', color: '#555', marginTop: '4px' }}>
                            <Highlight
                                text={note.content.substring(0, 200) + (note.content.length > 200 ? '...' : '')}
                                matchTerms={matchTerms}
                                targetKey="content"
                            />
                        </p>
                        {score && <small style={{ color: 'grey' }}>相關性分數: {score.toFixed(2)}</small>}
                    </li>
                ))}
            </ul>

            {hasMore && (
                <button
                    onClick={handleLoadMore}
                    disabled={isSearching}
                    style={{
                        display: 'block', width: '100%', padding: '10px',
                        marginTop: '10px', cursor: isSearching ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSearching ? '載入中...' : '載入更多'}
                </button>
            )}
        </div>
    );
}