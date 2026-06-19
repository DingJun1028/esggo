import React, { memo, useCallback } from 'react';
import { Button, Input, Badge } from '@/components/ui';
import { Zap, X, Calendar, Clock, MapPin, User, Shield } from 'lucide-react';
import type { CalendarEvent } from '@/services/calendarService';

// ==================== TYPE DEFINITIONS ====================
interface EventModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly event?: CalendarEvent | null;
  readonly onSave?: (event: Partial<CalendarEvent>) => void;
}

// ==================== MAIN COMPONENT ====================
export const EventModal = memo<EventModalProps>(({ isOpen, onClose, event, onSave }) => {
  const isViewMode = !!event;

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
      role="dialog"
      aria-labelledby="event-modal-title"
      aria-modal="true"
    >
      <div className="w-[500px] bg-[#121212]/90 border border-[#FFD700]/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gradient-to-r from-[#FFD700]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg bg-[#FFD700] flex items-center justify-center text-black shadow-lg shadow-[#FFD700]/20"
              aria-hidden="true"
            >
              {isViewMode ? <Calendar size={18} /> : <Zap size={18} />}
            </div>
            <h2 id="event-modal-title" className="text-lg font-bold text-white tracking-wide">
              {isViewMode ? 'Event Details' : 'New System Pulse'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-red-500/20 hover:text-red-400 rounded-full h-8 w-8 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Close modal"
          >
            <X size={18} />
          </Button>
        </header>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="event-title"
              className="text-[10px] uppercase font-bold text-gray-500 tracking-wider"
            >
              Event Title
            </label>
            {isViewMode ? (
              <h3 className="text-2xl font-bold text-[#FFD700] leading-none">{event.title}</h3>
            ) : (
              <Input
                id="event-title"
                placeholder="Enter event title..."
                className="bg-[#1E1E1E] border-gray-700 text-lg font-bold text-[#FFD700] placeholder:text-gray-600 focus:border-[#FFD700]"
                aria-required="true"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-[10px] text-emerald-500 font-mono uppercase">
                <Clock size={10} aria-hidden="true" /> Time Window
              </label>
              {isViewMode ? (
                <p className="text-sm font-mono text-gray-300">
                  {new Date(event.start).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(event.end).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              ) : (
                <Input type="time" className="bg-[#1E1E1E] border-gray-700 h-8 text-xs" />
              )}
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-[10px] text-blue-500 font-mono uppercase">
                <MapPin size={10} aria-hidden="true" /> Location
              </label>
              <p className="text-sm text-gray-300 truncate">
                {isViewMode ? event.location || 'Virtual Nexus' : 'System Core'}
              </p>
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-[10px] text-[#FFD700] font-mono uppercase">
                <Shield size={10} aria-hidden="true" /> Type & Severity
              </label>
              <div className="flex gap-2">
                {isViewMode ? (
                  <>
                    <Badge
                      variant="outline"
                      className="border-[#FFD700]/30 text-[#FFD700] text-[10px]"
                    >
                      {event.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        event.severity === 'CRITICAL'
                          ? 'bg-red-500/10 text-red-500 border-red-500/50'
                          : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}
                    >
                      {event.severity || 'NORMAL'}
                    </Badge>
                  </>
                ) : (
                  <span className="text-xs text-gray-500 italic">Select type...</span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-[10px] text-purple-500 font-mono uppercase">
                <User size={10} aria-hidden="true" /> Assigned To
              </label>
              <p className="text-sm text-gray-300">
                {isViewMode ? event.assignedTo || 'Unassigned' : 'Auto-Assign'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Description
            </label>
            <div className="p-3 bg-[#1A1A1A] rounded-lg border border-gray-800 text-sm text-gray-400 min-h-[80px]">
              {isViewMode ? event.description : 'No description provided.'}
            </div>
          </div>
        </div>

        <footer className="p-4 bg-[#0E0E0E] flex justify-end gap-3 border-t border-gray-800">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            Close
          </Button>
          {!isViewMode && (
            <Button className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80 font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)] focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <Zap size={14} className="mr-2" aria-hidden="true" /> Initiate Pulse
            </Button>
          )}
          {isViewMode && (
            <Button
              variant="outline"
              className="border-red-900/50 text-red-500 hover:bg-red-900/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Event
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
});

EventModal.displayName = 'EventModal';
