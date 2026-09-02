import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Player, CharacterId } from '../types';
import { CHARACTERS } from '../data/gameData';
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Lock, 
  Volume2, 
  Flame, 
  Eye, 
  FileQuestion, 
  Radio, 
  CornerDownRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { playClickSound, playTelegraphSound } from '../utils/sound';
import { generateUniqueId } from '../utils/gameLogic';

interface ParlorChatProps {
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  players: Player[];
  currentUserId: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  roomName?: string;
}

const QUICK_QUOTES = [
  "🔍 I suspect foul play!",
  "🕰️ Where were you at midnight?",
  "🕯️ The lights just flickered in the Hall...",
  "🍷 Check your alibis, ladies and gentlemen.",
  "📜 Footsteps heard near the Conservatory!",
  "⚠️ I swear I didn't touch the Candlestick!",
  "💼 Someone is concealing a crucial card...",
  "⚡ J'Accuse! The truth will out!"
];

const AI_RESPONSES: Record<CharacterId, string[]> = {
  scarlet: [
    "Secrets in this bungalow don't stay buried for long, darling.",
    "A lady never confesses unless the evidence is absolute.",
    "Look into the Lounge if you seek real intrigue."
  ],
  mustard: [
    "Balderdash! My military service is above all suspicion!",
    "I was inspecting the perimeter when the clock struck twelve!",
    "Keep your eyes on the weapons cabinet, detectives!"
  ],
  peacock: [
    "How dare you imply such indelicacy in my presence!",
    "A woman of high society has no need for crude violence.",
    "Listen closely to the servants' rumors in the Kitchen."
  ],
  plum: [
    "Deductive logic requires empirical evidence, not wild conjecture.",
    "The trajectory and placement point toward cold calculation.",
    "Let us consult the case records in the Library."
  ],
  green: [
    "I assure you, my financial transactions tonight were strictly legitimate.",
    "Careful where you point fingers—reputations are fragile things.",
    "The secret passages in this estate tell many tales."
  ],
  white: [
    "I was only polishing the mahogany in the dining hall, officer!",
    "The master had many guests, and even more enemies...",
    "God help us all if the murderer strikes again tonight."
  ]
};

export const ParlorChat: React.FC<ParlorChatProps> = ({
  messages,
  onSendMessage,
  players,
  currentUserId,
  isOpen,
  onToggleOpen,
  roomName = 'Blackwood Parlor',
}) => {
  const [inputText, setInputText] = useState('');
  const [whisperRecipientId, setWhisperRecipientId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'whisper' | 'quotes'>('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(messages.length);

  const currentPlayer = players.find(p => p.id === currentUserId) || players[0];

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    } else {
      if (messages.length > lastMessageCountRef.current) {
        setUnreadCount(prev => prev + (messages.length - lastMessageCountRef.current));
      }
    }
    lastMessageCountRef.current = messages.length;
  }, [messages.length, isOpen]);

  const handleSend = (overrideText?: string, isWhisper = false, recipientId = 'all') => {
    const textToSend = (overrideText || inputText).trim();
    if (!textToSend) return;

    playTelegraphSound();

    let targetRecipientName: string | undefined;
    if (isWhisper && recipientId !== 'all') {
      const recipient = players.find(p => p.id === recipientId);
      targetRecipientName = recipient?.name;
    }

    const newMsg: ChatMessage = {
      id: generateUniqueId('chat'),
      senderId: currentPlayer?.id || 'guest',
      senderName: currentPlayer?.name || 'Detective',
      senderCharacter: currentPlayer?.characterId,
      text: textToSend,
      timestamp: Date.now(),
      isWhisper: isWhisper && recipientId !== 'all',
      recipientName: targetRecipientName,
    };

    onSendMessage(newMsg);
    if (!overrideText) setInputText('');

    // AI Bot Banter Trigger
    const aiPlayers = players.filter(p => p.isAi);
    if (aiPlayers.length > 0 && Math.random() < 0.65) {
      const randomAi = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
      const botPool = AI_RESPONSES[randomAi.characterId] || AI_RESPONSES.mustard;
      const botLine = botPool[Math.floor(Math.random() * botPool.length)];

      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: generateUniqueId('bot-chat'),
          senderId: randomAi.id,
          senderName: randomAi.name,
          senderCharacter: randomAi.characterId,
          text: botLine,
          timestamp: Date.now(),
          isAi: true,
        };
        onSendMessage(botMsg);
        playTelegraphSound();
      }, 1400 + Math.random() * 1200);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(undefined, whisperRecipientId !== 'all', whisperRecipientId);
    }
  };

  return (
    <>
      {/* Floating Toggle Badge (when closed) */}
      {!isOpen && (
        <button
          id="btn-open-parlor-chat"
          type="button"
          onClick={() => {
            playClickSound();
            onToggleOpen();
          }}
          className="fixed bottom-20 md:bottom-24 right-4 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#2A1B12] hover:bg-[#3B281B] text-[#D4AF37] border-2 border-[#C99738] shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-all transform hover:scale-105 cursor-pointer font-dm group"
          title="Open Parlor Telegraph & Chat"
        >
          <div className="relative">
            <Radio className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#9B2226] text-[#F7EFE2] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#D4AF37]">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-bold font-antique tracking-wide text-[#F7EFE2] group-hover:text-[#D4AF37]">
            Parlor Telegram
          </span>
        </button>
      )}

      {/* Parlor Telegram Window / Drawer */}
      {isOpen && (
        <div 
          id="parlor-chat-panel"
          className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 w-[92vw] sm:w-[380px] h-[520px] max-h-[82vh] z-50 rounded-xl bg-[#1E140D] border-2 border-[#C99738]/80 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-[#F7EFE2] animate-in fade-in slide-in-from-bottom-4 duration-200 font-dm"
        >
          {/* Header with Vintage Brass Bungalow Inscription */}
          <div className="bg-gradient-to-r from-[#2A1B12] via-[#3B281B] to-[#2A1B12] p-3 border-b border-[#785822] flex items-center justify-between select-none relative">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#120B07] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-antique text-sm font-bold tracking-wider text-[#D4AF37] leading-none">
                  PARLOR TELEGRAPH
                </h3>
                <p className="text-[10px] font-typewriter text-[#BAAFA1] leading-tight">
                  {roomName} • Dispatch
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onToggleOpen();
                }}
                className="p-1 rounded text-[#BAAFA1] hover:text-[#F7EFE2] hover:bg-[#120B07]/60 transition-colors cursor-pointer"
                title="Close Parlor Telegraph"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex bg-[#160F0A] border-b border-[#3E291C] px-2 pt-1 gap-1 text-xs">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('all');
                setWhisperRecipientId('all');
              }}
              className={`px-3 py-1.5 rounded-t font-antique transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#1E140D] text-[#D4AF37] border-t border-x border-[#C99738]/50 font-bold'
                  : 'text-[#BAAFA1] hover:text-[#F7EFE2]'
              }`}
            >
              Parlor (All)
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('whisper');
              }}
              className={`px-3 py-1.5 rounded-t font-antique flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'whisper'
                  ? 'bg-[#1E140D] text-[#D4AF37] border-t border-x border-[#C99738]/50 font-bold'
                  : 'text-[#BAAFA1] hover:text-[#F7EFE2]'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Whisper</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveTab('quotes');
              }}
              className={`px-3 py-1.5 rounded-t font-antique flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'quotes'
                  ? 'bg-[#1E140D] text-[#D4AF37] border-t border-x border-[#C99738]/50 font-bold'
                  : 'text-[#BAAFA1] hover:text-[#F7EFE2]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Quips</span>
            </button>
          </div>

          {/* Whisper Recipient Bar (if on whisper tab) */}
          {activeTab === 'whisper' && (
            <div className="bg-[#24170F] px-3 py-1.5 border-b border-[#3E291C] flex items-center justify-between text-xs">
              <span className="text-[#BAAFA1] font-antique">Recipient:</span>
              <select
                value={whisperRecipientId}
                onChange={(e) => setWhisperRecipientId(e.target.value)}
                className="bg-[#120B07] text-[#D4AF37] border border-[#785822] rounded px-2 py-0.5 text-xs focus:outline-none"
              >
                {players
                  .filter(p => p.id !== currentUserId)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({CHARACTERS[p.characterId]?.name || 'Guest'})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#180F0A] bg-manor-paper">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#BAAFA1]">
                <FileQuestion className="w-8 h-8 text-[#C99738]/40 mb-2" />
                <p className="font-antique text-sm text-[#D4AF37]">The parlor is quiet...</p>
                <p className="text-xs font-typewriter text-[#BAAFA1] mt-1 max-w-[220px]">
                  Exchange clues, question suspects, or send whispers before the next turn.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                const char = msg.senderCharacter ? CHARACTERS[msg.senderCharacter] : null;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isMe ? 'items-end' : 'items-start'
                    }`}
                  >
                    {/* Sender Tag & Timestamp */}
                    <div className="flex items-center gap-1.5 text-[10px] text-[#BAAFA1] mb-0.5 font-typewriter">
                      <span className="font-bold text-[#D4AF37]">
                        {msg.senderName}
                      </span>
                      {char && (
                        <span 
                          className="px-1 rounded text-[9px] font-bold"
                          style={{ backgroundColor: `${char.color}25`, color: char.color }}
                        >
                          {char.name}
                        </span>
                      )}
                      {msg.isWhisper && (
                        <span className="text-[#D9383A] font-bold flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          <span>to {msg.recipientName || 'You'}</span>
                        </span>
                      )}
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Message Bubble (Aged Telegram Paper Look) */}
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-1.5 text-xs shadow-md border ${
                        isMe
                          ? 'bg-[#2E1E14] text-[#F7EFE2] border-[#C99738]/50 rounded-br-none'
                          : msg.isAi
                          ? 'bg-[#24170F] text-[#F7EFE2] border-[#9B2226]/60 rounded-bl-none font-typewriter'
                          : msg.isWhisper
                          ? 'bg-[#3A141A] text-[#F7EFE2] border-[#D9383A]/70 rounded-bl-none'
                          : 'bg-[#1E140D] text-[#F7EFE2] border-[#4A3322] rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Quotes Picker (if open) */}
          {activeTab === 'quotes' && (
            <div className="p-2 bg-[#22160E] border-t border-[#4A3322] max-h-36 overflow-y-auto grid grid-cols-1 gap-1">
              <span className="text-[10px] font-antique text-[#D4AF37] px-1 font-bold">
                TELEGRAPH QUOTES:
              </span>
              {QUICK_QUOTES.map((quote, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    handleSend(quote, false, 'all');
                    setActiveTab('all');
                  }}
                  className="text-left px-2 py-1 rounded bg-[#160F0A] hover:bg-[#3B281B] text-[#F7EFE2] hover:text-[#D4AF37] border border-[#3E291C] text-[11px] font-typewriter transition-colors cursor-pointer truncate"
                >
                  {quote}
                </button>
              ))}
            </div>
          )}

          {/* Input Controls */}
          <div className="p-2 bg-[#1A1009] border-t border-[#785822]/80 flex items-center gap-2">
            <input
              id="input-parlor-chat"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeTab === 'whisper' 
                  ? 'Send secret dispatch...' 
                  : 'Type parlor message...'
              }
              maxLength={200}
              className="flex-1 bg-[#120B07] text-[#F7EFE2] placeholder-[#BAAFA1]/60 px-3 py-2 rounded-lg border border-[#4A3322] focus:border-[#C99738] focus:outline-none text-xs font-sans"
            />
            <button
              id="btn-send-parlor-chat"
              type="button"
              onClick={() => handleSend(undefined, activeTab === 'whisper', whisperRecipientId)}
              disabled={!inputText.trim()}
              className="p-2 rounded-lg bg-[#C99738] hover:bg-[#B2832E] disabled:opacity-40 disabled:hover:bg-[#C99738] text-[#120B07] font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 shadow"
              title="Send Telegram"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
