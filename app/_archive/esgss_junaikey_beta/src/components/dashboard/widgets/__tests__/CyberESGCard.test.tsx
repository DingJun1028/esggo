/**
 * 🧪 單元驗證：Cyber-ESG 儀表板組件測試
 * --------------------------------------------------
 * [驗證對象] CyberESGCard.tsx
 * [測試目標] 確保 "3可1不可" 視覺邏輯與數據真相 100% 兌現
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CyberESGCard from '../CyberESGCard';

describe('🏛️ 奧秘元件心核：CyberESGCard 視覺邏輯驗證', () => {
  it('🟢 驗證 [可溯源 Traceable] 狀態顯示正確', () => {
    render(
      <CyberESGCard label="範疇一排放" value={1240.5} status="Traceable" uuid="TEST-UUID-001" />
    );

    // 驗證標籤文字
    expect(screen.getByText('範疇一排放')).toBeInTheDocument();
    // 驗證狀態文字
    expect(screen.getByText('TRACEABLE')).toBeInTheDocument();
    expect(screen.getByText('可溯源')).toBeInTheDocument();
    // 驗證顏色邏輯 (Traceable 應為綠色)
    const badge = screen.getByText('TRACEABLE');
    expect(badge).toHaveClass('text-green-500');
  });

  it('🔴 驗證 [不可篡改 Immutable] 狀態顯示正確', () => {
    render(
      <CyberESGCard
        label="雜湊鎖定節點"
        value="HASH-LOCKED"
        status="Immutable"
        uuid="TEST-UUID-004"
      />
    );

    expect(screen.getByText('IMMUTABLE')).toBeInTheDocument();
    expect(screen.getByText('不可篡改')).toBeInTheDocument();
    const badge = screen.getByText('IMMUTABLE');
    expect(badge).toHaveClass('text-red-500');
  });

  it('🟣 驗證 SSOT UUID 顯示', () => {
    render(<CyberESGCard label="UUID測試" value={0} status="Trackable" uuid="UNIV-SSOT-X99" />);

    // UUID 應顯示前8碼
    expect(screen.getByText(/UUID: UNIV-SSO/i)).toBeInTheDocument();
  });

  it('🔒 驗證組件已被 Object.freeze 凍結', () => {
    expect(Object.isFrozen(CyberESGCard)).toBe(true);
  });
});
