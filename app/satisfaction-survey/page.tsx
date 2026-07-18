'use client';

import { useEffect } from 'react';

export default function SatisfactionSurvey() {
  useEffect(() => {
    window.location.replace('/satisfaction-survey/index.html');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-gray-600">
      正在帶您前往每週滿意度調查…
    </div>
  );
}
