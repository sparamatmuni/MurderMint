import React, { useState } from 'react';
import { Player, GamePhase } from '../types';
import { CHARACTERS } from '../data/gameData';
import { PlayerAvatar } from './PlayerAvatar';
import { AmbientAudioWidget } from './AmbientAudioWidget';
import { 
  Volume2, 
  VolumeX, 
  BookOpen, 
  History, 
  FileText, 
  Copy, 
  Check, 
  Radio,
  Share2,
  Sparkles
} from 'lucide-react';
import { toggleMute, isMuted, playClickSound } from '../utils/sound';

interface TopBarProps {
  roomCode: string;
  players: Player[];
  activePlayerIndex: number;
  currentUserId: string;
  onOpenRules: () => void;
  onOpenLogs: () => void;
  onToggleChat?: () => void;
  onToggleMobileNotepad: () => void;
  notepadRuledOutCount?: number;
  chatUnreadCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  roomCode,
  players,
  activePlayerIndex,
  currentUserId,
  onOpenRules,
  onOpenLogs,
  onToggleChat,
  onToggleMobileNotepad,
  notepadRuledOutCount = 0,
  chatUnreadCount = 0,
}) => {
  const [copied, setCopied] = useState(false);
  const [muted, setMutedState] = useState(isMuted());

  const activePlayer = players[activePlayerIndex] || players[0];
  const isMyTurn = activePlayer?.id === currentUserId;

  const handleCopyCode = () => {
    playClickSound();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSound = () => {
    const nextMuted = toggleMute();
    setMutedState(nextMuted);
    if (!nextMuted) {
      playClickSound();
    }
  };

  return (
    <header className="w-full bg-[#1E140D] border-b-2 border-[#5A3E2B] px-3 sm:px-5 py-2.5 shadow-lg flex items-center justify-between gap-2 select-none relative z-30">
      {/* Left: Brand & Room Code */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="font-brand font-bold text-lg sm:text-xl text-[#F7EFE2] tracking-wider">
            MURDER<span className="text-[#2E7D5B]">MINT</span>
          </span>
        </div>

        {/* Room Code Badge */}
        <button
          id="btn-copy-room-code"
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#120B07] border border-[#785822] hover:border-[#C99738] transition-colors text-xs font-mono text-[#D4AF37] cursor-pointer"
          title="Click to copy Room Code"
        >
          <span>{roomCode}</span>
          {copied ? <Check className="w-3.5 h-3.5 text-[#2E7D5B]" /> : <Copy className="w-3 h-3 text-[#BAAFA1]" />}
        </button>
      </div>

      {/* Center: Detective Turn Carousel / Avatars */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-[45vw] sm:max-w-none">
        {players.map((p, idx) => (
          <PlayerAvatar
            key={p.id}
            player={p}
            isActive={idx === activePlayerIndex}
            size="sm"
            showDetails={false}
          />
        ))}
      </div>

      {/* Right: Actions (Chat, Sound, Rules, Log, Mobile Notepad) */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Mobile Notepad Trigger Button */}
        <button
          type="button"
          id="btn-mobile-notepad"
          onClick={() => {
            playClickSound();
            onToggleMobileNotepad();
          }}
          className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2A1B12] border border-[#C99738]/50 text-[#D4AF37] text-xs font-bold font-dm"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notepad ({notepadRuledOutCount}/21)</span>
        </button>

        {/* Parlor Chat Button in Top Bar */}
        {onToggleChat && (
          <button
            type="button"
            id="btn-topbar-chat"
            onClick={() => {
              playClickSound();
              onToggleChat();
            }}
            className="relative p-1.5 sm:p-2 rounded-lg bg-[#120B07] hover:bg-[#2A1B12] text-[#D4AF37] border border-[#785822] transition-colors cursor-pointer flex items-center gap-1"
            title="Open Parlor Telegraph Chat"
          >
            <Radio className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline text-xs font-antique font-bold">Chat</span>
            {chatUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9B2226] text-[#F7EFE2] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#D4AF37]">
                {chatUnreadCount}
              </span>
            )}
          </button>
        )}

        {/* Vintage Ambient Gramophone & Sound Controls */}
        <AmbientAudioWidget variant="compact" />

        {/* Case Log Drawer Button */}
        <button
          type="button"
          id="btn-open-logs"
          onClick={() => {
            playClickSound();
            onOpenLogs();
          }}
          className="p-1.5 sm:p-2 rounded-lg bg-[#120B07] hover:bg-[#2A1B12] text-[#BAAFA1] hover:text-[#F7EFE2] border border-[#4A3322] transition-colors cursor-pointer"
          title="Case Chronology & Logs"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Rules Dossier Button */}
        <button
          type="button"
          id="btn-open-rules"
          onClick={() => {
            playClickSound();
            onOpenRules();
          }}
          className="p-1.5 sm:p-2 rounded-lg bg-[#120B07] hover:bg-[#2A1B12] text-[#BAAFA1] hover:text-[#F7EFE2] border border-[#4A3322] transition-colors cursor-pointer flex items-center gap-1"
          title="Detective Rules & Guide"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-dm">Rules</span>
        </button>
      </div>
    </header>
  );
};

