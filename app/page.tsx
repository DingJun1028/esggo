import React from 'react';
import LandingContent from '@/components/LandingContent';
import UniversalNotesTracker from '@/lib/agent/UniversalNotesTracker';

export default async function LandingPage() {
  return <LandingContent trackerNode={<UniversalNotesTracker />} />;
}
