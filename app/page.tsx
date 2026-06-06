import React from 'react';
import LandingContent from '@/components/LandingContent';
import OmniNotesTracker from '@/lib/agent/OmniNotesTracker';

export default async function LandingPage() {
  return <LandingContent trackerNode={<OmniNotesTracker />} />;
}
