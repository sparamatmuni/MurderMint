import React from 'react';
import { RoomId, Player, CharacterId } from '../types';
import { ROOMS, CHARACTERS } from '../data/gameData';
import { PlayerToken } from './PlayerAvatar';
import { 
  Utensils, 
  Music, 
  Flower2, 
  Coffee, 
  CircleDot, 
  Book, 
  Armchair, 
  Landmark, 
  Scroll, 
  Compass, 
  KeyRound, 
  Sparkles,
  Footprints
} from 'lucide-react';
import { playMoveSound } from '../utils/sound';

interface MansionBoardProps {
  players: Player[];
  activePlayerId: string;
  reachableRooms: RoomId[];
  isMovingPhase: boolean;
  isRollingPhase?: boolean;
  isRoomActionsPhase?: boolean;
  isMyTurn?: boolean;
  diceRoll?: number | null;
  onRollDice?: () => void;
  onSelectRoom: (roomId: RoomId) => void;
  onOpenSuggest?: () => void;
  onOpenAccuse?: () => void;
  onEndTurn?: () => void;
  hasSuggestedThisTurn?: boolean;
  selectedRoom: RoomId | null;
  allowSecretPassages?: boolean;
}

export const MansionBoard: React.FC<MansionBoardProps> = ({
  players,
  activePlayerId,
  reachableRooms,
  isMovingPhase,
  isRollingPhase = false,
  isRoomActionsPhase = false,
  isMyTurn = false,
  diceRoll = null,
  onRollDice,
  onSelectRoom,
  onOpenSuggest,
  onOpenAccuse,
  onEndTurn,
  hasSuggestedThisTurn = false,
  selectedRoom,
  allowSecretPassages = true,
}) => {
  const activePlayer = players.find(p => p.id === activePlayerId);

  const getRoomIcon = (roomId: RoomId, className = 'w-5 h-5') => {
    switch (roomId) {
      case 'kitchen': return <Utensils className={className} />;
      case 'ballroom': return <Music className={className} />;
      case 'conservatory': return <Flower2 className={className} />;
      case 'dining_room': return <Coffee className={className} />;
      case 'billiard_room': return <CircleDot className={className} />;
      case 'library': return <Book className={className} />;
      case 'lounge': return <Armchair className={className} />;
      case 'hall': return <Landmark className={className} />;
      case 'study': return <Scroll className={className} />;
    }
  };

  const getPlayersInRoom = (roomId: RoomId): Player[] => {
    return players.filter(p => p.position === roomId);
  };

  const handleRoomClick = (roomId: RoomId) => {
    if (!isMovingPhase) return;
    if (reachableRooms.includes(roomId)) {
      playMoveSound();
      onSelectRoom(roomId);
    }
  };

  // Group rooms into 3x3 layout
  const roomGrid: RoomId[][] = [
    ['kitchen', 'ballroom', 'conservatory'],
    ['dining_room', 'billiard_room', 'library'],
    ['lounge', 'hall', 'study'],
  ];

  return (
    <div className="relative w-full aspect-square max-w-[620px] mx-auto p-3 sm:p-4 bg-[#1F1B24] border-2 border-[#3A3340] rounded-2xl shadow-2xl flex flex-col justify-between select-none bg-blueprint overflow-hidden">
      {/* Header Bar with Blueprint Title & Real-time Turn Direction */}
      <div className="flex items-center justify-between z-10 px-1">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#C9A24B] tracking-wider uppercase font-bold">
          <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#C9A24B]" />
          <span>BLACKWOOD MANOR FLOORPLAN</span>
        </div>

        {/* Dynamic Turn Banner for Instant Clarity */}
        {isMyTurn ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5273B]/25 text-[#F3EDE4] border border-[#B5273B] text-[10px] font-mono animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5273B]" />
            <span className="font-bold">YOUR TURN</span>
            {isRollingPhase && <span className="text-[#C9A24B]">• Roll Dice</span>}
            {isMovingPhase && <span className="text-[#2FBF8F]">• Rolled {diceRoll}: Choose Room</span>}
            {isRoomActionsPhase && <span className="text-[#9A93A6]">• Room Actions</span>}
          </div>
        ) : (
          <div className="text-[10px] font-mono text-[#9A93A6] flex items-center gap-1">
            <span>Investigator:</span>
            <span className="text-[#F3EDE4] font-bold">{activePlayer?.name}</span>
          </div>
        )}
      </div>

      {/* Mansion 3x3 Blueprint Grid */}
      <div className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 w-full flex-1 my-2">
        {roomGrid.map((row, rIdx) =>
          row.map((roomId, cIdx) => {
            const room = ROOMS[roomId];
            const isReachable = isMovingPhase && reachableRooms.includes(roomId);
            const isCurrentRoom = activePlayer?.position === roomId;
            const isSelected = selectedRoom === roomId;
            const playersInRoom = getPlayersInRoom(roomId);
            const hasSecretPassage = allowSecretPassages && !!room.secretPassageTo;
            const isPassageDestination = 
              hasSecretPassage && 
              activePlayer && 
              ROOMS[activePlayer.position]?.secretPassageTo === roomId;

            return (
              <div
                key={roomId}
                id={`room-card-${roomId}`}
                onClick={() => handleRoomClick(roomId)}
                className={`relative rounded-xl border-2 transition-all duration-300 p-2 sm:p-2.5 flex flex-col justify-between overflow-hidden group ${
                  isCurrentRoom
                    ? 'border-[#C9A24B] bg-[#2A2430]/95 shadow-[0_0_15px_rgba(201,162,75,0.3)] ring-1 ring-[#C9A24B]/50'
                    : isReachable
                    ? 'border-[#2FBF8F] bg-[#2FBF8F]/15 hover:bg-[#2FBF8F]/25 cursor-pointer shadow-[0_0_16px_rgba(47,191,143,0.4)] animate-pulse-gold scale-[1.02]'
                    : isSelected
                    ? 'border-[#C9A24B] bg-[#C9A24B]/20 scale-[1.02]'
                    : 'border-[#3A3340] bg-[#141118]/80 hover:border-[#3A3340]/80'
                }`}
              >
                {/* Room Artwork Background with Dark Atmospheric Overlay */}
                {room.imageUrl && (
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141118] via-[#141118]/80 to-transparent pointer-events-none" />

                {/* Header: Room Name & Icon */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className={`p-1 rounded bg-[#1F1B24] border ${
                      isCurrentRoom 
                        ? 'border-[#C9A24B] text-[#C9A24B]' 
                        : isReachable 
                        ? 'border-[#2FBF8F] text-[#2FBF8F]' 
                        : 'border-[#3A3340] text-[#9A93A6]'
                    }`}>
                      {getRoomIcon(roomId, 'w-3.5 h-3.5 sm:w-4 sm:h-4')}
                    </div>
                    <div>
                      <h4 className="font-cormorant font-bold text-xs sm:text-sm text-[#F3EDE4] leading-tight group-hover:text-[#C9A24B] transition-colors">
                        {room.name}
                      </h4>
                      {isCurrentRoom && (
                        <span className="text-[9px] font-mono text-[#C9A24B] flex items-center gap-1 font-bold">
                          • Current Room
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Secret Passage Badge */}
                  {hasSecretPassage && (
                    <div 
                      className={`p-1 rounded text-[9px] font-mono flex items-center gap-0.5 border ${
                        isPassageDestination 
                          ? 'bg-[#C9A24B]/20 text-[#C9A24B] border-[#C9A24B]' 
                          : 'bg-[#141118] text-[#9A93A6]/70 border-[#3A3340]'
                      }`}
                      title={`Secret Passage to ${ROOMS[room.secretPassageTo!].name}`}
                    >
                      <KeyRound className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">Passage</span>
                    </div>
                  )}
                </div>

                {/* Direct Action Overlay 1: ROLL DICE in Current Room */}
                {isCurrentRoom && isMyTurn && isRollingPhase && onRollDice && (
                  <div className="my-auto py-1 text-center relative z-20">
                    <button
                      id="btn-board-roll-dice"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRollDice();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A24B] hover:bg-[#B08B3A] text-[#141118] text-xs font-bold shadow-[0_0_15px_rgba(201,162,75,0.6)] transition-transform hover:scale-105 active:scale-95 cursor-pointer font-dm animate-bounce"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#141118]" />
                      <span>ROLL DICE</span>
                    </button>
                  </div>
                )}

                {/* Direct Action Overlay 2: Click to Enter Reachable Room */}
                {isReachable && (
                  <div className="my-auto py-1 text-center relative z-20">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2FBF8F] text-[#141118] text-[11px] font-bold shadow-md animate-bounce cursor-pointer">
                      <Footprints className="w-3.5 h-3.5" />
                      <span>Enter Room</span>
                    </span>
                  </div>
                )}

                {/* Direct Action Overlay 3: Room Actions in Current Room */}
                {isCurrentRoom && isMyTurn && isRoomActionsPhase && (
                  <div className="my-auto py-0.5 flex flex-wrap gap-1 items-center justify-center relative z-20">
                    {!hasSuggestedThisTurn && onOpenSuggest && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSuggest();
                        }}
                        className="px-2 py-1 rounded bg-[#2FBF8F] hover:bg-[#269E76] text-[#141118] text-[10px] font-bold shadow transition-transform hover:scale-105 cursor-pointer font-dm flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Suggest</span>
                      </button>
                    )}
                    {onOpenAccuse && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAccuse();
                        }}
                        className="px-2 py-1 rounded bg-[#B5273B] hover:bg-[#9E1F32] text-[#F3EDE4] text-[10px] font-bold shadow transition-transform hover:scale-105 cursor-pointer font-dm flex items-center gap-1"
                      >
                        <span>Accuse</span>
                      </button>
                    )}
                    {onEndTurn && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEndTurn();
                        }}
                        className="px-2 py-1 rounded bg-[#3A3340] hover:bg-[#4A4350] text-[#F3EDE4] text-[10px] font-medium transition-colors cursor-pointer font-dm"
                      >
                        <span>End Turn</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Bottom: Player Tokens Present in Room */}
                <div className="relative z-10 flex items-center justify-between mt-auto pt-1 border-t border-[#3A3340]/40">
                  <div className="flex items-center -space-x-1.5 overflow-hidden py-0.5">
                    {playersInRoom.map(p => (
                      <PlayerToken
                        key={p.id}
                        characterId={p.characterId}
                        isCurrent={p.id === activePlayerId}
                        label={`${p.name} (${CHARACTERS[p.characterId].name})`}
                      />
                    ))}
                    {playersInRoom.length === 0 && (
                      <span className="text-[9px] text-[#9A93A6]/40 italic font-dm">
                        Empty room
                      </span>
                    )}
                  </div>

                  <span className="text-[8px] font-mono text-[#9A93A6]/40 uppercase">
                    R{rIdx}C{cIdx}
                  </span>
                </div>

                {/* Outer frame accents */}
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-[#C9A24B]/30" />
                <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-[#C9A24B]/30" />
                <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-[#C9A24B]/30" />
                <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-[#C9A24B]/30" />
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Board Footer with Compass & Secret Passage Guide */}
      <div className="mt-2.5 pt-2 border-t border-[#3A3340]/60 flex items-center justify-between text-[10px] text-[#9A93A6]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#C9A24B]" />
            Active Location
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#2FBF8F]" />
            Reachable Room
          </span>
        </div>

        <div className="text-[10px] text-[#C9A24B]/80 font-mono flex items-center gap-1">
          <span>Kitchen ⇄ Study</span>
          <span>•</span>
          <span>Conservatory ⇄ Lounge</span>
        </div>
      </div>
    </div>
  );
};
