import React, { useState } from 'react';
import { CharacterId, HouseRules, Player } from '../types';
import { CHARACTERS } from '../data/gameData';
import { generateRoomCode, generateUniqueId } from '../utils/gameLogic';
import { AmbientAudioWidget } from '../components/AmbientAudioWidget';
import { 
  KeyRound, 
  Users, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sliders, 
  Sparkles 
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface CreateGameViewProps {
  onEnterLobby: (
    roomCode: string,
    roomName: string,
    hostPlayer: Player,
    maxPlayers: number,
    houseRules: HouseRules
  ) => void;
  onBackToLanding: () => void;
}

export const CreateGameView: React.FC<CreateGameViewProps> = ({
  onEnterLobby,
  onBackToLanding,
}) => {
  const [roomName, setRoomName] = useState('The Blackwood Manor Mystery');
  const [detectiveName, setDetectiveName] = useState('Chief Inspector Sterling');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('scarlet');
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [roomCode] = useState<string>(() => generateRoomCode());
  const [copied, setCopied] = useState(false);

  // House Rules
  const [secretPassages, setSecretPassages] = useState(true);
  const [autoNotes, setAutoNotes] = useState(true);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'detective'>('detective');

  const handleCopyCode = () => {
    playClickSound();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAndEnter = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    const hostPlayer: Player = {
      id: generateUniqueId('player-host'),
      name: detectiveName.trim() || 'Chief Inspector',
      characterId: selectedCharacter,
      isHost: true,
      isAi: false,
      isReady: true,
      position: CHARACTERS[selectedCharacter].startingRoom,
      hand: [],
      hasAccused: false,
      outOfGame: false,
    };

    const rules: HouseRules = {
      secretPassages,
      autoNotes,
      aiDifficulty,
      diceCount: 1,
    };

    onEnterLobby(roomCode, roomName, hostPlayer, maxPlayers, rules);
  };

  return (
    <div className="min-h-screen bg-[#120B07] text-[#F7EFE2] py-8 px-4 flex flex-col justify-center items-center bg-blueprint">
      <div className="w-full max-w-xl bg-[#1E140D] border-2 border-[#5A3E2B] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] p-6 sm:p-8 relative">
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
              Commission a Bungalow Case
            </h2>
            <p className="text-xs text-[#BAAFA1] font-sans">
              Configure your murder mystery room and invite detectives
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#2A1B12] border border-[#785822] text-[#D4AF37] flex items-center justify-center shadow">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>

        <form onSubmit={handleCreateAndEnter} className="space-y-5">
          {/* Room Code Badge */}
          <div className="bg-[#120B07] border border-[#785822] rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-typewriter text-[#BAAFA1] uppercase tracking-wider block">
                Generated Bungalow Key
              </span>
              <span className="font-typewriter text-xl font-bold text-[#D4AF37] tracking-wider">
                {roomCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-[#2A1B12] hover:bg-[#3B281B] text-[#F7EFE2] border border-[#5A3E2B] text-xs font-antique flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2E7D5B]" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
              <span>{copied ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>

          {/* Room Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5 font-antique">
              Case Name
            </label>
            <input
              type="text"
              required
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full bg-[#120B07] border border-[#4A3322] focus:border-[#C99738] rounded-xl px-3.5 py-2.5 text-sm text-[#F7EFE2] outline-none font-sans"
            />
          </div>

          {/* Detective Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5 font-antique">
              Your Detective Persona
            </label>
            <input
              type="text"
              required
              value={detectiveName}
              onChange={(e) => setDetectiveName(e.target.value)}
              placeholder="e.g. Inspector Sterling"
              className="w-full bg-[#120B07] border border-[#4A3322] focus:border-[#C99738] rounded-xl px-3.5 py-2.5 text-sm text-[#F7EFE2] outline-none font-sans"
            />
          </div>

          {/* Choose Character */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2 font-antique">
              Select Character
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(CHARACTERS) as CharacterId[]).map((cId) => {
                const char = CHARACTERS[cId];
                const isSelected = selectedCharacter === cId;

                return (
                  <button
                    key={cId}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedCharacter(cId);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2A1B12] border-[#C99738] shadow-[0_0_12px_rgba(201,151,56,0.3)]'
                        : 'bg-[#120B07] border-[#4A3322] hover:border-[#785822]'
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
                    <span className="text-xs font-antique font-bold truncate text-[#F7EFE2]">
                      {char.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player Count & House Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5 font-antique">
                Player Capacity (3–6)
              </label>
              <div className="flex items-center gap-2">
                {[3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMaxPlayers(num)}
                    className={`flex-1 py-2 rounded-lg text-xs font-typewriter font-bold border transition-colors cursor-pointer ${
                      maxPlayers === num
                        ? 'bg-[#2A1B12] text-[#D4AF37] border-[#C99738]'
                        : 'bg-[#120B07] text-[#BAAFA1] border-[#4A3322] hover:border-[#785822]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5 font-antique">
                AI Sleuth Level
              </label>
              <select
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value as any)}
                className="w-full bg-[#120B07] border border-[#4A3322] rounded-lg px-3 py-2 text-xs text-[#F7EFE2] outline-none font-sans"
              >
                <option value="detective">Cunning Detective</option>
                <option value="medium">Standard Investigator</option>
                <option value="easy">Novice Apprentice</option>
              </select>
            </div>
          </div>

          {/* House Rules Toggles */}
          <div className="bg-[#120B07] p-3 rounded-xl border border-[#4A3322] space-y-2 text-xs">
            <label className="flex items-center gap-2 text-[#F7EFE2] cursor-pointer">
              <input
                type="checkbox"
                checked={secretPassages}
                onChange={(e) => setSecretPassages(e.target.checked)}
                className="w-4 h-4 rounded bg-[#1E140D] border-[#4A3322] text-[#C99738] focus:ring-[#C99738]"
              />
              <span className="font-sans">Enable Veranda Secret Passages (Kitchen ⇄ Study, etc.)</span>
            </label>
            <label className="flex items-center gap-2 text-[#F7EFE2] cursor-pointer">
              <input
                type="checkbox"
                checked={autoNotes}
                onChange={(e) => setAutoNotes(e.target.checked)}
                className="w-4 h-4 rounded bg-[#1E140D] border-[#4A3322] text-[#C99738] focus:ring-[#C99738]"
              />
              <span className="font-sans">Auto-record disproved evidence in Detective Notepad</span>
            </label>
          </div>

          {/* Submit CTA */}
          <div className="pt-3">
            <button
              id="btn-create-enter-lobby"
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#9B2226] hover:bg-[#7E1A1E] text-[#F7EFE2] font-bold text-sm shadow-xl shadow-[0_0_20px_rgba(155,34,38,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase font-antique tracking-wider border border-[#D4AF37]/40"
            >
              <span>ENTER CASE PARLOR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
