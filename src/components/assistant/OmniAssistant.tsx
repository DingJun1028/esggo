'use client';

import { OmniAssistant as OmniAssistantOrb } from './OmniAssistantOrb';
import type { OmniAssistantProps } from '@/types/omni-assistant';

export function OmniAssistant(props: OmniAssistantProps) {
  return <OmniAssistantOrb {...props} />;
}

export type { OmniAssistantProps } from '@/types/omni-assistant';