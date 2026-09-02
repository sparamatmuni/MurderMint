import React, { useState, useEffect } from 'react';
import { 
  GameState, 
  Player, 
  HouseRules, 
  CharacterId,
  ChatMessage
} from './types';
import { CHARACTERS } from './data/gameData';
import { createInitialGameState, generateRoomCode, generateUniqueId } from './utils/gameLogic';
import { LandingView } from './views/LandingView';
import { CreateGameView } from './views/CreateGameView';
import { JoinGameView } from './views/JoinGameView';
import { LobbyView } from './views/LobbyView';
import { GameBoardView } from './views/GameBoardView';
import { ResultsView } from './views/ResultsView';

export type AppRoute = 
  | { view: 'landing' }
  | { view: 'create' }
  | { view: 'join'; roomCode?: string }
  | { view: 'lobby'; roomCode: string }
  | { view: 'game'; roomCode: string }
  | { view: 'results'; roomCode: string };

export default function App() {
  // Navigation Route State
  const [route, setRoute] = useState<AppRoute>({ view: 'landing' });

  // Current Active User Identification
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('murdermint_user_id') || generateUniqueId('usr');
  });

  // Lobby & Game Session State
  const [roomCode, setRoomCode] = useState<string>('MM-4827');
  const [roomName, setRoomName] = useState<string>('The Blackwood Manor Mystery');
  const [players, setPlayers] = useState<Player[]>([]);
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [houseRules, setHouseRules] = useState<HouseRules>({
    secretPassages: true,
    autoNotes: true,
    aiDifficulty: 'detective',
    diceCount: 1,
  });

  // Active Game State
  const [activeGameState, setActiveGameState] = useState<GameState | null>(null);

  // Parlor Telegram Chat State across Lobby and Match
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-butler-dispatch',
      senderId: 'butler',
      senderName: 'Blackwood Butler',
      text: 'Good evening, detectives. Thunder rolls across the plantation verandas. The manor doors have been sealed until the killer is identified.',
      timestamp: Date.now() - 30000,
      isSystem: true,
    }
  ]);

  const handleSendMessage = (msg: ChatMessage) => {
    setChatMessages(prev => [...prev, msg]);
  };

  // Sync current user ID
  useEffect(() => {
    localStorage.setItem('murdermint_user_id', currentUserId);
  }, [currentUserId]);

  // Quick Play Helper: Instant 4-Player Match
  const handleQuickPlay = () => {
    const code = generateRoomCode();
    const myId = generateUniqueId('usr');
    setCurrentUserId(myId);
    setRoomCode(code);
    setRoomName('Midnight at Blackwood Manor');

    const me: Player = {
      id: myId,
      name: 'Detective Sterling',
      characterId: 'scarlet',
      isHost: true,
      isAi: false,
      isReady: true,
      position: 'lounge',
      hand: [],
      hasAccused: false,
      outOfGame: false,
    };

    const botMustard: Player = {
      id: generateUniqueId('bot-mustard'),
      name: 'Col. Mustard (AI)',
      characterId: 'mustard',
      isHost: false,
      isAi: true,
      isReady: true,
      position: 'dining_room',
      hand: [],
      hasAccused: false,
      outOfGame: false,
    };

    const botPeacock: Player = {
      id: generateUniqueId('bot-peacock'),
      name: 'Mrs. Peacock (AI)',
      characterId: 'peacock',
      isHost: false,
      isAi: true,
      isReady: true,
      position: 'conservatory',
      hand: [],
      hasAccused: false,
      outOfGame: false,
    };

    const botPlum: Player = {
      id: generateUniqueId('bot-plum'),
      name: 'Prof. Plum (AI)',
      characterId: 'plum',
      isHost: false,
      isAi: true,
      isReady: true,
      position: 'study',
      hand: [],
      hasAccused: false,
      outOfGame: false,
    };

    const initialPlayers = [me, botMustard, botPeacock, botPlum];
    setPlayers(initialPlayers);

    const initialGame = createInitialGameState(code, 'Midnight at Blackwood Manor', initialPlayers, houseRules);
    setActiveGameState(initialGame);
    setRoute({ view: 'game', roomCode: code });
  };

  // Create Game Handler
  const handleEnterLobbyFromCreate = (
    code: string,
    name: string,
    hostPlayer: Player,
    maxP: number,
    rules: HouseRules
  ) => {
    setRoomCode(code);
    setRoomName(name);
    setCurrentUserId(hostPlayer.id);
    setMaxPlayers(maxP);
    setHouseRules(rules);

    // Initial lobby with host
    const initialPlayers = [hostPlayer];
    setPlayers(initialPlayers);
    setRoute({ view: 'lobby', roomCode: code });
  };

  // Join Game Handler
  const handleJoinSuccess = (code: string, joiningPlayer: Player) => {
    setRoomCode(code);
    setCurrentUserId(joiningPlayer.id);

    // Add player to lobby or create fresh lobby state
    setPlayers(prev => {
      const exists = prev.some(p => p.id === joiningPlayer.id);
      if (exists) return prev;
      return [...prev, joiningPlayer];
    });

    setRoute({ view: 'lobby', roomCode: code });
  };

  // Lobby Actions: Add AI Player (Guaranteed unique ID and no character duplicate)
  const handleAddAiPlayer = (specifiedChar?: CharacterId) => {
    setPlayers(prev => {
      if (prev.length >= maxPlayers) return prev;
      const claimed = prev.map(p => p.characterId);
      const available = (Object.keys(CHARACTERS) as CharacterId[]).filter(
        id => !claimed.includes(id)
      );

      const charId = specifiedChar && !claimed.includes(specifiedChar) ? specifiedChar : available[0];
      if (!charId) return prev;

      const char = CHARACTERS[charId];
      const botPlayer: Player = {
        id: generateUniqueId(`bot-${charId}`),
        name: `${char.name.split(' ')[1] || char.name} (AI)`,
        characterId: charId,
        isHost: false,
        isAi: true,
        isReady: true,
        position: char.startingRoom,
        hand: [],
        hasAccused: false,
        outOfGame: false,
      };

      return [...prev, botPlayer];
    });
  };

  // Lobby Actions: Auto fill remaining slots with AI Bots
  const handleAutoFillBots = (targetCount = 4) => {
    setPlayers(prev => {
      const needed = Math.max(0, Math.min(targetCount, maxPlayers) - prev.length);
      if (needed <= 0) return prev;

      const updated = [...prev];
      for (let i = 0; i < needed; i++) {
        const claimed = updated.map(p => p.characterId);
        const available = (Object.keys(CHARACTERS) as CharacterId[]).filter(
          id => !claimed.includes(id)
        );
        if (available.length === 0) break;
        const charId = available[0];
        const char = CHARACTERS[charId];
        const botPlayer: Player = {
          id: generateUniqueId(`bot-${charId}`),
          name: `${char.name.split(' ')[1] || char.name} (AI)`,
          characterId: charId,
          isHost: false,
          isAi: true,
          isReady: true,
          position: char.startingRoom,
          hand: [],
          hasAccused: false,
          outOfGame: false,
        };
        updated.push(botPlayer);
      }
      return updated;
    });
  };

  // Lobby Actions: Remove Player
  const handleRemovePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  // Lobby Actions: Update Player
  const handleUpdatePlayer = (playerId: string, updates: Partial<Player>) => {
    setPlayers(prev => prev.map(p => (p.id === playerId ? { ...p, ...updates } : p)));
  };

  // Start Case from Lobby
  const handleStartGame = () => {
    const initialGame = createInitialGameState(roomCode, roomName, players, houseRules);
    setActiveGameState(initialGame);
    setRoute({ view: 'game', roomCode });
  };

  // Game Over Transition to Results
  const handleGameOver = (finalState: GameState) => {
    setActiveGameState(finalState);
    setRoute({ view: 'results', roomCode: finalState.roomCode });
  };

  // Rematch Handler
  const handleRematch = () => {
    const nextGame = createInitialGameState(roomCode, roomName, players, houseRules);
    setActiveGameState(nextGame);
    setRoute({ view: 'game', roomCode });
  };

  // Return to Lobby Handler
  const handleReturnToLobby = () => {
    setRoute({ view: 'lobby', roomCode });
  };

  return (
    <div className="min-h-screen bg-[#141118] text-[#F3EDE4]">
      {/* Route 1: Landing */}
      {route.view === 'landing' && (
        <LandingView
          onCreateGame={() => setRoute({ view: 'create' })}
          onJoinGame={() => setRoute({ view: 'join' })}
          onQuickPlay={handleQuickPlay}
        />
      )}

      {/* Route 2: Create Game */}
      {route.view === 'create' && (
        <CreateGameView
          onEnterLobby={handleEnterLobbyFromCreate}
          onBackToLanding={() => setRoute({ view: 'landing' })}
        />
      )}

      {/* Route 3: Join Game */}
      {route.view === 'join' && (
        <JoinGameView
          initialRoomCode={route.roomCode}
          claimedCharacters={players.map(p => p.characterId)}
          onJoinSuccess={handleJoinSuccess}
          onBackToLanding={() => setRoute({ view: 'landing' })}
        />
      )}

      {/* Route 4: Lobby */}
      {route.view === 'lobby' && (
        <LobbyView
          roomCode={roomCode}
          roomName={roomName}
          players={players}
          currentUserId={currentUserId}
          maxPlayers={maxPlayers}
          houseRules={houseRules}
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          onUpdatePlayer={handleUpdatePlayer}
          onAddAiPlayer={handleAddAiPlayer}
          onAutoFillBots={handleAutoFillBots}
          onRemovePlayer={handleRemovePlayer}
          onStartGame={handleStartGame}
          onLeaveLobby={() => setRoute({ view: 'landing' })}
        />
      )}

      {/* Route 5: Main Game Board */}
      {route.view === 'game' && activeGameState && (
        <GameBoardView
          initialState={activeGameState}
          currentUserId={currentUserId}
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          onGameOver={handleGameOver}
        />
      )}

      {/* Route 6: Results / Case Closed */}
      {route.view === 'results' && activeGameState && (
        <ResultsView
          state={activeGameState}
          onRematch={handleRematch}
          onReturnToLobby={handleReturnToLobby}
        />
      )}
    </div>
  );
}
