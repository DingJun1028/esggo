import Dexie from 'dexie';
import MiniSearch from 'minisearch';

const db = new Dexie('OmniNotesDB');
db.version(1).stores({
    notes: 'id, title, *tags, updatedAt'
});

let memoryCache = null;
let miniSearch = null;

async function fetchNotesFromAPI() {
    try {
        const response = await fetch('/api/notes');
        if (response.ok) {
            const data = await response.json();
            return data.notes || [];
        }
    } catch (e) {
        console.warn('API fetch failed, falling back to IndexedDB:', e);
    }
    return [];
}

async function initCache(forceAPI = false) {
    if (forceAPI) {
        memoryCache = await fetchNotesFromAPI();
    } else {
        try {
            memoryCache = await db.notes.toArray();
            if (memoryCache.length === 0) {
                memoryCache = await fetchNotesFromAPI();
            }
        } catch {
            memoryCache = await fetchNotesFromAPI();
        }
    }
    
    memoryCache.sort((a, b) => b.updatedAt - a.updatedAt);

    miniSearch = new MiniSearch({
        fields: ['title', 'tags', 'content'],
        storeFields: ['id'],
        searchOptions: {
            boost: { title: 3, tags: 2, content: 1 },
            fuzzy: 0.2,
            prefix: true
        },
        extractField: (document, fieldName) => {
            if (fieldName === 'tags' && Array.isArray(document.tags)) {
                return document.tags.join(' ');
            }
            if (fieldName === 'content' && document.content) {
                return document.content.substring(0, 3000);
            }
            return document[fieldName];
        }
    });

    miniSearch.addAll(memoryCache);
}

self.onmessage = async (e) => {
    const { type, payload } = e.data;

    try {
        if (type === 'INIT') {
            await initCache();
            self.postMessage({ type: 'READY' });
        }
        else if (type === 'SYNC_CACHE') {
            const updatedNote = payload;
            if (memoryCache && updatedNote) {
                const index = memoryCache.findIndex(n => n.id === updatedNote.id);
                if (index !== -1) {
                    memoryCache.splice(index, 1);
                    miniSearch.discard(updatedNote.id);
                }
                memoryCache.unshift(updatedNote);
                miniSearch.add(updatedNote);
            } else {
                await initCache(true);
            }
        }
        else if (type === 'DELETE_CACHE') {
            const noteIdToDelete = payload;
            if (memoryCache && noteIdToDelete) {
                const index = memoryCache.findIndex(n => n.id === noteIdToDelete);
                if (index !== -1) {
                    memoryCache.splice(index, 1);
                    miniSearch.discard(noteIdToDelete);
                }
            }
        }
        else if (type === 'SEARCH') {
            if (!memoryCache) await initCache();
            if (!miniSearch) return;

            const keyword = payload.trim();
            let results = [];

            if (!keyword) {
                results = memoryCache.slice(0, 50).map(note => ({ item: note, matches: [] }));
            } else {
                const searchResults = miniSearch.search(keyword);
                results = searchResults.slice(0, 50).map(res => {
                    const note = memoryCache.find(n => n.id === res.id);
                    const matches = note ? generateMatches(note, keyword) : [];
                    return {
                        score: res.score,
                        matchTerms: res.match,
                        item: note || res,
                        matches
                    };
                });
            }
            self.postMessage({ type: 'RESULT', payload: results });
        }
    } catch (error) {
        self.postMessage({ type: 'ERROR', payload: error.message });
    }
};

function generateMatches(note, keyword) {
    const matches = [];
    if (note.title && note.title.toLowerCase().includes(keyword.toLowerCase())) {
        const idx = note.title.toLowerCase().indexOf(keyword.toLowerCase());
        matches.push({
            key: 'title',
            value: note.title,
            indices: [[idx, idx + keyword.length - 1]]
        });
    }
    if (note.content && note.content.toLowerCase().includes(keyword.toLowerCase())) {
        const idx = note.content.toLowerCase().indexOf(keyword.toLowerCase());
        matches.push({
            key: 'content',
            value: note.content,
            indices: [[idx, idx + keyword.length - 1]]
        });
    }
    return matches;
}