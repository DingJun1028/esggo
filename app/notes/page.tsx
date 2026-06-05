'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const NoteSearch = dynamic(() => import('../../NoteSearch').then(mod => mod.NoteSearch), {
  ssr: false,
  loading: () => <div style={{ padding: '24px', color: '#9ca3af' }}>載入搜尋元件中...</div>
});

export default function NotesPage() {
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>筆記搜尋</h1>
      <NoteSearch />
    </div>
  );
}