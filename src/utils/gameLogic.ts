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

// ===== SMART AI DETECTIVE MEMORY SYSTEM =====
// AI tracks observations: what it has seen disproved, which players hold which cards.
// Difficulty determines how strategically it reasons.

interface AiMemory {
  /** Cards this AI knows are NOT in the envelope (seen via disprove or own hand) */
  eliminatedCards: Set<string>;
  /** Per-card: which players were disproven with this card (cardId -> playerId[]) */
  playerCardHints: Map<string, Set<string>>;
  /** Rooms this AI has personally visited */
  visitedRooms: Set<RoomId>;
  /** Suggestions that fell silent (no one could disprove) */
  silentSuggestions: Array<{ suspectId: CharacterId; weaponId: WeaponId; roomId: RoomId }>;
}

// Per-AI memory store keyed by player ID
const aiMemoryStore = new Map<string, AiMemory>();

export function initAiMemory(playerId: string, hand: string[]): void {
  const memory: AiMemory = {
    eliminatedCards: new Set(hand), // Cards in own hand are eliminated
    playerCardHints: new Map(),
    visitedRooms: new Set(),
    silentSuggestions: [],
  };
  aiMemoryStore.set(playerId, memory);
}

export function updateAiMemoryFromSuggestion(
  aiPlayerId: string,
  suggestion: Suggestion,
  observingPlayerIds: string[]
): void {
  const memory = aiMemoryStore.get(aiPlayerId);
  if (!memory) return;

  // If someone disproved, we know they hold at least one of the 3 cards
  if (suggestion.disproverId && suggestion.revealedCardId) {
    const existing = memory.playerCardHints.get(suggestion.revealedCardId) || new Set();
    existing.add(suggestion.disproverId);
    memory.playerCardHints.set(suggestion.revealedCardId, existing);
  }

  // If no one could disprove, all 3 suggested cards are very likely the answer
  if (!suggestion.disproverId) {
    memory.silentSuggestions.push({
      suspectId: suggestion.suspectId,
      weaponId: suggestion.weaponId,
      roomId: suggestion.roomId,
    });
  }
}

function getAiMemory(playerId: string): AiMemory {
  if (!aiMemoryStore.has(playerId)) {
    aiMemoryStore.set(playerId, {
      eliminatedCards: new Set(),
      playerCardHints: new Map(),
      visitedRooms: new Set(),
      silentSuggestions: [],
    });
  }
  return aiMemoryStore.get(playerId)!;
}

// Get cards the AI has NOT eliminated (potential envelope candidates)
function getRemainingSuspects(memory: AiMemory, hand: string[]): CharacterId[] {
  return (Object.keys(CHARACTERS) as CharacterId[]).filter(
    s => !memory.eliminatedCards.has(`suspect_${s}`) && !hand.includes(`suspect_${s}`)
  );
}

function getRemainingWeapons(memory: AiMemory, hand: string[]): WeaponId[] {
  return (Object.keys(WEAPONS) as WeaponId[]).filter(
    w => !memory.eliminatedCards.has(`weapon_${w}`) && !hand.includes(`weapon_${w}`)
  );
}

function getRemainingRooms(memory: AiMemory, hand: string[]): RoomId[] {
  return (Object.keys(ROOMS) as RoomId[]).filter(
    r => !memory.eliminatedCards.has(`room_${r}`) && !hand.includes(`room_${r}`)
  );
}

// ===== Bot AI Decision Helper (Smart Version) =====
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
  const difficulty = state.houseRules.aiDifficulty;
  const memory = getAiMemory(currentAi.id);

  // Mark current room as visited
  memory.visitedRooms.add(currentAi.position);

  // Also learn from all past suggestions in the game
  state.suggestions.forEach(sug => {
    updateAiMemoryFromSuggestion(currentAi.id, sug, state.players.map(p => p.id));
  });

  const remainingSuspects = getRemainingSuspects(memory, currentAi.hand);
  const remainingWeapons = getRemainingWeapons(memory, currentAi.hand);
  const remainingRooms = getRemainingRooms(memory, currentAi.hand);

  // ===== TARGET ROOM SELECTION =====
  let targetRoom: RoomId;
  if (difficulty === 'detective') {
    // Prioritize rooms not yet visited, then rooms matching remaining rooms
    const unvisitedRooms = reachable.filter(r => !memory.visitedRooms.has(r));
    const unvisitedRemaining = unvisitedRooms.filter(r => remainingRooms.includes(r));
    if (unvisitedRemaining.length > 0) {
      targetRoom = unvisitedRemaining[Math.floor(Math.random() * unvisitedRemaining.length)];
    } else if (unvisitedRooms.length > 0) {
      targetRoom = unvisitedRooms[Math.floor(Math.random() * unvisitedRooms.length)];
    } else {
      targetRoom = reachable[Math.floor(Math.random() * reachable.length)] || currentAi.position;
    }
  } else if (difficulty === 'medium') {
    // Sometimes pick unvisited rooms
    const unvisited = reachable.filter(r => !memory.visitedRooms.has(r));
    if (unvisited.length > 0 && Math.random() < 0.6) {
      targetRoom = unvisited[Math.floor(Math.random() * unvisited.length)];
    } else {
      targetRoom = reachable[Math.floor(Math.random() * reachable.length)] || currentAi.position;
    }
  } else {
    // Easy: fully random
    targetRoom = reachable[Math.floor(Math.random() * reachable.length)] || currentAi.position;
  }

  // ===== SUGGESTION SELECTION =====
  let suggestSuspect: CharacterId;
  let suggestWeapon: WeaponId;

  if (difficulty === 'detective' && remainingSuspects.length > 0 && remainingWeapons.length > 0) {
    // Strategic: only suggest suspects/weapons NOT yet eliminated
    suggestSuspect = remainingSuspects[Math.floor(Math.random() * remainingSuspects.length)];
    suggestWeapon = remainingWeapons[Math.floor(Math.random() * remainingWeapons.length)];
  } else if (difficulty === 'medium') {
    // 70% chance to use remaining, 30% random
    if (Math.random() < 0.7 && remainingSuspects.length > 0 && remainingWeapons.length > 0) {
      suggestSuspect = remainingSuspects[Math.floor(Math.random() * remainingSuspects.length)];
      suggestWeapon = remainingWeapons[Math.floor(Math.random() * remainingWeapons.length)];
    } else {
      const allSuspects = (Object.keys(CHARACTERS) as CharacterId[]).filter(
        s => !currentAi.hand.includes(`suspect_${s}`)
      );
      const allWeapons = (Object.keys(WEAPONS) as WeaponId[]).filter(
        w => !currentAi.hand.includes(`weapon_${w}`)
      );
      suggestSuspect = allSuspects[Math.floor(Math.random() * allSuspects.length)] || 'scarlet';
      suggestWeapon = allWeapons[Math.floor(Math.random() * allWeapons.length)] || 'candlestick';
    }
  } else {
    // Easy: random
    const allSuspects = (Object.keys(CHARACTERS) as CharacterId[]).filter(
      s => !currentAi.hand.includes(`suspect_${s}`)
    );
    const allWeapons = (Object.keys(WEAPONS) as WeaponId[]).filter(
      w => !currentAi.hand.includes(`weapon_${w}`)
    );
    suggestSuspect = allSuspects[Math.floor(Math.random() * allSuspects.length)] || 'scarlet';
    suggestWeapon = allWeapons[Math.floor(Math.random() * allWeapons.length)] || 'candlestick';
  }

  // ===== ACCUSATION LOGIC =====
  let makeAccusation: { suspect: CharacterId; weapon: WeaponId; room: RoomId } | undefined = undefined;

  if (!currentAi.hasAccused) {
    if (difficulty === 'detective') {
      // Accuse only when we've narrowed to exactly 1 candidate per category
      if (remainingSuspects.length === 1 && remainingWeapons.length === 1 && remainingRooms.length === 1) {
        makeAccusation = {
          suspect: remainingSuspects[0],
          weapon: remainingWeapons[0],
          room: remainingRooms[0],
        };
      } else if (state.turnNumber > 20 && remainingSuspects.length <= 2 && remainingWeapons.length <= 2 && remainingRooms.length <= 2) {
        // After many turns, take a calculated risk
        makeAccusation = {
          suspect: remainingSuspects[0],
          weapon: remainingWeapons[0],
          room: remainingRooms[0],
        };
      }
    } else if (difficulty === 'medium') {
      // After turn 10, small chance to accuse with best guesses
      if (state.turnNumber > 10 && remainingSuspects.length <= 3 && remainingWeapons.length <= 3 && remainingRooms.length <= 3 && Math.random() < 0.15) {
        makeAccusation = {
          suspect: remainingSuspects[0],
          weapon: remainingWeapons[0],
          room: remainingRooms[0],
        };
      }
    } else {
      // Easy: random chance after turn 8
      if (state.turnNumber > 8 && Math.random() < 0.12) {
        const randSuspect = remainingSuspects[0] || (Object.keys(CHARACTERS) as CharacterId[])[0];
        const randWeapon = remainingWeapons[0] || (Object.keys(WEAPONS) as WeaponId[])[0];
        const randRoom = remainingRooms[0] || (Object.keys(ROOMS) as RoomId[])[0];
        makeAccusation = {
          suspect: randSuspect,
          weapon: randWeapon,
          room: randRoom,
        };
      }
    }
  }

  return {
    targetRoom,
    suggestSuspect,
    suggestWeapon,
    makeAccusation,
  };
}
