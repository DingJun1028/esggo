'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniInput } from '@/components/ui/omni/OmniInput';
import { Search, Loader2 } from 'lucide-react';

function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>): void => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

interface MatchTerms {
    [key: string]: string[];
}

interface HighlightProps {
    text: string;
    matchTerms?: MatchTerms;
    targetKey: string;
}

function Highlight({ text, matchTerms, targetKey }: HighlightProps) {
    if (!matchTerms || !text) {
        return <span>{text}</span>;
    }

    const termsToHighlight = Object.keys(matchTerms).filter(term =>
        matchTerms[term].includes(targetKey)
    );

    if (termsToHighlight.length === 0) {
        return <span>{text}</span>;
    }

    const escapedTerms = termsToHighlight.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) => (
                termsToHighlight.some(t => t.toLowerCase() === part.toLowerCase()) ? (
                    <mark key={i} className="bg-yellow-400 text-black px-1 rounded-sm">
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
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const [rawKeyword, setRawKeyword] = useState('');
    const [matchMode, setMatchMode] = useState('fuzzy'); 
    const [searchField, setSearchField] = useState('all'); 
    const [offset, setOffset] = useState(0);
    const LIMIT = 50;

    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        workerRef.current = new Worker(
            new URL('./workers/searchWorker.js', import.meta.url),
            { type: 'module' }
        );

        workerRef.current.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'READY') {
                setIsReady(true);
                workerRef.current?.postMessage({ type: 'SEARCH', payload: '' });
                workerRef.current?.postMessage({ type: 'SEARCH', payload: { keyword: '', offset: 0, limit: LIMIT } });
            } else if (type === 'RESULT') {
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

        workerRef.current.postMessage({ type: 'INIT' });

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const triggerSearch = useCallback(
        debounce((query: string, searchOffset: number = 0) => {
            if (workerRef.current) {
                workerRef.current.postMessage({
                    type: 'SEARCH',
                    payload: { keyword: query, offset: searchOffset, limit: LIMIT }
                });
            }
        }, 300),
        []
    );

    const getBuiltQuery = useCallback(() => {
        let query = rawKeyword.trim();
        if (query) {
            let hasTagsPrefix = query.startsWith('tags:');
            if (searchField === 'tags' && !hasTagsPrefix) {
                query = `tags:${query}`;
                hasTagsPrefix = true;
            }

            const keywordPart = hasTagsPrefix ? query.slice(5).trim() : query;
            const hasQuotes = keywordPart.startsWith('"') && keywordPart.endsWith('"');
            if (matchMode === 'exact' && !hasQuotes) {
                query = hasTagsPrefix ? `tags:"${keywordPart}"` : `"${keywordPart}"`;
            }
        }
        return query;
    }, [rawKeyword, matchMode, searchField]);

    useEffect(() => {
        if (!isReady) return;
        setOffset(0);
        setIsSearching(true);
        triggerSearch(getBuiltQuery(), 0);
    }, [rawKeyword, matchMode, searchField, isReady, triggerSearch, getBuiltQuery]);

    const handleLoadMore = () => {
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
        setIsSearching(true);
        triggerSearch(getBuiltQuery(), nextOffset);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-slate-900 rounded-lg shadow-xl border border-slate-800">
            <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <OmniInput
                        type="text"
                        placeholder={isReady ? "Search records via Omni-Index..." : "Initializing 5T Integrity Protocols..."}
                        disabled={!isReady}
                        value={rawKeyword}
                        onChange={(e) => setRawKeyword(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={matchMode}
                    onChange={(e) => setMatchMode(e.target.value)}
                    disabled={!isReady}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    <option value="fuzzy">Fuzzy Match</option>
                    <option value="exact">Exact Match</option>
                </select>
                <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    disabled={!isReady}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-md outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    <option value="all">Full Text</option>
                    <option value="tags">Tags Only</option>
                </select>
            </div>

            {isSearching && (
                <div className="flex items-center gap-2 text-cyan-400 mb-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Querying Vault Omni...</span>
                </div>
            )}

            <ul className="space-y-4">
                {results.map(({ item: note, matchTerms, score }) => (
                    <li key={note.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 transition-all hover:border-cyan-500/30">
                        <strong className="text-lg text-slate-200 block mb-2">
                            <Highlight text={note.title} matchTerms={matchTerms} targetKey="title" />
                        </strong>
                        <p className="text-sm text-slate-400">
                            <Highlight
                                text={note.content.substring(0, 200) + (note.content.length > 200 ? '...' : '')}
                                matchTerms={matchTerms}
                                targetKey="content"
                            />
                        </p>
                        {score && (
                            <div className="mt-3 text-xs font-mono text-cyan-600">
                                5T Relevance Score: {score.toFixed(2)}
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {hasMore && (
                <OmniButton
                    onClick={handleLoadMore}
                    disabled={isSearching}
                    className="w-full mt-6"
                    variant="outline"
                >
                    {isSearching ? 'Loading...' : 'Load More Context'}
                </OmniButton>
            )}
        </div>
    );
}
