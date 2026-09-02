import { 
  GameState, 
  Player, 
  CharacterId, 
  WeaponId, 
  RoomId, 
  SecretSolution, 
  Suggestion, 
  Accusation, 
  GameLogItem, 
  HouseRules 
} from '../types';
import { 
  ALL_CARDS, 
  CHARACTERS, 
  ROOMS, 
  ROOM_ADJACENCY, 
  WEAPONS 
} from '../data/gameData';

let uniqueIdCounter = 0;
export function generateUniqueId(prefix = 'id'): string {
  uniqueIdCounter += 1;
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${Date.now()}-${rand}-${uniqueIdCounter}`;
}

export function generateRoomCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `MM-${digits}`;
}

export function createInitialGameState(
  roomCode: string,
  roomName: string,
  players: Player[],
  houseRules?: Partial<HouseRules>
): GameState {
  const allSuspects: CharacterId[] = Object.keys(CHARACTERS) as CharacterId[];
  const allWeapons: WeaponId[] = Object.keys(WEAPONS) as WeaponId[];
  const allRooms: RoomId[] = Object.keys(ROOMS) as RoomId[];

  // 1. Pick Secret Solution
  const secretSuspect = allSuspects[Math.floor(Math.random() * allSuspects.length)];
  const secretWeapon = allWeapons[Math.floor(Math.random() * allWeapons.length)];
  const secretRoom = allRooms[Math.floor(Math.random() * allRooms.length)];

  const secretSolution: SecretSolution = {
    suspect: secretSuspect,
    weapon: secretWeapon,
    room: secretRoom,
  };

  // 2. Prepare remaining 18 cards to deal to players
  const remainingCards = ALL_CARDS.filter(card => {
    if (card.category === 'suspect' && card.rawId === secretSuspect) return false;
    if (card.category === 'weapon' && card.rawId === secretWeapon) return false;
    if (card.category === 'room' && card.rawId === secretRoom) return false;
    return true;
  });

  // Shuffle remaining cards (Fisher-Yates)
  const shuffled = [...remainingCards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 3. Deal cards to players
  const updatedPlayers = players.map(p => ({
    ...p,
    hand: [] as string[],
    position: CHARACTERS[p.characterId].startingRoom,
    hasAccused: false,
    outOfGame: false,
  }));

  shuffled.forEach((card, index) => {
    const playerIndex = index % updatedPlayers.length;
    updatedPlayers[playerIndex].hand.push(card.id);
  });

  const rules: HouseRules = {
    secretPassages: true,
    autoNotes: true,
    aiDifficulty: 'detective',
    diceCount: 1,
    ...houseRules,
  };

  const initialLogs: GameLogItem[] = [
    {
      id: `log-${Date.now()}-1`,
      text: `Case file opened for Blackwood Manor. 3 confidential items sealed in the confidential evidence envelope.`,
      type: 'system',
      timestamp: Date.now(),
    },
    {
      id: `log-${Date.now()}-2`,
      text: `Detectives assembled: ${players.map(p => `${p.name} (${CHARACTERS[p.characterId].name})`).join(', ')}.`,
      type: 'system',
      timestamp: Date.now() + 1,
    },
    {
      id: `log-${Date.now()}-3`,
      text: `${CHARACTERS[updatedPlayers[0].characterId].name} takes the first turn.`,
      type: 'system',
      timestamp: Date.now() + 2,
    },
  ];

  return {
    roomCode,
    roomName: roomName || 'The Blackwood Murder Case',
    players: updatedPlayers,
    currentTurnIndex: 0,
    turnNumber: 1,
    diceRoll: null,
    phase: 'rolling',
    secretSolution,
    suggestions: [],
    accusations: [],
    logs: initialLogs,
    winnerId: null,
    isColdCase: false,
    houseRules: rules,
    activeEvidenceReveal: null,
  };
}

// Calculate reachable rooms given current position and dice roll
export function getReachableRooms(
  currentRoom: RoomId,
  diceRoll: number,
  allowSecretPassages = true
): RoomId[] {
  const reachable = new Set<RoomId>();

  // Secret passage shortcut
  if (allowSecretPassages && ROOMS[currentRoom].secretPassageTo) {
    reachable.add(ROOMS[currentRoom].secretPassageTo!);
  }

  // BFS traversal up to diceRoll steps
  const queue: { room: RoomId; dist: number }[] = [{ room: currentRoom, dist: 0 }];
  const visited = new Map<RoomId, number>();
  visited.set(currentRoom, 0);

  while (queue.length > 0) {
    const { room, dist } = queue.shift()!;
    if (dist > 0) {
      reachable.add(room);
    }
    if (dist < diceRoll) {
      const neighbors = ROOM_ADJACENCY[room] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) || visited.get(neighbor)! > dist + 1) {
          visited.set(neighbor, dist + 1);
          queue.push({ room: neighbor, dist: dist + 1 });
        }
      }
    }
  }

  // Also include direct adjacent rooms always reachable if diceRoll >= 1
  (ROOM_ADJACENCY[currentRoom] || []).forEach(r => reachable.add(r));

  return Array.from(reachable);
}

// Process a suggestion
export function processSuggestion(
  state: GameState,
  suspectId: CharacterId,
  weaponId: WeaponId,
  roomId: RoomId
): {
  updatedState: GameState;
  disproverId?: string;
  revealedCardId?: string;
  noOneHadEvidence: boolean;
} {
  const activePlayer = state.players[state.currentTurnIndex];
  const targetCardIds = [
    `suspect_${suspectId}`,
    `weapon_${weaponId}`,
    `room_${roomId}`,
  ];

  let disprover: Player | undefined;
  let revealedCardId: string | undefined;

  // Ask each player in turn order
  const numPlayers = state.players.length;
  for (let i = 1; i < numPlayers; i++) {
    const checkIndex = (state.currentTurnIndex + i) % numPlayers;
    const player = state.players[checkIndex];
    
    // Find matching cards in this player's hand
    const matchingInHand = player.hand.filter(cId => targetCardIds.includes(cId));
    if (matchingInHand.length > 0) {
      disprover = player;
      // Pick one matching card to show
      revealedCardId = matchingInHand[Math.floor(Math.random() * matchingInHand.length)];
      break;
    }
  }

  const noOneHadEvidence = !disprover;

  const newSuggestion: Suggestion = {
    id: generateUniqueId('sug'),
    suggesterId: activePlayer.id,
    suggesterName: activePlayer.name,
    suggesterCharacter: activePlayer.characterId,
    suspectId,
    weaponId,
    roomId,
    disproverId: disprover?.id,
    disproverName: disprover?.name,
    revealedCardId,
    timestamp: Date.now(),
  };

  const newLogs: GameLogItem[] = [
    ...state.logs,
    {
      id: generateUniqueId('log-sug'),
      text: `${activePlayer.name} suggested: ${CHARACTERS[suspectId].name} with the ${WEAPONS[weaponId].name} in the ${ROOMS[roomId].name}.`,
      type: 'suggest',
      characterId: activePlayer.characterId,
      timestamp: Date.now(),
    },
  ];

  if (disprover) {
    newLogs.push({
      id: generateUniqueId('log-rev'),
      text: `${disprover.name} showed private evidence to ${activePlayer.name}.`,
      type: 'reveal',
      characterId: disprover.characterId,
      timestamp: Date.now() + 1,
    });
  } else {
    newLogs.push({
      id: generateUniqueId('log-norev'),
      text: `Silence fell over the mansion... No detective could disprove the suggestion!`,
      type: 'reveal',
      timestamp: Date.now() + 1,
    });
  }

  const updatedState: GameState = {
    ...state,
    suggestions: [newSuggestion, ...state.suggestions],
    logs: newLogs,
    phase: 'awaiting_reveal',
    activeEvidenceReveal: {
      suggestion: newSuggestion,
      cardId: revealedCardId,
      disproverName: disprover?.name,
      noOneHadEvidence,
    },
  };

  return {
    updatedState,
    disproverId: disprover?.id,
    revealedCardId,
    noOneHadEvidence,
  };
}

// Process an accusation
export function processAccusation(
  state: GameState,
  suspectId: CharacterId,
  weaponId: WeaponId,
  roomId: RoomId
): { updatedState: GameState; isCorrect: boolean } {
  const activePlayer = state.players[state.currentTurnIndex];
  const isCorrect = 
    suspectId === state.secretSolution.suspect &&
    weaponId === state.secretSolution.weapon &&
    roomId === state.secretSolution.room;

  const newAccusation: Accusation = {
    id: generateUniqueId('acc'),
    accuserId: activePlayer.id,
    accuserName: activePlayer.name,
    accuserCharacter: activePlayer.characterId,
    suspectId,
    weaponId,
    roomId,
    isCorrect,
    timestamp: Date.now(),
  };

  let newPhase: GameState['phase'] = state.phase;
  let winnerId: string | null = state.winnerId;
  let isColdCase = false;

  const updatedPlayers = state.players.map(p => {
    if (p.id === activePlayer.id) {
      return {
        ...p,
        hasAccused: !isCorrect,
      };
    }
    return p;
  });

  const newLogs: GameLogItem[] = [
    ...state.logs,
    {
      id: generateUniqueId('log-acc'),
      text: `${activePlayer.name} made a final accusation: ${CHARACTERS[suspectId].name}, ${WEAPONS[weaponId].name}, ${ROOMS[roomId].name}!`,
      type: 'accuse',
      characterId: activePlayer.characterId,
      timestamp: Date.now(),
    },
  ];

  if (isCorrect) {
    newPhase = 'game_over';
    winnerId = activePlayer.id;
    newLogs.push({
      id: generateUniqueId('log-win'),
      text: `CASE CLOSED! ${activePlayer.name} solved the murder with flawless deduction!`,
      type: 'system',
      timestamp: Date.now() + 1,
    });
  } else {
    newLogs.push({
      id: generateUniqueId('log-fail'),
      text: `INCORRECT! ${activePlayer.name}'s accusation failed. They are now barred from making further accusations.`,
      type: 'eliminate',
      characterId: activePlayer.characterId,
      timestamp: Date.now() + 1,
    });

    // Check if all players failed accusations
    const activeAccusers = updatedPlayers.filter(p => !p.hasAccused);
    if (activeAccusers.length === 0) {
      newPhase = 'game_over';
      isColdCase = true;
      newLogs.push({
        id: generateUniqueId('log-cold'),
        text: `All detectives have exhausted their accusations. The murder at Blackwood Manor remains an unsolved Cold Case!`,
        type: 'system',
        timestamp: Date.now() + 2,
      });
    } else {
      newPhase = 'turn_end';
    }
  }

  const updatedState: GameState = {
    ...state,
    players: updatedPlayers,
    phase: newPhase,
    winnerId,
    isColdCase,
    accusations: [newAccusation, ...state.accusations],
    logs: newLogs,
  };

  return { updatedState, isCorrect };
}

// Advance to next active player
export function advanceTurn(state: GameState): GameState {
  if (state.phase === 'game_over') return state;

  const numPlayers = state.players.length;
  let nextIndex = (state.currentTurnIndex + 1) % numPlayers;

  const nextPlayer = state.players[nextIndex];

  const newLogs: GameLogItem[] = [
    ...state.logs,
    {
      id: `log-${Date.now()}-next`,
      text: `Turn passed to ${nextPlayer.name} (${CHARACTERS[nextPlayer.characterId].name}).`,
      type: 'system',
      characterId: nextPlayer.characterId,
      timestamp: Date.now(),
    },
  ];

  return {
    ...state,
    currentTurnIndex: nextIndex,
    turnNumber: state.turnNumber + 1,
    diceRoll: null,
    phase: 'rolling',
    activeEvidenceReveal: null,
    logs: newLogs,
  };
}

// Bot AI Decision Helper
export function getAiTurnDecision(state: GameState): {
  targetRoom: RoomId;
  suggestSuspect: CharacterId;
  suggestWeapon: WeaponId;
  makeAccusation?: {
    suspect: CharacterId;
    weapon: WeaponId;
    room: RoomId;
  };
} {
  const currentAi = state.players[state.currentTurnIndex];
  const dice = state.diceRoll || Math.floor(Math.random() * 6) + 1;
  const reachable = getReachableRooms(currentAi.position, dice, state.houseRules.secretPassages);

  // Pick target room
  const targetRoom = reachable[Math.floor(Math.random() * reachable.length)] || currentAi.position;

  // Filter out cards the AI holds
  const allSuspects = (Object.keys(CHARACTERS) as CharacterId[]).filter(
    s => !currentAi.hand.includes(`suspect_${s}`)
  );
  const allWeapons = (Object.keys(WEAPONS) as WeaponId[]).filter(
    w => !currentAi.hand.includes(`weapon_${w}`)
  );

  const suggestSuspect = allSuspects[Math.floor(Math.random() * allSuspects.length)] || 'scarlet';
  const suggestWeapon = allWeapons[Math.floor(Math.random() * allWeapons.length)] || 'candlestick';

  // If high difficulty AI has played several turns and chance of guessing right
  let makeAccusation: { suspect: CharacterId; weapon: WeaponId; room: RoomId } | undefined = undefined;
  if (!currentAi.hasAccused && state.turnNumber > 8 && Math.random() < 0.2) {
    makeAccusation = {
      suspect: state.secretSolution.suspect,
      weapon: state.secretSolution.weapon,
      room: state.secretSolution.room,
    };
  }

  return {
    targetRoom,
    suggestSuspect,
    suggestWeapon,
    makeAccusation,
  };
}
