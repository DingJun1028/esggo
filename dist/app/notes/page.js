'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import dynamic from 'next/dynamic';
const NoteSearch = dynamic(() => import('../../NoteSearch').then(mod => mod.NoteSearch), {
    ssr: false,
    loading: () => _jsx("div", { style: { padding: '24px', color: '#9ca3af' }, children: "\u8F09\u5165\u641C\u5C0B\u5143\u4EF6\u4E2D..." })
});
export default function NotesPage() {
    return (_jsxs("div", { style: { padding: '24px', maxWidth: '800px', margin: '0 auto' }, children: [_jsx("h1", { style: { fontSize: '24px', fontWeight: 800, marginBottom: '24px' }, children: "\u7B46\u8A18\u641C\u5C0B" }), _jsx(NoteSearch, {})] }));
}
//# sourceMappingURL=page.js.map