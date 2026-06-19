'use client';

import { Button } from '@/components/ui/Button.tsx';
import { Bell, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onMobileMenuClick?: () => void;
  user?: any;
  onLogout?: () => void;
}

export function Header({ onMobileMenuClick, user, onLogout }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - Visible only on mobile */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={onMobileMenuClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
        </Button>
        <h2 className="text-lg font-semibold text-gray-800">永續報告中心</h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <Bell size={20} />
        </Button>

        <div className="flex items-center gap-2">
          {user && <span className="text-sm font-medium text-gray-700 hidden md:block">{user.displayName || user.email}</span>}
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
