import React from 'react';
import { GameLogItem } from '../types';
import { CHARACTERS } from '../data/gameData';
import { History, X, Footprints, HelpCircle, Eye, Skull, AlertCircle } from 'lucide-react';

interface CaseLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: GameLogItem[];
}

export const CaseLogDrawer: React.FC<CaseLogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  const getLogIcon = (type: GameLogItem['type']) => {
    switch (type) {
      case 'move': return <Footprints className="w-3.5 h-3.5 text-[#2FBF8F]" />;
      case 'suggest': return <HelpCircle className="w-3.5 h-3.5 text-[#C9A24B]" />;
      case 'reveal': return <Eye className="w-3.5 h-3.5 text-[#4299E1]" />;
      case 'accuse': return <Skull className="w-3.5 h-3.5 text-[#B5273B]" />;
      case 'eliminate': return <AlertCircle className="w-3.5 h-3.5 text-[#E14B4B]" />;
      default: return <History className="w-3.5 h-3.5 text-[#9A93A6]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141118]/70 backdrop-blur-sm flex justify-end animate-fade-in text-[#F3EDE4]">
      <div className="bg-[#1F1B24] border-l-2 border-[#3A3340] w-full max-w-md h-full flex flex-col shadow-2xl p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3A3340] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#C9A24B]" />
            <h3 className="font-cormorant font-bold text-lg text-[#F3EDE4]">
              Case Chronology & Investigation Log
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-[#141118] text-[#9A93A6] hover:text-[#F3EDE4] border border-[#3A3340] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-dm text-xs">
          {[...logs].reverse().map((log) => {
            const char = log.characterId ? CHARACTERS[log.characterId] : null;

            return (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-[#141118] border border-[#3A3340] flex items-start gap-2.5 transition-colors hover:border-[#C9A24B]/40"
              >
                <div className="mt-0.5 p-1 rounded bg-[#1F1B24] border border-[#3A3340]">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1">
                  <p className="leading-snug text-[#F3EDE4]">
                    {log.text}
                  </p>
                  <span className="text-[10px] text-[#9A93A6]/60 font-mono block mt-1">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
