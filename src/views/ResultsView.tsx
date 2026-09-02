import React, { useEffect } from 'react';
import { GameState } from '../types';
import { ALL_CARDS, CHARACTERS, ROOMS, WEAPONS } from '../data/gameData';
import { EvidenceCard } from '../components/EvidenceCard';
import { 
  Sparkles, 
  RotateCcw, 
  ArrowLeft, 
  Crown, 
  Skull, 
  ShieldCheck, 
  History,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playVictorySound } from '../utils/sound';

interface ResultsViewProps {
  state: GameState;
  onRematch: () => void;
  onReturnToLobby: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  state,
  onRematch,
  onReturnToLobby,
}) => {
  const { secretSolution, winnerId, isColdCase, players, suggestions, accusations } = state;

  const winner = players.find(p => p.id === winnerId);
  const winningChar = winner ? CHARACTERS[winner.characterId] : null;

  const suspectCard = ALL_CARDS.find(c => c.category === 'suspect' && c.rawId === secretSolution.suspect)!;
  const weaponCard = ALL_CARDS.find(c => c.category === 'weapon' && c.rawId === secretSolution.weapon)!;
  const roomCard = ALL_CARDS.find(c => c.category === 'room' && c.rawId === secretSolution.room)!;

  useEffect(() => {
    if (winner) {
      playVictorySound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C9A24B', '#2FBF8F', '#B5273B', '#F3EDE4'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [winner]);

  return (
    <div className="min-h-screen bg-[#120B07] text-[#F7EFE2] py-10 px-4 flex flex-col items-center justify-center bg-blueprint select-none">
      <div className="w-full max-w-3xl bg-[#1E140D] border-2 border-[#C99738] rounded-2xl shadow-[0_0_50px_rgba(201,151,56,0.35)] p-6 sm:p-10 flex flex-col items-center text-center animate-fade-in relative overflow-hidden">
        {/* Decorative Top Stamp */}
        <div className="mb-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120B07] border border-[#C99738]/60 text-[#D4AF37] text-xs font-typewriter tracking-widest uppercase shadow-md">
          <ShieldCheck className="w-4 h-4 text-[#2E7D5B]" />
          <span>OFFICIAL BUNGALOW INQUEST VERDICT</span>
        </div>

        {/* Case Closed Title */}
        <h1 className="font-antique font-black text-4xl sm:text-6xl text-[#F7EFE2] tracking-wider mb-2 drop-shadow-md">
          {isColdCase ? (
            <span className="text-[#9B2226]">CASE COLD</span>
          ) : (
            <>CASE <span className="text-[#2E7D5B]">SOLVED</span></>
          )}
        </h1>

        {/* Subtitle */}
        <p className="font-antique italic text-xl sm:text-2xl text-[#D4AF37] mb-8">
          {winner ? (
            <>Solved with distinction by <strong className="text-[#F7EFE2]">{winner.name}</strong> ({winningChar?.name})</>
          ) : (
            <>The culprit escaped into the estate gardens. The mystery remains unsolved.</>
          )}
        </p>

        {/* Revealed Evidence Cards Trio */}
        <div className="w-full mb-8">
          <span className="text-xs font-typewriter text-[#BAAFA1] uppercase tracking-widest block mb-4">
            Confidential Evidence Envelope Contents
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-[#9B2226] uppercase tracking-wider mb-2 font-antique">
                The Murderer
              </span>
              <EvidenceCard card={suspectCard} size="md" isRevealed={true} />
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-2 font-antique">
                The Weapon
              </span>
              <EvidenceCard card={weaponCard} size="md" isRevealed={true} />
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-[#2E7D5B] uppercase tracking-wider mb-2 font-antique">
                The Crime Scene
              </span>
              <EvidenceCard card={roomCard} size="md" isRevealed={true} />
            </div>
          </div>
        </div>

        {/* Case Statistics Summary */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-lg bg-[#120B07] p-4 rounded-xl border border-[#4A3322] mb-8 font-sans">
          <div className="text-center">
            <span className="text-[10px] text-[#BAAFA1] uppercase block font-antique">Total Turns</span>
            <span className="font-bold text-lg text-[#F7EFE2] font-typewriter">{state.turnNumber}</span>
          </div>
          <div className="text-center border-x border-[#4A3322]">
            <span className="text-[10px] text-[#BAAFA1] uppercase block font-antique">Suggestions</span>
            <span className="font-bold text-lg text-[#D4AF37] font-typewriter">{suggestions.length}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-[#BAAFA1] uppercase block font-antique">Accusations</span>
            <span className="font-bold text-lg text-[#2E7D5B] font-typewriter">{accusations.length}</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <button
            id="btn-results-rematch"
            type="button"
            onClick={() => {
              playClickSound();
              onRematch();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-[#2E7D5B] hover:bg-[#236348] text-[#F7EFE2] font-bold text-sm shadow-xl shadow-[0_0_20px_rgba(46,125,91,0.35)] transition-all flex items-center justify-center gap-2 font-antique uppercase tracking-wider cursor-pointer border border-[#D4AF37]/40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>COMMENCE REMATCH</span>
          </button>

          <button
            id="btn-results-return-lobby"
            type="button"
            onClick={() => {
              playClickSound();
              onReturnToLobby();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-[#2A1B12] hover:bg-[#3B281B] text-[#F7EFE2] border border-[#5A3E2B] font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 font-antique uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO PARLOR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
