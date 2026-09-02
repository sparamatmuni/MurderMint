import React, { useState } from 'react';
import { CharacterId, Player } from '../types';
import { CHARACTERS } from '../data/gameData';
import { Users, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { generateUniqueId } from '../utils/gameLogic';
import { AmbientAudioWidget } from '../components/AmbientAudioWidget';

interface JoinGameViewProps {
  onJoinSuccess: (roomCode: string, joiningPlayer: Player) => void;
  onBackToLanding: () => void;
  initialRoomCode?: string;
  claimedCharacters?: CharacterId[];
}

export const JoinGameView: React.FC<JoinGameViewProps> = ({
  onJoinSuccess,
  onBackToLanding,
  initialRoomCode = '',
  claimedCharacters = [],
}) => {
  const [roomCode, setRoomCode] = useState(initialRoomCode || 'MM-4827');
  const [detectiveName, setDetectiveName] = useState('Inspector Thorne');
  
  // Pick first available character
  const availableCharacters = (Object.keys(CHARACTERS) as CharacterId[]).filter(
    id => !claimedCharacters.includes(id)
  );
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>(
    availableCharacters[0] || 'mustard'
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    playClickSound();

    const joiningPlayer: Player = {
      id: generateUniqueId('player-detective'),
      name: detectiveName.trim() || 'Detective',
      characterId: selectedCharacter,
      isHost: false,
      isAi: false,
      isReady: true,
      position: CHARACTERS[selectedCharacter].startingRoom,
      hand: [],
      hasAccused: false,
      outOfGame: false,
    };

    onJoinSuccess(roomCode.trim().toUpperCase(), joiningPlayer);
  };

  return (
    <div className="min-h-screen bg-[#120B07] text-[#F7EFE2] py-8 px-4 flex flex-col justify-center items-center bg-blueprint">
      <div className="w-full max-w-lg bg-[#1E140D] border-2 border-[#5A3E2B] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] p-6 sm:p-8 relative">
        {/* Back Link & Ambient Audio Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onBackToLanding();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#BAAFA1] hover:text-[#F7EFE2] font-antique transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Entrance</span>
          </button>

          <AmbientAudioWidget variant="compact" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between border-b border-[#4A3322] pb-4 mb-6">
          <div>
            <h2 className="font-antique font-bold text-2xl sm:text-3xl text-[#F7EFE2] tracking-wide">
              Join Bungalow Inquiry
            </h2>
            <p className="text-xs text-[#BAAFA1] font-sans">
              Enter the room key provided by the case host
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#2A1B12] border border-[#2E7D5B] text-[#2E7D5B] flex items-center justify-center shadow">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <form onSubmit={handleJoin} className="space-y-5">
          {/* Room Code Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5 font-antique">
              Case Room Key
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. MM-4827"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full bg-[#120B07] border border-[#4A3322] focus:border-[#C99738] rounded-xl px-4 py-3 text-base text-[#D4AF37] font-typewriter tracking-widest uppercase outline-none"
              />
              <KeyRound className="w-4 h-4 text-[#BAAFA1] absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Detective Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5 font-antique">
              Detective Name
            </label>
            <input
              type="text"
              required
              value={detectiveName}
              onChange={(e) => setDetectiveName(e.target.value)}
              placeholder="e.g. Inspector Thorne"
              className="w-full bg-[#120B07] border border-[#4A3322] focus:border-[#C99738] rounded-xl px-3.5 py-2.5 text-sm text-[#F7EFE2] outline-none font-sans"
            />
          </div>

          {/* Select Character */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2 font-antique">
              Select Character Persona
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(CHARACTERS) as CharacterId[]).map((cId) => {
                const char = CHARACTERS[cId];
                const isClaimed = claimedCharacters.includes(cId);
                const isSelected = selectedCharacter === cId;

                return (
                  <button
                    key={cId}
                    type="button"
                    disabled={isClaimed}
                    onClick={() => {
                      playClickSound();
                      setSelectedCharacter(cId);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      isClaimed
                        ? 'bg-[#120B07]/50 border-[#4A3322]/40 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#2A1B12] border-[#C99738] shadow-[0_0_12px_rgba(201,151,56,0.3)] cursor-pointer'
                        : 'bg-[#120B07] border-[#4A3322] hover:border-[#785822] cursor-pointer'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-[#120B07] flex items-center justify-center font-bold text-xs shrink-0"
                      style={{
                        backgroundColor: char.color,
                        color: char.id === 'white' ? '#120B07' : '#F7EFE2',
                      }}
                    >
                      {char.name[0]}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-antique font-bold truncate block text-[#F7EFE2]">
                        {char.name}
                      </span>
                      {isClaimed && (
                        <span className="text-[9px] text-[#9B2226] font-typewriter block">Claimed</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-3">
            <button
              id="btn-submit-join-case"
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#2E7D5B] hover:bg-[#236348] text-[#F7EFE2] font-bold text-sm shadow-xl shadow-[0_0_20px_rgba(46,125,91,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase font-antique tracking-wider border border-[#D4AF37]/40"
            >
              <span>JOIN PARLOR INQUIRY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
