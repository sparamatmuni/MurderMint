import React, { useState, useEffect, useRef } from 'react';
import { 
  GameState, 
  Player, 
  RoomId, 
  CharacterId, 
  WeaponId, 
  DeductionState,
  ChatMessage 
} from '../types';
import { TopBar } from '../components/TopBar';
import { MansionBoard } from '../components/MansionBoard';
import { DetectiveNotepad } from '../components/DetectiveNotepad';
import { ActionBar } from '../components/ActionBar';
import { SuggestionModal } from '../components/SuggestionModal';
import { AccusationModal } from '../components/AccusationModal';
import { EvidenceRevealModal } from '../components/EvidenceRevealModal';
import { RulesModal } from '../components/RulesModal';
import { CaseLogDrawer } from '../components/CaseLogDrawer';
import { ParlorChat } from '../components/ParlorChat';
import { 
  getReachableRooms, 
  processSuggestion, 
  processAccusation, 
  advanceTurn, 
  getAiTurnDecision,
  generateUniqueId
} from '../utils/gameLogic';
import { playClickSound, playErrorSound, playMoveSound, playTelegraphSound } from '../utils/sound';

interface GameBoardViewProps {
  initialState: GameState;
  currentUserId: string;
  chatMessages?: ChatMessage[];
  onSendMessage?: (msg: ChatMessage) => void;
  onGameOver: (finalState: GameState) => void;
}

export const GameBoardView: React.FC<GameBoardViewProps> = ({
  initialState,
  currentUserId,
  chatMessages = [],
  onSendMessage,
  onGameOver,
}) => {
  const [state, setState] = useState<GameState>(initialState);
  const [reachableRooms, setReachableRooms] = useState<RoomId[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomId | null>(null);

  // Deduction Notepad State for Current User
  const [notes, setNotes] = useState<Record<string, DeductionState>>(() => {
    const initialNotes: Record<string, DeductionState> = {};
    // Auto-mark cards held in player's starting hand
    const me = initialState.players.find(p => p.id === currentUserId);
    if (me) {
      me.hand.forEach(cId => {
        initialNotes[cId] = 'in_hand';
      });
    }
    return initialNotes;
  });

  // Turn flags
  const [hasSuggestedThisTurn, setHasSuggestedThisTurn] = useState(false);

  // Modals, Drawers & Parlor Chat
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isAccuseOpen, setIsAccuseOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isMobileNotepadOpen, setIsMobileNotepadOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const activePlayer = state.players[state.currentTurnIndex] || state.players[0];
  const isMyTurn = activePlayer?.id === currentUserId;

  // AI Turn Simulation Effect
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.phase === 'game_over') {
      onGameOver(state);
      return;
    }

    // If active player is AI and game is ongoing
    if (activePlayer.isAi) {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);

      if (activePlayer.hasAccused) {
        // If AI has already made a failed accusation, pass turn
        aiTimeoutRef.current = setTimeout(() => {
          handleEndTurn();
        }, 1000);
        return;
      }

      if (state.phase === 'rolling') {
        aiTimeoutRef.current = setTimeout(() => {
          executeAiTurn();
        }, 1200);
      } else if (state.phase === 'room_actions') {
        // AI in room actions -> automatically end turn after brief pause
        aiTimeoutRef.current = setTimeout(() => {
          handleEndTurn();
        }, 1400);
      } else if (state.phase === 'turn_end') {
        aiTimeoutRef.current = setTimeout(() => {
          handleEndTurn();
        }, 800);
      }
    }

    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [state.currentTurnIndex, state.phase, activePlayer?.id]);

  // Auto-dismiss evidence reveal during AI turns if user is idle
  useEffect(() => {
    if (state.phase === 'awaiting_reveal' && activePlayer.isAi) {
      const autoDismissTimer = setTimeout(() => {
        handleAcknowledgeEvidence(state.activeEvidenceReveal?.cardId);
      }, 5000);
      return () => clearTimeout(autoDismissTimer);
    }
  }, [state.phase, state.activeEvidenceReveal, activePlayer?.isAi]);

  // AI turn automation logic
  const executeAiTurn = () => {
    if (!activePlayer.isAi || activePlayer.hasAccused) return;

    // 1. Roll Dice
    const roll = Math.floor(Math.random() * 6) + 1;
    const reachable = getReachableRooms(activePlayer.position, roll, state.houseRules.secretPassages);
    const targetRoom = reachable[Math.floor(Math.random() * reachable.length)] || activePlayer.position;

    // 2. Move AI Token
    const updatedPlayers = state.players.map(p => {
      if (p.id === activePlayer.id) {
        return { ...p, position: targetRoom };
      }
      return p;
    });

    const moveState: GameState = {
      ...state,
      players: updatedPlayers,
      diceRoll: roll,
      phase: 'room_actions',
      logs: [
        ...state.logs,
        {
          id: generateUniqueId('log-ai-mv'),
          text: `${activePlayer.name} rolled a ${roll} and entered the ${targetRoom.replace('_', ' ')}.`,
          type: 'move',
          characterId: activePlayer.characterId,
          timestamp: Date.now(),
        },
      ],
    };

    // 3. AI Accusation check
    const aiDecision = getAiTurnDecision(moveState);
    if (aiDecision.makeAccusation) {
      const { updatedState, isCorrect } = processAccusation(
        moveState,
        aiDecision.makeAccusation.suspect,
        aiDecision.makeAccusation.weapon,
        aiDecision.makeAccusation.room
      );
      setState(updatedState);
      if (updatedState.phase === 'game_over') {
        onGameOver(updatedState);
      }
      return;
    }

    // 4. AI Suggestion
    const { updatedState: postSuggestState } = processSuggestion(
      moveState,
      aiDecision.suggestSuspect,
      aiDecision.suggestWeapon,
      targetRoom
    );

    setState(postSuggestState);
  };

  // Human Player Actions
  const handleRollDice = () => {
    if (!isMyTurn || state.phase !== 'rolling') return;

    const roll = Math.floor(Math.random() * 6) + 1;
    const reachable = getReachableRooms(activePlayer.position, roll, state.houseRules.secretPassages);

    setReachableRooms(reachable);
    setState(prev => ({
      ...prev,
      diceRoll: roll,
      phase: 'moving',
      logs: [
        ...prev.logs,
        {
          id: generateUniqueId('log-roll'),
          text: `${activePlayer.name} rolled a ${roll} on the movement die.`,
          type: 'roll',
          characterId: activePlayer.characterId,
          timestamp: Date.now(),
        },
      ],
    }));
  };

  const handleSelectRoom = (roomId: RoomId) => {
    if (!isMyTurn || state.phase !== 'moving') return;

    const updatedPlayers = state.players.map(p => {
      if (p.id === activePlayer.id) {
        return { ...p, position: roomId };
      }
      return p;
    });

    playMoveSound();
    setReachableRooms([]);
    setSelectedRoom(roomId);

    setState(prev => ({
      ...prev,
      players: updatedPlayers,
      phase: 'room_actions',
      logs: [
        ...prev.logs,
        {
          id: generateUniqueId('log-mv'),
          text: `${activePlayer.name} navigated to the ${roomId.replace('_', ' ')}.`,
          type: 'move',
          characterId: activePlayer.characterId,
          timestamp: Date.now(),
        },
      ],
    }));
  };

  const handleSubmitSuggestion = (suspect: CharacterId, weapon: WeaponId, room: RoomId) => {
    setIsSuggestOpen(false);
    setHasSuggestedThisTurn(true);

    const { updatedState } = processSuggestion(state, suspect, weapon, room);
    setState(updatedState);
  };

  const handleAcknowledgeEvidence = (cardId?: string) => {
    // If autoNotes is enabled and card was revealed, mark as eliminated
    if (cardId && state.houseRules.autoNotes) {
      setNotes(prev => ({
        ...prev,
        [cardId]: 'eliminated',
      }));
    }

    if (isMyTurn) {
      setState(prev => ({
        ...prev,
        phase: 'room_actions',
        activeEvidenceReveal: null,
      }));
    } else {
      // If AI's turn, acknowledging advances the game to the next player
      setHasSuggestedThisTurn(false);
      setReachableRooms([]);
      setSelectedRoom(null);
      setState(prev => {
        const clearedState = {
          ...prev,
          activeEvidenceReveal: null,
        };
        return advanceTurn(clearedState);
      });
    }
  };

  const handleSubmitAccusation = (suspect: CharacterId, weapon: WeaponId, room: RoomId) => {
    setIsAccuseOpen(false);

    const { updatedState, isCorrect } = processAccusation(state, suspect, weapon, room);
    if (!isCorrect) {
      playErrorSound();
    }
    setState(updatedState);

    if (updatedState.phase === 'game_over') {
      onGameOver(updatedState);
    }
  };

  const handleEndTurn = () => {
    setHasSuggestedThisTurn(false);
    setReachableRooms([]);
    setSelectedRoom(null);

    const nextState = advanceTurn(state);
    setState(nextState);
  };

  const handleNoteChange = (cardId: string, nextState: DeductionState) => {
    setNotes(prev => ({
      ...prev,
      [cardId]: nextState,
    }));
  };

  const handleResetNotes = () => {
    const me = state.players.find(p => p.id === currentUserId);
    const reset: Record<string, DeductionState> = {};
    if (me) {
      me.hand.forEach(cId => {
        reset[cId] = 'in_hand';
      });
    }
    setNotes(reset);
  };

  const ruledOutCount = Object.entries(notes).filter(([_, s]) => s === 'eliminated' || s === 'in_hand').length;

  return (
    <div className="min-h-screen bg-[#120B07] text-[#F7EFE2] flex flex-col justify-between select-none relative overflow-x-hidden bg-blueprint">
      {/* 1. Top Bar */}
      <TopBar
        roomCode={state.roomCode}
        players={state.players}
        activePlayerIndex={state.currentTurnIndex}
        currentUserId={currentUserId}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        onToggleChat={() => setIsChatOpen(prev => !prev)}
        onToggleMobileNotepad={() => setIsMobileNotepadOpen(true)}
        notepadRuledOutCount={ruledOutCount}
        chatUnreadCount={0}
      />

      {/* 2. Main Game Viewport (Mansion Floorplan + Desktop Detective Notepad) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 pb-20 md:pb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Left / Center 8 Columns: Mansion Blueprint Board */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col items-center justify-center">
          <MansionBoard
            players={state.players}
            activePlayerId={activePlayer.id}
            reachableRooms={reachableRooms}
            isMovingPhase={isMyTurn && state.phase === 'moving'}
            isRollingPhase={isMyTurn && state.phase === 'rolling'}
            isRoomActionsPhase={isMyTurn && state.phase === 'room_actions'}
            isMyTurn={isMyTurn}
            diceRoll={state.diceRoll}
            onRollDice={handleRollDice}
            onSelectRoom={handleSelectRoom}
            onOpenSuggest={() => setIsSuggestOpen(true)}
            onOpenAccuse={() => setIsAccuseOpen(true)}
            onEndTurn={handleEndTurn}
            hasSuggestedThisTurn={hasSuggestedThisTurn}
            selectedRoom={selectedRoom}
            allowSecretPassages={state.houseRules.secretPassages}
          />
        </div>

        {/* Right 4-5 Columns: Persistent Desktop Detective Notepad */}
        <div className="hidden md:block md:col-span-5 lg:col-span-4 h-[580px] max-h-[calc(100vh-140px)]">
          <DetectiveNotepad
            notes={notes}
            onNoteChange={handleNoteChange}
            onResetNotes={handleResetNotes}
            currentPlayer={state.players.find(p => p.id === currentUserId) || activePlayer}
          />
        </div>
      </main>

      {/* 3. Bottom Sticky Action Bar */}
      <ActionBar
        isCurrentPlayerTurn={isMyTurn}
        activePlayer={activePlayer}
        phase={state.phase}
        diceRoll={state.diceRoll}
        reachableRooms={reachableRooms}
        onRollDice={handleRollDice}
        onSelectRoom={handleSelectRoom}
        onOpenSuggest={() => setIsSuggestOpen(true)}
        onOpenAccuse={() => setIsAccuseOpen(true)}
        onEndTurn={handleEndTurn}
        hasSuggestedThisTurn={hasSuggestedThisTurn}
      />

      {/* 4. Modals & Drawers */}
      <SuggestionModal
        isOpen={isSuggestOpen}
        onClose={() => setIsSuggestOpen(false)}
        currentRoom={activePlayer.position}
        onSubmitSuggestion={handleSubmitSuggestion}
      />

      <AccusationModal
        isOpen={isAccuseOpen}
        onClose={() => setIsAccuseOpen(false)}
        onSubmitAccusation={handleSubmitAccusation}
      />

      <EvidenceRevealModal
        revealData={state.activeEvidenceReveal}
        onAcknowledge={handleAcknowledgeEvidence}
        isCurrentPlayerSuggester={state.activeEvidenceReveal?.suggestion.suggesterId === currentUserId}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <CaseLogDrawer
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={state.logs}
      />

      {/* Mobile Collapsible Detective Notepad Drawer */}
      <DetectiveNotepad
        notes={notes}
        onNoteChange={handleNoteChange}
        onResetNotes={handleResetNotes}
        currentPlayer={state.players.find(p => p.id === currentUserId) || activePlayer}
        isMobileDrawer={true}
        isOpenMobile={isMobileNotepadOpen}
        onCloseMobile={() => setIsMobileNotepadOpen(false)}
      />

      {/* Parlor Telegraph Chat System */}
      {onSendMessage && (
        <ParlorChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          players={state.players}
          currentUserId={currentUserId}
          isOpen={isChatOpen}
          onToggleOpen={() => setIsChatOpen(prev => !prev)}
          roomName={state.roomName}
        />
      )}
    </div>
  );
};
