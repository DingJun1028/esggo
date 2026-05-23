'use client';
import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, Globe, Users, Shield, Zap, LayoutGrid, List } from 'lucide-react';
import { BrandCard, BrandBadge, BrandInput, BrandButton } from '../brand';

export interface SelectionItem {
  id: string;
  label: string;
  sub?: string;
  category?: string;
  tag?: string;
  color?: string;
}

export interface SelectionCategory {
  id: string;
  title: string;
  icon?: React.ReactNode;
  items: SelectionItem[];
}

interface SelectionHouseProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SelectionItem) => void;
  categories: SelectionCategory[];
  title?: string;
  placeholder?: string;
}

export default function SelectionHouse({
  isOpen,
  onClose,
  onSelect,
  categories,
  title = "全選項總覽",
  placeholder = "搜尋關鍵字..."
}: SelectionHouseProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase()) || 
      item.sub?.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const displayCategories = activeCategory === 'all' 
    ? filteredCategories 
    : filteredCategories.filter(c => c.id === activeCategory);

  return (
    <div className={`fixed inset-0 z-[2000] flex flex-col bg-white transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div>
          <h2 className="text-lg font-bold text-[#003262]">{title}</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mobile Selection House</p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      {/* Search & Tabs */}
      <div className="p-6 space-y-4 bg-white border-b border-slate-50 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-blue-600 transition-all outline-none"
            placeholder={placeholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-[#003262] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            全部
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-[#003262] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Options Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {displayCategories.map(cat => (
          <section key={cat.id}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                {cat.icon || <LayoutGrid size={14} />}
              </div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{cat.title}</h3>
              <span className="ml-auto bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold">{cat.items.length}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {cat.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group w-full p-5 rounded-2xl bg-white border border-slate-100 text-left hover:border-blue-600 hover:shadow-lg hover:shadow-blue-900/5 transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{item.label}</span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  {item.sub && <p className="text-[11px] text-slate-400 leading-relaxed">{item.sub}</p>}
                  {item.tag && (
                    <div className="mt-3">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase tracking-wider">{item.tag}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        ))}

        {displayCategories.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-slate-300 space-y-4">
            <Search size={48} />
            <p className="text-sm font-bold">找不到相符的選項</p>
          </div>
        )}
      </div>

      {/* Safe Area Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-[env(safe-area-inset-bottom)] bg-white border-t border-slate-50" />
    </div>
  );
}
