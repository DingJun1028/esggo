/**
 * ⚛️ Atomic Library Page - Universal Showcase
 * v1.0 | #OmniCore #AtomicLibrary
 */

import React from 'react';
import { AtomicLibraryProvider } from '@/lib/design-system/AtomicLibraryProvider';
import { AtomicLibraryShowcase } from '@/lib/design-system/AtomicLibraryShowcase';

export default function AtomicPage() {
  return (
    <AtomicLibraryProvider>
      <main className="min-h-screen">
        <AtomicLibraryShowcase />
      </main>
    </AtomicLibraryProvider>
  );
}
