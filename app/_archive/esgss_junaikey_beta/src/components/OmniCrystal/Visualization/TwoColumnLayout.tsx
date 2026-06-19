/**
 * 📐 Two Column Layout Component
 * --------------------------------------------------
 * [核心] 兩欄式排版
 * [功能] 響應式布局（圖表 + 文字）
 */

import React from 'react';
import { TwoColumnLayoutProps } from './types';

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  leftContent,
  rightContent,
  leftWidth = '50%',
  gap = '1.5rem',
}) => {
  return (
    <div
      className="two-column-layout"
      style={{
        display: 'grid',
        gridTemplateColumns: `${leftWidth} 1fr`,
        gap,
      }}
    >
      {/* 左側：圖表區域 */}
      <div className="left-column">{leftContent}</div>

      {/* 右側：分析文字 */}
      <div className="right-column">{rightContent}</div>

      <style>{`
                .two-column-layout {
                    width: 100%;
                }

                /* 響應式：平板 */
                @media (max-width: 1024px) {
                    .two-column-layout {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                }

                /* 響應式：手機 */
                @media (max-width: 768px) {
                    .two-column-layout {
                        grid-template-columns: 1fr;
                        gap: 0.75rem;
                    }
                }

                .left-column,
                .right-column {
                    min-width: 0; /* 防止內容溢出 */
                }
            `}</style>
    </div>
  );
};
