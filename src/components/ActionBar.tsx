import React from 'react';
import { Player, GamePhase, RoomId } from '../types';
import { ROOMS, CHARACTERS } from '../data/gameData';
import { Dice } from './Dice';
import { 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight, 
  Footprints, 
  Hourglass,
  CheckCircle2 
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface ActionBarProps {
  isCurrentPlayerTurn: boolean;
  activePlayer: Player;
  phase: GamePhase;
  diceRoll: number | null;
  reachableRooms: RoomId[];
  onRollDice: () => void;
  onSelectRoom: (roomId: RoomId) => void;
  onOpenSuggest: () => void;
  onOpenAccuse: () => void;
  onEndTurn: () => void;
  hasSuggestedThisTurn?: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  isCurrentPlayerTurn,
  activePlayer,
  phase,
  diceRoll,
  reachableRooms,
  onRollDice,
  onSelectRoom,
  onOpenSuggest,
  onOpenAccuse,
  onEndTurn,
  hasSuggestedThisTurn = false,
}) => {
  const currentRoom = ROOMS[activePlayer.position];
  const char = CHARACTERS[activePlayer.characterId];

  // Helper for action prompts
  const getPromptText = () => {
    if (!isCurrentPlayerTurn) {
      return (
        <span className="text-[#9A93A6] flex items-center gap-2">
          <Hourglass className="w-4 h-4 text-[#C9A24B] animate-spin-slow" />
          Waiting for <strong className="text-[#F3EDE4]">{activePlayer.name} ({char.name})</strong> to investigate...
        </span>
      );
    }

    if (phase === 'rolling') {
      return (
        <span className="text-[#F3EDE4] flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-[#C9A24B]" />
          <strong>Your Turn:</strong> Roll the dice to begin your movement through the manor.
        </span>
      );
    }

    if (phase === 'moving') {
      return (
        <span className="text-[#2FBF8F] flex items-center gap-2 font-medium">
          <Footprints className="w-4 h-4 text-[#2FBF8F]" />
          Rolled <strong>{diceRoll}</strong>. Select a highlighted room on the floorplan to enter.
        </span>
      );
    }

    if (phase === 'room_actions') {
      return (
        <span className="text-[#F3EDE4] flex items-center gap-2">
          <span>You are inside the <strong className="text-[#C9A24B]">{currentRoom.name}</strong>.</span>
          {hasSuggestedThisTurn ? (
            <span className="text-[#2FBF8F]">• Suggestion complete. End your turn or make a final accusation.</span>
          ) : (
            <span className="text-[#9A93A6]">• Make a suggestion to test other detectives, or accuse/end turn.</span>
          )}
        </span>
      );
    }

    if (phase === 'turn_end') {
      return (
        <span className="text-[#E14B4B] flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-[#E14B4B]" />
          <span>Accusation completed. Pass the turn to the next detective.</span>
        </span>
      );
    }

    if (phase === 'awaiting_reveal') {
      return (
        <span className="text-[#C9A24B] flex items-center gap-2 font-medium">
          <Hourglass className="w-4 h-4 animate-spin-slow" />
          The manor falls silent as detectives inspect their evidence dossiers...
        </span>
      );
    }

    return <span>Investigation in progress...</span>;
  };

  return (
    <div className="sticky bottom-0 w-full bg-[#1F1B24]/95 backdrop-blur-md border-t-2 border-[#3A3340] px-4 py-3 shadow-[0_-10px_25px_rgba(0,0,0,0.6)] z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Turn Status Banner & Contextual Guidance */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono shrink-0 ${
            isCurrentPlayerTurn 
              ? 'bg-[#B5273B]/20 text-[#F3EDE4] border-[#B5273B] shadow-[0_0_10px_rgba(181,39,59,0.3)] animate-pulse' 
              : 'bg-[#141118] text-[#9A93A6] border-[#3A3340]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isCurrentPlayerTurn ? 'bg-[#B5273B]' : 'bg-[#9A93A6]'}`} />
            {isCurrentPlayerTurn ? 'YOUR TURN' : 'OBSERVING'}
          </div>

          <div className="text-xs font-dm truncate">
            {getPromptText()}
          </div>
        </div>

        {/* Right: Interactive Game Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto">
          {/* Phase 1: Roll Dice */}
          {isCurrentPlayerTurn && phase === 'rolling' && (
            <>
              <button
                id="btn-roll-dice"
                type="button"
                onClick={() => {
                  playClickSound();
                  onRollDice();
                }}
                className="px-5 py-2.5 rounded-lg bg-[#C9A24B] hover:bg-[#B08B3A] text-[#141118] font-bold text-sm shadow-lg hover:shadow-[0_0_15px_rgba(201,162,75,0.4)] transition-all flex items-center gap-2 cursor-pointer font-dm animate-pulse-gold"
              >
                <Dice value={null} onRoll={() => {}} disabled />
                <span>ROLL DICE</span>
              </button>

              {!activePlayer.hasAccused && (
                <button
                  id="btn-action-accuse-rolling"
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onOpenAccuse();
                  }}
                  className="px-3.5 py-2 rounded-lg font-bold text-xs bg-[#B5273B]/80 hover:bg-[#B5273B] text-[#F3EDE4] border border-[#B5273B] transition-all flex items-center gap-1.5 cursor-pointer font-dm"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>ACCUSE</span>
                </button>
              )}
            </>
          )}

          {/* Phase 2: Reachable Room Quick Buttons (on mobile/desktop) */}
          {isCurrentPlayerTurn && phase === 'moving' && reachableRooms.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs py-1">
              {reachableRooms.map(rId => (
                <button
                  key={rId}
                  onClick={() => onSelectRoom(rId)}
                  className="px-2.5 py-1.5 rounded bg-[#2FBF8F]/15 hover:bg-[#2FBF8F]/30 text-[#2FBF8F] border border-[#2FBF8F]/50 text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Footprints className="w-3 h-3" />
                  {ROOMS[rId].name}
                </button>
              ))}
            </div>
          )}

          {/* Phase 3: Room Actions (Suggest / Accuse / End Turn) */}
          {isCurrentPlayerTurn && (phase === 'room_actions' || phase === 'moving') && (
            <>
              {/* Suggestion CTA */}
              <button
                id="btn-action-suggest"
                type="button"
                onClick={() => {
                  playClickSound();
                  onOpenSuggest();
                }}
                disabled={hasSuggestedThisTurn}
                className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm border transition-all flex items-center gap-1.5 cursor-pointer font-dm ${
                  hasSuggestedThisTurn
                    ? 'bg-[#141118] text-[#9A93A6] border-[#3A3340] opacity-50 cursor-not-allowed'
                    : 'bg-[#2FBF8F] hover:bg-[#269E76] text-[#141118] border-[#2FBF8F] shadow-[0_0_12px_rgba(47,191,143,0.3)]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>{hasSuggestedThisTurn ? 'SUGGESTED' : 'SUGGEST'}</span>
              </button>

              {/* Accusation CTA (High Stakes) */}
              {!activePlayer.hasAccused && (
                <button
                  id="btn-action-accuse"
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onOpenAccuse();
                  }}
                  className="px-4 py-2 rounded-lg font-bold text-xs sm:text-sm bg-[#B5273B] hover:bg-[#9E1F32] text-[#F3EDE4] border border-[#B5273B] shadow-[0_0_12px_rgba(181,39,59,0.4)] transition-all flex items-center gap-1.5 cursor-pointer font-dm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>ACCUSE</span>
                </button>
              )}

              {/* End Turn CTA */}
              <button
                id="btn-action-end-turn"
                type="button"
                onClick={() => {
                  playClickSound();
                  onEndTurn();
                }}
                className="px-4 py-2 rounded-lg font-medium text-xs sm:text-sm bg-[#2A2430] hover:bg-[#3A3340] text-[#F3EDE4] border border-[#3A3340] transition-colors flex items-center gap-1.5 cursor-pointer font-dm"
              >
                <span>End Turn</span>
                <ArrowRight className="w-4 h-4 text-[#C9A24B]" />
              </button>
            </>
          )}

          {/* Phase 4: Turn End (after failed accusation or pass) */}
          {isCurrentPlayerTurn && phase === 'turn_end' && (
            <button
              id="btn-action-pass-turn"
              type="button"
              onClick={() => {
                playClickSound();
                onEndTurn();
              }}
              className="px-5 py-2.5 rounded-lg bg-[#C9A24B] hover:bg-[#B08B3A] text-[#141118] font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer font-dm"
            >
              <span>PASS TURN</span>
              <ArrowRight className="w-4 h-4 text-[#141118]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
