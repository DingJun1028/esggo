// src/components/tools/OmniToolSuite.tsx
import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Calendar,
  CheckSquare,
  BookOpen,
  FileText,
  Brain,
  Save,
  Trash2,
  Gamepad2,
  Users,
  Globe,
  Home,
  Tag,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickNote {
  id: string;
  text: string;
  date: string;
}

export const OmniToolSuite: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'menu' | 'note' | 'calendar' | 'tasks'>('menu');
  const [notes, setNotes] = useState<QuickNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const navigate = useNavigate();

  // Load notes from local storage
  useEffect(() => {
    const savedNotes = localStorage.getItem('omni_quick_notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  const saveNote = () => {
    if (!currentNote.trim()) return;
    const newNote: QuickNote = {
      id: Date.now().toString(),
      text: currentNote,
      date: new Date().toLocaleDateString(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('omni_quick_notes', JSON.stringify(updatedNotes));
    setCurrentNote('');
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('omni_quick_notes', JSON.stringify(updatedNotes));
  };

  const handleNav = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Render different tool views
  const renderContent = () => {
    switch (activeTool) {
      case 'note':
        return (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <PenTool className="w-4 h-4" /> 快速筆記 (Quick Note)
              </h3>
              <button
                onClick={() => setActiveTool('menu')}
                className="text-xs text-slate-400 hover:text-white"
              >
                回選單
              </button>
            </div>
            <textarea
              value={currentNote}
              onChange={e => setCurrentNote(e.target.value)}
              placeholder="在此輸入 ESG 靈感..."
              className="w-full h-32 bg-slate-800/50 border border-white/10 rounded-lg p-3 text-sm text-white resize-none focus:border-aqua-500 outline-none"
            />
            <button
              onClick={saveNote}
              className="w-full py-2 bg-aqua-600 hover:bg-aqua-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> 儲存筆記
            </button>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
              {notes.map(note => (
                <div
                  key={note.id}
                  className="bg-slate-800 p-3 rounded-lg border border-white/5 group relative text-xs"
                >
                  <p className="text-slate-300 pr-6">{note.text}</p>
                  <span className="text-[10px] text-slate-500 mt-2 block">{note.date}</span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 法遵日曆 (Calendar)
              </h3>
              <button
                onClick={() => setActiveTool('menu')}
                className="text-xs text-slate-400 hover:text-white"
              >
                回選單
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {/* Mock Calendar Events */}
              <div className="bg-slate-800 p-3 rounded-lg border-l-4 border-emerald-500">
                <div className="text-xs text-emerald-400 font-bold">TODAY</div>
                <div className="text-sm text-white">ISO 14064 內部稽核</div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg border-l-4 border-amber-500">
                <div className="text-xs text-amber-400 font-bold">2025-04-30</div>
                <div className="text-sm text-white">氣候法碳費申報截止</div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg border-l-4 border-indigo-500">
                <div className="text-xs text-indigo-400 font-bold">2025-06-30</div>
                <div className="text-sm text-white">年度永續報告書發布</div>
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> 待辦事項 (Tasks)
              </h3>
              <button
                onClick={() => setActiveTool('menu')}
                className="text-xs text-slate-400 hover:text-white"
              >
                回選單
              </button>
            </div>
            <div className="flex-1">
              <div className="text-center text-slate-500 py-8 text-sm">
                請至 Tactical Dashboard 查看完整 Quick Task Matrix。
              </div>
              <button
                onClick={() => handleNav('/dashboard')}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
              >
                前往儀表板
              </button>
            </div>
          </div>
        );

      default: // Menu
        return (
          <div className="flex flex-col gap-3 h-full">
            {/* Omni Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 搜尋功能、知識、資產..."
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-aqua-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 custom-scrollbar">
              <ToolButton
                icon={<PenTool />}
                label="筆記 (Notes)"
                onClick={() => setActiveTool('note')}
                color="bg-aqua-500"
              />
              <ToolButton
                icon={<Calendar />}
                label="日曆 (Calendar)"
                onClick={() => setActiveTool('calendar')}
                color="bg-indigo-500"
              />
              <ToolButton
                icon={<CheckSquare />}
                label="待辦 (Tasks)"
                onClick={() => setActiveTool('tasks')}
                color="bg-emerald-500"
              />

              <ToolButton
                icon={<Home />}
                label="小屋 (Hut)"
                onClick={() => handleNav('/hut')}
                color="bg-indigo-600"
              />
              <ToolButton
                icon={<Gamepad2 />}
                label="Go! (Game)"
                onClick={() => handleNav('/esg-go')}
                color="bg-aqua-600"
              />
              <ToolButton
                icon={<Users />}
                label="聯盟 (Alliance)"
                onClick={() => handleNav('/alliance')}
                color="bg-red-600"
              />
              <ToolButton
                icon={<Globe />}
                label="地球村 (Village)"
                onClick={() => handleNav('/village')}
                color="bg-emerald-600"
              />
              <ToolButton
                icon={<Tag />}
                label="方案 (Plan)"
                onClick={() => handleNav('/plan')}
                color="bg-slate-600"
              />
              <ToolButton
                icon={<Shield />}
                label="治理 (Admin)"
                onClick={() => handleNav('/admin')}
                color="bg-slate-800"
              />
              <ToolButton
                icon={<BookOpen />}
                label="學院 (Academy)"
                onClick={() => handleNav('/library')}
                color="bg-amber-600"
              />
              <ToolButton
                icon={<FileText />}
                label="報導 (Report)"
                onClick={() => handleNav('/reports')}
                color="bg-pink-600"
              />
              <ToolButton
                icon={<Brain />}
                label="心法 (Wisdom)"
                onClick={() => handleNav('/dr-thoth')}
                color="bg-teal-600"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {/* Tool Panel */}
      {isOpen && (
        <div className="bg-slate-900 border border-white/20 shadow-2xl rounded-2xl w-72 h-96 p-4 animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 flex flex-col">
          {renderContent()}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setActiveTool('menu');
        }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-slate-700 rotate-45' : 'bg-gradient-to-r from-aqua-600 to-indigo-600 hover:scale-110'}`}
      >
        <span className="text-2xl text-white font-black">+</span>
      </button>
    </div>
  );
};

// Helper Component for Menu Buttons
const ToolButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}> = ({ icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl transition-all hover:scale-105"
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${color}`}>
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-300">{label}</span>
  </button>
);
