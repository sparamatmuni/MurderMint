import React, { useState } from 'react';
import { Player, CharacterId, HouseRules, ChatMessage, RoomInfo, CharacterInfo, WeaponInfo, WeaponId } from '../types';
import { CHARACTERS, ROOMS, WEAPONS } from '../data/gameData';
import { ParlorChat } from '../components/ParlorChat';
import { AmbientAudioWidget } from '../components/AmbientAudioWidget';
import { RulesModal } from '../components/RulesModal';
import { 
  Users, 
  Crown, 
  Bot, 
  Check, 
  Copy, 
  Play, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles,
  HelpCircle,
  Radio,
  Eye,
  Maximize2,
  DoorOpen,
  MapPin,
  X,
  Compass,
  Sword,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface LobbyViewProps {
  roomCode: string;
  roomName: string;
  players: Player[];
  currentUserId: string;
  maxPlayers: number;
  houseRules: HouseRules;
  chatMessages?: ChatMessage[];
  onSendMessage?: (msg: ChatMessage) => void;
  onUpdatePlayer: (playerId: string, updates: Partial<Player>) => void;
  onAddAiPlayer: (characterId?: CharacterId) => void;
  onAutoFillBots?: (targetTotal?: number) => void;
  onRemovePlayer: (playerId: string) => void;
  onStartGame: () => void;
  onLeaveLobby: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  roomCode,
  roomName,
  players,
  currentUserId,
  maxPlayers,
  houseRules,
  chatMessages = [],
  onSendMessage,
  onUpdatePlayer,
  onAddAiPlayer,
  onAutoFillBots,
  onRemovePlayer,
  onStartGame,
  onLeaveLobby,
}) => {
  const [copied, setCopied] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'rooms' | 'suspects' | 'weapons'>('rooms');
  const [inspectedRoom, setInspectedRoom] = useState<RoomInfo | null>(null);
  const [inspectedCharacter, setInspectedCharacter] = useState<CharacterInfo | null>(null);
  const [inspectedWeapon, setInspectedWeapon] = useState<WeaponInfo | null>(null);

  const currentPlayer = players.find(p => p.id === currentUserId) || players[0];
  const isHost = currentPlayer?.isHost;

  const claimedCharacters = players.map(p => p.characterId);
  const availableCharacters = (Object.keys(CHARACTERS) as CharacterId[]).filter(
    id => !claimedCharacters.includes(id)
  );

  const canStart = players.length >= 3 && players.every(p => p.isReady || p.isAi);

  const handleCopyCode = () => {
    playClickSound();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = () => {
    playClickSound();
    onUpdatePlayer(currentPlayer.id, { isReady: !currentPlayer.isReady });
  };

  const handleChangeCharacter = (charId: CharacterId) => {
    playClickSound();
    onUpdatePlayer(currentPlayer.id, { characterId: charId });
  };

  const handleAutoFillBots = () => {
    playClickSound();
    if (onAutoFillBots) {
      onAutoFillBots(4);
    } else {
      onAddAiPlayer();
    }
  };

  const roomList = Object.values(ROOMS);

  return (
    <div className="min-h-screen bg-[#120B07] text-[#F7EFE2] py-8 px-4 flex flex-col items-center bg-blueprint relative">
      {/* Background warm ambiance */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C99738]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl bg-[#1E140D] border-2 border-[#5A3E2B] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] p-6 sm:p-8 flex flex-col relative z-10">
        {/* Top Header with Brass & Wood Framing */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#4A3322] pb-5 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-typewriter text-[#D4AF37] uppercase tracking-wider bg-[#2A1B12] px-2 py-0.5 rounded border border-[#785822]">
                ESTATE WAITING PARLOR
              </span>
              <span className="text-xs font-typewriter text-[#BAAFA1]">• {players.length}/{maxPlayers} Detectives Assembled</span>
            </div>
            <h2 className="font-antique font-bold text-2xl sm:text-3xl text-[#F7EFE2] tracking-wide">
              {roomName}
            </h2>
          </div>

          {/* Room Code Badge, Ambient Audio, Rules & Chat Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-lobby-how-to-play"
              onClick={() => {
                playClickSound();
                setIsRulesOpen(true);
              }}
              className="p-2.5 rounded-xl bg-[#2A1B12] hover:bg-[#3B281B] text-[#D4AF37] border border-[#785822] flex items-center gap-1.5 transition-colors cursor-pointer shadow"
              title="How to Play & Case Rules"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-antique font-bold">How to Play</span>
            </button>

            <AmbientAudioWidget variant="compact" />

            <div className="flex items-center gap-2 bg-[#120B07] p-2 rounded-xl border border-[#785822]">
              <div className="text-left px-2">
                <span className="text-[9px] font-typewriter text-[#BAAFA1] uppercase tracking-wider block">
                  Bungalow Key
                </span>
                <span className="font-typewriter text-base font-bold text-[#D4AF37]">
                  {roomCode}
                </span>
              </div>
              <button
                type="button"
                id="btn-lobby-copy-code"
                onClick={handleCopyCode}
                className="p-2 rounded-lg bg-[#2A1B12] hover:bg-[#3B281B] text-[#F7EFE2] border border-[#5A3E2B] text-xs font-antique flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2E7D5B]" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsChatOpen(prev => !prev);
              }}
              className="p-2.5 rounded-xl bg-[#2A1B12] hover:bg-[#3B281B] text-[#D4AF37] border border-[#785822] flex items-center gap-1.5 transition-colors cursor-pointer shadow"
              title="Open Parlor Chat"
            >
              <Radio className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline text-xs font-antique font-bold">Chat ({chatMessages.length})</span>
            </button>
          </div>
        </div>

        {/* Detectives Grid (3-6 Players) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-antique font-bold text-lg text-[#F7EFE2] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              Assembled Suspects & Detectives ({players.length})
            </h3>

            {isHost && players.length < maxPlayers && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-add-ai-bot"
                  onClick={() => {
                    playClickSound();
                    onAddAiPlayer();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#2A1B12] hover:bg-[#3B281B] text-[#2E7D5B] border border-[#2E7D5B]/40 text-xs font-antique font-bold flex items-center gap-1 cursor-pointer transition-colors shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add AI Guest</span>
                </button>
                {players.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAutoFillBots}
                    className="px-3 py-1.5 rounded-lg bg-[#C99738]/15 hover:bg-[#C99738]/25 text-[#D4AF37] border border-[#C99738]/50 text-xs font-antique font-bold flex items-center gap-1 cursor-pointer transition-colors shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick 4-Player Fill</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {players.map((player) => {
              const char = CHARACTERS[player.characterId];
              const isMe = player.id === currentUserId;

              return (
                <div
                  key={player.id}
                  id={`lobby-player-card-${player.id}`}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between relative bg-[#120B07] ${
                    isMe
                      ? 'border-[#C99738] shadow-[0_0_15px_rgba(201,151,56,0.25)]'
                      : 'border-[#4A3322]'
                  }`}
                >
                  {/* Top: Avatar & Badges */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C99738] shadow-md bg-[#1E140D] shrink-0">
                        {char.imageUrl ? (
                          <img
                            src={char.imageUrl}
                            alt={char.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center font-bold text-base"
                            style={{
                              backgroundColor: char.color,
                              color: char.id === 'white' ? '#120B07' : '#F7EFE2',
                            }}
                          >
                            {char.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-[#F7EFE2] truncate max-w-[120px]">
                            {player.name}
                          </h4>
                          {isMe && (
                            <span className="text-[9px] bg-[#C99738]/20 text-[#D4AF37] px-1 rounded border border-[#C99738]/40 font-typewriter">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className={`text-xs ${char.textColor} font-antique font-semibold`}>
                          {char.name}
                        </span>
                      </div>
                    </div>

                    {/* Host / AI Icon */}
                    <div className="flex items-center gap-1">
                      {player.isHost && (
                        <span className="p-1 rounded bg-[#C99738]/20 text-[#D4AF37] border border-[#C99738]/40" title="Case Host">
                          <Crown className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {player.isAi && (
                        <span className="p-1 rounded bg-[#2A1B12] text-[#BAAFA1] border border-[#4A3322]" title="AI Detective">
                          <Bot className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {isHost && !player.isHost && (
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            onRemovePlayer(player.id);
                          }}
                          className="p-1 rounded hover:bg-[#9B2226]/20 text-[#BAAFA1] hover:text-[#D9383A] transition-colors cursor-pointer"
                          title="Dismiss Detective"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Character Bio snippet */}
                  <p className="text-[11px] text-[#BAAFA1] line-clamp-2 mb-3 font-sans">
                    {char.bio}
                  </p>

                  {/* Ready Status */}
                  <div className="border-t border-[#4A3322]/60 pt-2 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#BAAFA1] font-typewriter uppercase">
                      Status
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-typewriter uppercase flex items-center gap-1 ${
                      player.isReady || player.isAi
                        ? 'bg-[#2E7D5B]/20 text-[#2E7D5B] border border-[#2E7D5B]/40'
                        : 'bg-[#9B2226]/20 text-[#D9383A] border border-[#9B2226]/40'
                    }`}>
                      {player.isReady || player.isAi ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Ready</span>
                        </>
                      ) : (
                        <span>Not Ready</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, maxPlayers - players.length) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="p-4 rounded-xl border-2 border-dashed border-[#4A3322]/60 bg-[#120B07]/40 flex flex-col items-center justify-center text-center min-h-[140px]"
              >
                <span className="text-xs text-[#BAAFA1]/60 font-sans mb-2">
                  Awaiting Detective #{players.length + idx + 1}
                </span>
                {isHost && (
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onAddAiPlayer();
                    }}
                    className="px-2.5 py-1 rounded bg-[#2A1B12] hover:bg-[#3B281B] text-xs text-[#2E7D5B] border border-[#2E7D5B]/40 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Fill with AI</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Persona Switcher for Current User */}
        <div className="bg-[#1E140D] p-4 sm:p-5 rounded-2xl border-2 border-[#5A3E2B] mb-6">
          <h4 className="font-antique font-bold text-sm text-[#D4AF37] uppercase tracking-wider mb-3">
            Change Your Detective Persona
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {(Object.keys(CHARACTERS) as CharacterId[]).map((cId) => {
              const char = CHARACTERS[cId];
              const isClaimedByOther = players.some(p => p.characterId === cId && p.id !== currentUserId);
              const isSelected = currentPlayer?.characterId === cId;

              return (
                <button
                  key={cId}
                  type="button"
                  disabled={isClaimedByOther}
                  onClick={() => handleChangeCharacter(cId)}
                  className={`p-2 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1.5 ${
                    isClaimedByOther
                      ? 'bg-[#120B07]/40 border-[#3E291C]/40 opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#2A1B12] border-[#C99738] shadow-[0_0_12px_rgba(201,151,56,0.35)] scale-[1.03] cursor-pointer'
                      : 'bg-[#120B07] border-[#4A3322] hover:border-[#785822] cursor-pointer'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#5A3E2B] shadow bg-[#1E140D]">
                    {char.imageUrl ? (
                      <img
                        src={char.imageUrl}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: char.color }}
                      />
                    )}
                  </div>
                  <span className="text-[11px] font-antique font-bold truncate w-full text-[#F7EFE2]">
                    {char.name.split(' ')[1] || char.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The 3-Tab Estate Archive Showcase (Rooms, Suspects, Weapons) */}
        <div className="bg-[#1E140D] p-4 sm:p-5 rounded-2xl border-2 border-[#5A3E2B] mb-6">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#4A3322]">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="font-antique font-bold text-base text-[#F7EFE2] tracking-wide">
                  The Blackwood Bungalow Inquest Archive
                </h4>
              </div>
              <p className="text-xs text-[#BAAFA1] font-sans mt-0.5">
                Examine the 9 crime scenes, 6 suspects, and 6 deadly weapons before the mystery unfolds
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#120B07] p-1 rounded-xl border border-[#4A3322]">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('rooms');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-antique font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'rooms'
                    ? 'bg-[#C99738] text-[#120B07] shadow'
                    : 'text-[#BAAFA1] hover:text-[#F7EFE2]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>9 Rooms</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('suspects');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-antique font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'suspects'
                    ? 'bg-[#C99738] text-[#120B07] shadow'
                    : 'text-[#BAAFA1] hover:text-[#F7EFE2]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>6 Suspects</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('weapons');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-antique font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'weapons'
                    ? 'bg-[#C99738] text-[#120B07] shadow'
                    : 'text-[#BAAFA1] hover:text-[#F7EFE2]'
                }`}
              >
                <Sword className="w-3.5 h-3.5" />
                <span>6 Weapons</span>
              </button>
            </div>
          </div>

          {/* TAB 1: 9 ROOMS */}
          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {roomList.map((room) => (
                <div
                  key={room.id}
                  id={`lobby-room-card-${room.id}`}
                  onClick={() => {
                    playClickSound();
                    setInspectedRoom(room);
                  }}
                  className="group bg-[#120B07] border-2 border-[#4A3322] hover:border-[#C99738] rounded-xl overflow-hidden shadow-lg hover:shadow-[0_4px_20px_rgba(201,151,56,0.3)] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1E140D]">
                    {room.imageUrl ? (
                      <img
                        src={room.imageUrl}
                        alt={room.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1E140D] text-[#BAAFA1]">
                        <MapPin className="w-6 h-6" />
                      </div>
                    )}

                    {/* Secret Passage Badge */}
                    {room.secretPassageTo && (
                      <span className="absolute top-2 right-2 bg-[#9B2226] text-[#F7EFE2] text-[10px] font-typewriter font-bold px-2 py-0.5 rounded border border-[#D4AF37]/50 shadow">
                        Secret Passage ⇄ {ROOMS[room.secretPassageTo]?.name}
                      </span>
                    )}

                    {/* Room Name Badge */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="font-antique font-bold text-sm text-[#F7EFE2] drop-shadow-md bg-[#120B07]/90 px-2.5 py-1 rounded-lg border border-[#785822]">
                        {room.name}
                      </span>
                      <span className="p-1 rounded-full bg-[#120B07]/90 text-[#D4AF37] border border-[#785822] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1 bg-[#1A1009]">
                    <p className="text-[11px] text-[#BAAFA1] line-clamp-2 mb-2 font-sans">
                      {room.description}
                    </p>

                    <div className="pt-2 border-t border-[#4A3322]/50 flex items-center justify-between text-[10px]">
                      <span className="text-[#BAAFA1] font-sans truncate italic">
                        "{room.ambientText}"
                      </span>
                      <span className="text-[#D4AF37] font-typewriter font-semibold shrink-0 ml-1">
                        {room.doors.length} Doors
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: 6 SUSPECTS */}
          {activeTab === 'suspects' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {Object.values(CHARACTERS).map((suspect) => (
                <div
                  key={suspect.id}
                  id={`lobby-suspect-card-${suspect.id}`}
                  onClick={() => {
                    playClickSound();
                    setInspectedCharacter(suspect);
                  }}
                  className="group bg-[#120B07] border-2 border-[#4A3322] hover:border-[#E63946] rounded-xl overflow-hidden shadow-lg hover:shadow-[0_4px_20px_rgba(230,57,70,0.3)] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1E140D]">
                    {suspect.imageUrl ? (
                      <img
                        src={suspect.imageUrl}
                        alt={suspect.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: suspect.color }}>
                        {suspect.name[0]}
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="font-antique font-bold text-sm text-[#F7EFE2] drop-shadow-md bg-[#120B07]/90 px-2.5 py-1 rounded-lg border border-[#785822]">
                        {suspect.name}
                      </span>
                      <span className="p-1 rounded-full bg-[#120B07]/90 text-[#D4AF37] border border-[#785822] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1 bg-[#1A1009]">
                    <p className="text-[11px] text-[#BAAFA1] line-clamp-2 mb-2 font-sans">
                      {suspect.bio}
                    </p>

                    <div className="pt-2 border-t border-[#4A3322]/50 flex items-center justify-between text-[10px]">
                      <span className="text-[#D4AF37] font-typewriter uppercase">
                        Starting Room: {ROOMS[suspect.startingRoom]?.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: 6 WEAPONS */}
          {activeTab === 'weapons' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {Object.values(WEAPONS).map((weapon) => (
                <div
                  key={weapon.id}
                  id={`lobby-weapon-card-${weapon.id}`}
                  onClick={() => {
                    playClickSound();
                    setInspectedWeapon(weapon);
                  }}
                  className="group bg-[#120B07] border-2 border-[#4A3322] hover:border-[#C99738] rounded-xl overflow-hidden shadow-lg hover:shadow-[0_4px_20px_rgba(201,151,56,0.3)] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1E140D]">
                    {weapon.imageUrl ? (
                      <img
                        src={weapon.imageUrl}
                        alt={weapon.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#D4AF37]">
                        ⚔
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="font-antique font-bold text-sm text-[#F7EFE2] drop-shadow-md bg-[#120B07]/90 px-2.5 py-1 rounded-lg border border-[#785822]">
                        {weapon.name}
                      </span>
                      <span className="p-1 rounded-full bg-[#120B07]/90 text-[#D4AF37] border border-[#785822] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1 bg-[#1A1009]">
                    <p className="text-[11px] text-[#BAAFA1] line-clamp-2 mb-2 font-sans">
                      {weapon.description}
                    </p>

                    <div className="pt-2 border-t border-[#4A3322]/50 flex items-center justify-between text-[10px]">
                      <span className="text-[#D4AF37] font-typewriter uppercase">
                        Murder Instrument
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#4A3322] pt-5 gap-4">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onLeaveLobby();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#120B07] hover:bg-[#2A1B12] text-[#BAAFA1] border border-[#4A3322] text-xs font-sans font-medium cursor-pointer"
          >
            Leave Parlor
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Toggle Ready for non-host */}
            <button
              type="button"
              id="btn-lobby-toggle-ready"
              onClick={handleToggleReady}
              className={`px-5 py-3 rounded-xl border text-xs sm:text-sm font-bold font-antique transition-all flex items-center justify-center gap-2 cursor-pointer ${
                currentPlayer?.isReady
                  ? 'bg-[#2E7D5B]/20 text-[#2E7D5B] border-[#2E7D5B]'
                  : 'bg-[#2A1B12] text-[#F7EFE2] border-[#5A3E2B] hover:border-[#C99738]'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{currentPlayer?.isReady ? 'READY TO INVESTIGATE' : 'SET READY'}</span>
            </button>

            {/* Host Start Case CTA */}
            {isHost && (
              <button
                type="button"
                id="btn-start-case"
                disabled={!canStart}
                onClick={() => {
                  playClickSound();
                  onStartGame();
                }}
                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 font-antique tracking-wider uppercase border border-[#D4AF37]/40 ${
                  canStart
                    ? 'bg-[#9B2226] hover:bg-[#7E1A1E] text-[#F7EFE2] shadow-[0_0_20px_rgba(155,34,38,0.45)] cursor-pointer'
                    : 'bg-[#3E291C] text-[#BAAFA1] opacity-50 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START CASE {players.length < 3 ? '(MIN 3 DETECTIVES)' : ''}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lobby Parlor Chat Drawer / Floating Widget */}
      {onSendMessage && (
        <ParlorChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          players={players}
          currentUserId={currentUserId}
          isOpen={isChatOpen}
          onToggleOpen={() => setIsChatOpen(prev => !prev)}
          roomName={roomName}
        />
      )}

      {/* Crime Scene Room Inspection Lightbox */}
      {inspectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div 
            id="modal-inspected-room"
            className="bg-[#1E140D] border-2 border-[#C99738] rounded-2xl max-w-2xl w-full overflow-hidden shadow-[0_0_50px_rgba(201,151,56,0.3)] relative flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#4A3322] bg-[#120B07]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C99738]" />
                <h3 className="font-antique font-bold text-xl text-[#F7EFE2]">
                  {inspectedRoom.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setInspectedRoom(null);
                }}
                className="p-1.5 rounded-lg bg-[#2A1B12] hover:bg-[#3B281B] text-[#BAAFA1] hover:text-[#F7EFE2] border border-[#5A3E2B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Room Large Artwork */}
            <div className="relative aspect-[16/10] w-full bg-[#120B07] overflow-hidden">
              {inspectedRoom.imageUrl ? (
                <img
                  src={inspectedRoom.imageUrl}
                  alt={inspectedRoom.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#BAAFA1]">
                  <MapPin className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E140D] via-transparent to-transparent pointer-events-none" />

              {inspectedRoom.secretPassageTo && (
                <div className="absolute top-3 right-3 bg-[#9B2226] text-[#F7EFE2] text-xs font-typewriter font-bold px-3 py-1 rounded-lg border border-[#D4AF37] shadow-lg">
                  Secret Passage to {ROOMS[inspectedRoom.secretPassageTo]?.name}
                </div>
              )}
            </div>

            {/* Modal Body & Clues */}
            <div className="p-5 space-y-4 bg-[#1E140D]">
              <div>
                <span className="text-[10px] font-typewriter uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Crime Scene Dossier
                </span>
                <p className="text-sm text-[#F7EFE2] font-sans leading-relaxed">
                  {inspectedRoom.description}
                </p>
              </div>

              <div className="bg-[#120B07] p-3.5 rounded-xl border border-[#4A3322] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-typewriter text-[#BAAFA1] uppercase">Atmospheric Clue</span>
                  <span className="text-[#C99738] font-antique italic font-semibold">
                    "{inspectedRoom.ambientText}"
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#3E291C]">
                  <span className="font-typewriter text-[#BAAFA1] uppercase">Passageway Doors</span>
                  <span className="text-[#F7EFE2] font-sans">
                    Connects to {inspectedRoom.doors.map(dId => ROOMS[dId as any]?.name || dId).join(', ')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setInspectedRoom(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#2A1B12] hover:bg-[#3B281B] text-[#D4AF37] border border-[#785822] font-antique font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                Close Room Examination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspect Persona Inspection Lightbox */}
      {inspectedCharacter && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div 
            id="modal-inspected-character"
            className="bg-[#1E140D] border-2 border-[#E63946] rounded-2xl max-w-xl w-full overflow-hidden shadow-[0_0_50px_rgba(230,57,70,0.3)] relative flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#4A3322] bg-[#120B07]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />
                <h3 className="font-antique font-bold text-xl text-[#F7EFE2]">
                  {inspectedCharacter.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setInspectedCharacter(null);
                }}
                className="p-1.5 rounded-lg bg-[#2A1B12] hover:bg-[#3B281B] text-[#BAAFA1] hover:text-[#F7EFE2] border border-[#5A3E2B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full bg-[#120B07] overflow-hidden">
              {inspectedCharacter.imageUrl ? (
                <img
                  src={inspectedCharacter.imageUrl}
                  alt={inspectedCharacter.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold" style={{ backgroundColor: inspectedCharacter.color }}>
                  {inspectedCharacter.name[0]}
                </div>
              )}
            </div>

            <div className="p-5 space-y-4 bg-[#1E140D]">
              <div>
                <span className="text-[10px] font-typewriter uppercase tracking-wider text-[#E63946] block mb-1">
                  Suspect Dossier & Motives
                </span>
                <p className="text-sm text-[#F7EFE2] font-sans leading-relaxed">
                  {inspectedCharacter.bio}
                </p>
              </div>

              <div className="bg-[#120B07] p-3.5 rounded-xl border border-[#4A3322] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-typewriter text-[#BAAFA1] uppercase">Starting Room</span>
                  <span className="text-[#D4AF37] font-antique font-semibold">
                    {ROOMS[inspectedCharacter.startingRoom]?.name}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setInspectedCharacter(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#2A1B12] hover:bg-[#3B281B] text-[#D4AF37] border border-[#785822] font-antique font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weapon Inspection Lightbox */}
      {inspectedWeapon && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div 
            id="modal-inspected-weapon"
            className="bg-[#1E140D] border-2 border-[#C99738] rounded-2xl max-w-xl w-full overflow-hidden shadow-[0_0_50px_rgba(201,151,56,0.3)] relative flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#4A3322] bg-[#120B07]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C99738]" />
                <h3 className="font-antique font-bold text-xl text-[#F7EFE2]">
                  {inspectedWeapon.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setInspectedWeapon(null);
                }}
                className="p-1.5 rounded-lg bg-[#2A1B12] hover:bg-[#3B281B] text-[#BAAFA1] hover:text-[#F7EFE2] border border-[#5A3E2B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full bg-[#120B07] overflow-hidden">
              {inspectedWeapon.imageUrl ? (
                <img
                  src={inspectedWeapon.imageUrl}
                  alt={inspectedWeapon.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#D4AF37]">
                  ⚔
                </div>
              )}
            </div>

            <div className="p-5 space-y-4 bg-[#1E140D]">
              <div>
                <span className="text-[10px] font-typewriter uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Coroner's Forensic Notes
                </span>
                <p className="text-sm text-[#F7EFE2] font-sans leading-relaxed">
                  {inspectedWeapon.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setInspectedWeapon(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#2A1B12] hover:bg-[#3B281B] text-[#D4AF37] border border-[#785822] font-antique font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                Close Examination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How to Play Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
};

