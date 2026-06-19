import React from 'react';
import { Language } from '../types';

export const UniversalRestoration: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-white">
        {isZh ? '通用修復' : 'Universal Restoration'}
      </h1>
      <p className="text-gray-400 mt-4">
        {isZh ? '修復功能正在開發中...' : 'Restoration feature under development...'}
      </p>
    </div>
  );
};

export const CardGameArenaView: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-white">
        {isZh ? '卡牌遊戲競技場' : 'Card Game Arena'}
      </h1>
      <p className="text-gray-400 mt-4">
        {isZh ? '卡牌遊戲功能正在開發中...' : 'Card game feature under development...'}
      </p>
    </div>
  );
};