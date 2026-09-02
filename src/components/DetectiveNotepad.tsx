import React, { useState } from 'react';
import { DeductionState, Player } from '../types';
import { CHARACTERS, WEAPONS, ROOMS } from '../data/gameData';
import { DeductionCell } from './DeductionCell';
import { 
  FileText, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  HelpCircle, 
  X, 
  Check, 
  ShieldAlert,
  Sparkles 
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface DetectiveNotepadProps {
  notes: Record<string, DeductionState>;
  onNoteChange: (cardId: string, state: DeductionState) => void;
  onResetNotes: () => void;
  currentPlayer: Player;
  isMobileDrawer?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const DetectiveNotepad: React.FC<DetectiveNotepadProps> = ({
  notes,
  onNoteChange,
  onResetNotes,
  currentPlayer,
  isMobileDrawer = false,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [scratchpad, setScratchpad] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'suspects' | 'weapons' | 'rooms'>('all');

  const suspects = Object.values(CHARACTERS);
  const weapons = Object.values(WEAPONS);
  const rooms = Object.values(ROOMS);

  // Statistics
  const totalItems = suspects.length + weapons.length + rooms.length;
  const ruledOutCount = Object.entries(notes).filter(([id, state]) => 
    state === 'eliminated' || currentPlayer.hand.includes(id)
  ).length;
  const confirmedCount = Object.values(notes).filter(s => s === 'confirmed').length;

  const handleReset = () => {
    if (window.confirm('Reset all non-hand deduction marks on your notepad?')) {
      playClickSound();
      onResetNotes();
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-[#1F1B24] border border-[#3A3340] rounded-xl overflow-hidden shadow-2xl">
      {/* Notepad Header */}
      <div className="bg-[#2A2430] p-3.5 border-b border-[#3A3340] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#141118] border border-[#C9A24B]/40 text-[#C9A24B]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-cormorant font-bold text-base text-[#F3EDE4] tracking-wide flex items-center gap-2">
              Detective Notepad
              <span className="text-[11px] font-mono text-[#C9A24B] bg-[#C9A24B]/10 px-1.5 py-0.5 rounded border border-[#C9A24B]/20">
                {ruledOutCount}/{totalItems} Ruled Out
              </span>
            </h3>
            <p className="text-[10px] text-[#9A93A6] font-dm">
              {currentPlayer.name}’s Confidential Dossier
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="btn-reset-notepad"
            onClick={handleReset}
            title="Reset deduction checkmarks"
            className="p-1.5 rounded bg-[#141118] hover:bg-[#B5273B]/20 hover:text-[#E14B4B] border border-[#3A3340] text-[#9A93A6] transition-colors text-xs flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Reset</span>
          </button>
          {!isMobileDrawer && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded hover:bg-[#3A3340]/40 text-[#9A93A6] text-xs cursor-pointer md:hidden"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
          {isMobileDrawer && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded bg-[#141118] text-[#9A93A6] border border-[#3A3340] hover:text-[#F3EDE4] text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Legend & Filter Bar */}
      <div className="px-3 py-2 bg-[#141118]/80 border-b border-[#3A3340] flex items-center justify-between text-[11px] text-[#9A93A6]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#C9A24B]/20 border border-[#C9A24B]/40 text-[#C9A24B] flex items-center justify-center text-[9px] font-bold">
              <Eye className="w-2.5 h-2.5" />
            </span>
            Hand
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#B5273B]/20 border border-[#B5273B]/50 text-[#E14B4B] flex items-center justify-center text-[9px] font-bold">
              ✗
            </span>
            Eliminated
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#2FBF8F]/20 border border-[#2FBF8F]/60 text-[#2FBF8F] flex items-center justify-center text-[9px] font-bold">
              ✓
            </span>
            Confirmed
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1">
          {(['all', 'suspects', 'weapons', 'rooms'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-1.5 py-0.5 rounded text-[10px] capitalize transition-colors ${
                activeTab === tab 
                  ? 'bg-[#C9A24B] text-[#141118] font-bold' 
                  : 'hover:bg-[#2A2430] text-[#9A93A6]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Matrix Rows */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 font-dm text-xs">
        {/* Suspects Section */}
        {(activeTab === 'all' || activeTab === 'suspects') && (
          <div>
            <div className="flex items-center justify-between border-b border-[#3A3340] pb-1 mb-1.5">
              <span className="font-cormorant font-bold text-[#B5273B] text-sm tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B5273B]" />
                Suspects (6)
              </span>
              <span className="text-[10px] text-[#9A93A6]">Who did it?</span>
            </div>
            <div className="space-y-1">
              {suspects.map(suspect => {
                const cardId = `suspect_${suspect.id}`;
                const isInHand = currentPlayer.hand.includes(cardId);
                const currentState = isInHand ? 'in_hand' : (notes[cardId] || 'unknown');

                return (
                  <div
                    key={suspect.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-[#2A2430]/60 transition-colors border border-transparent hover:border-[#3A3340]"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-[#141118]"
                        style={{ backgroundColor: suspect.color }}
                      />
                      <span className={`font-medium ${isInHand ? 'text-[#C9A24B]' : 'text-[#F3EDE4]'}`}>
                        {suspect.name}
                      </span>
                      {isInHand && (
                        <span className="text-[9px] bg-[#C9A24B]/15 text-[#C9A24B] px-1 rounded border border-[#C9A24B]/30 font-mono">
                          IN HAND
                        </span>
                      )}
                    </div>
                    <DeductionCell
                      label={suspect.name}
                      state={currentState}
                      isInHand={isInHand}
                      onChange={(next) => onNoteChange(cardId, next)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Weapons Section */}
        {(activeTab === 'all' || activeTab === 'weapons') && (
          <div>
            <div className="flex items-center justify-between border-b border-[#3A3340] pb-1 mb-1.5">
              <span className="font-cormorant font-bold text-[#C9A24B] text-sm tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C9A24B]" />
                Weapons (6)
              </span>
              <span className="text-[10px] text-[#9A93A6]">With what?</span>
            </div>
            <div className="space-y-1">
              {weapons.map(weapon => {
                const cardId = `weapon_${weapon.id}`;
                const isInHand = currentPlayer.hand.includes(cardId);
                const currentState = isInHand ? 'in_hand' : (notes[cardId] || 'unknown');

                return (
                  <div
                    key={weapon.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-[#2A2430]/60 transition-colors border border-transparent hover:border-[#3A3340]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded flex items-center justify-center bg-[#141118] text-[#C9A24B] text-[9px]">
                        ⚔
                      </span>
                      <span className={`font-medium ${isInHand ? 'text-[#C9A24B]' : 'text-[#F3EDE4]'}`}>
                        {weapon.name}
                      </span>
                      {isInHand && (
                        <span className="text-[9px] bg-[#C9A24B]/15 text-[#C9A24B] px-1 rounded border border-[#C9A24B]/30 font-mono">
                          IN HAND
                        </span>
                      )}
                    </div>
                    <DeductionCell
                      label={weapon.name}
                      state={currentState}
                      isInHand={isInHand}
                      onChange={(next) => onNoteChange(cardId, next)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rooms Section */}
        {(activeTab === 'all' || activeTab === 'rooms') && (
          <div>
            <div className="flex items-center justify-between border-b border-[#3A3340] pb-1 mb-1.5">
              <span className="font-cormorant font-bold text-[#2FBF8F] text-sm tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2FBF8F]" />
                Rooms (9)
              </span>
              <span className="text-[10px] text-[#9A93A6]">Where?</span>
            </div>
            <div className="space-y-1">
              {rooms.map(room => {
                const cardId = `room_${room.id}`;
                const isInHand = currentPlayer.hand.includes(cardId);
                const currentState = isInHand ? 'in_hand' : (notes[cardId] || 'unknown');

                return (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-[#2A2430]/60 transition-colors border border-transparent hover:border-[#3A3340]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded flex items-center justify-center bg-[#141118] text-[#2FBF8F] text-[9px]">
                        ⌂
                      </span>
                      <span className={`font-medium ${isInHand ? 'text-[#C9A24B]' : 'text-[#F3EDE4]'}`}>
                        {room.name}
                      </span>
                      {isInHand && (
                        <span className="text-[9px] bg-[#C9A24B]/15 text-[#C9A24B] px-1 rounded border border-[#C9A24B]/30 font-mono">
                          IN HAND
                        </span>
                      )}
                    </div>
                    <DeductionCell
                      label={room.name}
                      state={currentState}
                      isInHand={isInHand}
                      onChange={(next) => onNoteChange(cardId, next)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scratchpad Memo Area */}
        <div className="pt-2 border-t border-[#3A3340]/60">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#9A93A6] flex items-center justify-between mb-1">
            <span>Detective Scribble Pad</span>
            <span className="text-[9px] text-[#C9A24B]">Private Memo</span>
          </label>
          <textarea
            id="detective-scratchpad"
            value={scratchpad}
            onChange={(e) => setScratchpad(e.target.value)}
            placeholder="e.g. Mustard disproved Peacock's suggestion with Dagger..."
            rows={2}
            className="w-full bg-[#141118] border border-[#3A3340] rounded p-2 text-xs text-[#F3EDE4] placeholder-[#9A93A6]/40 focus:outline-none focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] resize-none font-dm"
          />
        </div>
      </div>
    </div>
  );

  if (isMobileDrawer) {
    if (!isOpenMobile) return null;
    return (
      <div className="fixed inset-0 z-50 bg-[#141118]/80 backdrop-blur-sm flex justify-end md:hidden animate-fade-in">
        <div className="w-full max-w-sm h-full p-3 animate-slide-left">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {content}
    </div>
  );
};
