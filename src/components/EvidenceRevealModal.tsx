import React from 'react';
import { Suggestion } from '../types';
import { ALL_CARDS, CHARACTERS, ROOMS, WEAPONS } from '../data/gameData';
import { EvidenceCard } from './EvidenceCard';
import { Eye, ShieldCheck, HelpCircle, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';
import { playClickSound, playEvidenceRevealSound } from '../utils/sound';

interface EvidenceRevealModalProps {
  revealData: {
    suggestion: Suggestion;
    cardId?: string;
    disproverName?: string;
    noOneHadEvidence: boolean;
  } | null;
  onAcknowledge: (cardId?: string) => void;
  isCurrentPlayerSuggester: boolean;
}

export const EvidenceRevealModal: React.FC<EvidenceRevealModalProps> = ({
  revealData,
  onAcknowledge,
  isCurrentPlayerSuggester,
}) => {
  if (!revealData) return null;

  const { suggestion, cardId, disproverName, noOneHadEvidence } = revealData;
  const revealedCard = cardId ? ALL_CARDS.find(c => c.id === cardId) : null;

  const handleAcknowledge = () => {
    playClickSound();
    onAcknowledge(cardId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141118]/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-[#1F1B24] border-2 border-[#C9A24B] rounded-2xl w-full max-w-md shadow-[0_0_30px_rgba(201,162,75,0.3)] p-6 text-center text-[#F3EDE4] flex flex-col items-center">
        {/* Top Header Badge */}
        {noOneHadEvidence ? (
          <div className="w-12 h-12 rounded-full bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B] flex items-center justify-center mb-3 animate-pulse-gold">
            <Sparkles className="w-6 h-6" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#2FBF8F]/20 text-[#2FBF8F] border border-[#2FBF8F] flex items-center justify-center mb-3 animate-pulse">
            <Eye className="w-6 h-6" />
          </div>
        )}

        <h3 className="font-cormorant font-bold text-2xl tracking-wide mb-1 text-[#F3EDE4]">
          {noOneHadEvidence 
            ? 'THE ROOM FALLS SILENT...' 
            : isCurrentPlayerSuggester 
            ? 'CONFIDENTIAL EVIDENCE RECEIVED' 
            : 'EVIDENCE EXCHANGED'}
        </h3>

        <p className="text-xs text-[#9A93A6] mb-5 font-dm max-w-xs">
          {noOneHadEvidence
            ? `No detective in Blackwood Manor could disprove the hypothesis of ${CHARACTERS[suggestion.suspectId].name}, ${WEAPONS[suggestion.weaponId].name}, and ${ROOMS[suggestion.roomId].name}!`
            : isCurrentPlayerSuggester
            ? `${disproverName || 'Another detective'} secretly revealed the following private evidence card to you:`
            : `${disproverName || 'A detective'} secretly showed evidence to ${suggestion.suggesterName}.`}
        </p>

        {/* Revealed Evidence Card for Suggester */}
        {isCurrentPlayerSuggester && revealedCard && (
          <div className="my-2 transform hover:scale-105 transition-transform">
            <EvidenceCard card={revealedCard} size="md" isRevealed={true} />
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FBF8F]/15 text-[#2FBF8F] border border-[#2FBF8F]/40 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Marked as Ruled Out on your Notepad</span>
            </div>
          </div>
        )}

        {/* Other players see a confidential placeholder envelope */}
        {!isCurrentPlayerSuggester && !noOneHadEvidence && (
          <div className="my-3 p-4 rounded-xl bg-[#141118] border border-dashed border-[#3A3340] flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-[#C9A24B] mb-1 opacity-75" />
            <span className="text-xs font-mono text-[#9A93A6] uppercase tracking-wider">
              1 Private Card Shown to {suggestion.suggesterName}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          id="btn-acknowledge-evidence"
          type="button"
          onClick={handleAcknowledge}
          className="mt-6 w-full py-2.5 rounded-lg bg-[#C9A24B] hover:bg-[#B08B3A] text-[#141118] font-bold text-sm shadow-lg transition-all cursor-pointer font-dm tracking-wide uppercase"
        >
          ACKNOWLEDGE & CONTINUE
        </button>
      </div>
    </div>
  );
};
