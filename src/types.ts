export type CharacterId = 'scarlet' | 'mustard' | 'peacock' | 'plum' | 'green' | 'white';

export type WeaponId = 'candlestick' | 'dagger' | 'lead_pipe' | 'revolver' | 'rope' | 'wrench';

export type RoomId = 
  | 'kitchen'
  | 'ballroom'
  | 'conservatory'
  | 'dining_room'
  | 'billiard_room'
  | 'library'
  | 'lounge'
  | 'hall'
  | 'study';

export type CardCategory = 'suspect' | 'weapon' | 'room';

export type DeductionState = 'unknown' | 'eliminated' | 'confirmed' | 'in_hand';

export interface GameCard {
  id: string;
  name: string;
  category: CardCategory;
  rawId: CharacterId | WeaponId | RoomId;
  description: string;
  icon: string;
}

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  title: string;
  color: string;
  accentColor: string;
  bgBadge: string;
  textColor: string;
  borderClass: string;
  bio: string;
  startingRoom: RoomId;
  imageUrl?: string;
}

export interface WeaponInfo {
  id: WeaponId;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
}

export interface RoomInfo {
  id: RoomId;
  name: string;
  description: string;
  secretPassageTo?: RoomId;
  gridRow: number;
  gridCol: number;
  doors: string[];
  ambientText: string;
  imageUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  characterId: CharacterId;
  isHost: boolean;
  isAi: boolean;
  isReady: boolean;
  position: RoomId;
  previousPosition?: RoomId;
  hand: string[]; // Card IDs
  hasAccused: boolean;
  outOfGame: boolean;
}

export type GamePhase = 
  | 'lobby'
  | 'rolling'
  | 'moving'
  | 'room_actions'
  | 'suggesting'
  | 'awaiting_reveal'
  | 'accusing'
  | 'turn_end'
  | 'game_over';

export interface Suggestion {
  id: string;
  suggesterId: string;
  suggesterName: string;
  suggesterCharacter: CharacterId;
  suspectId: CharacterId;
  weaponId: WeaponId;
  roomId: RoomId;
  disproverId?: string;
  disproverName?: string;
  revealedCardId?: string;
  timestamp: number;
}

export interface Accusation {
  id: string;
  accuserId: string;
  accuserName: string;
  accuserCharacter: CharacterId;
  suspectId: CharacterId;
  weaponId: WeaponId;
  roomId: RoomId;
  isCorrect: boolean;
  timestamp: number;
}

export interface GameLogItem {
  id: string;
  text: string;
  type: 'move' | 'roll' | 'suggest' | 'reveal' | 'accuse' | 'system' | 'eliminate';
  characterId?: CharacterId;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderCharacter?: CharacterId;
  text: string;
  timestamp: number;
  isSystem?: boolean;
  isWhisper?: boolean;
  recipientName?: string;
  isAi?: boolean;
  quickReaction?: string;
}

export interface SecretSolution {
  suspect: CharacterId;
  weapon: WeaponId;
  room: RoomId;
}

export interface HouseRules {
  secretPassages: boolean;
  autoNotes: boolean;
  aiDifficulty: 'easy' | 'medium' | 'detective';
  diceCount: 1 | 2;
}

export interface GameState {
  roomCode: string;
  roomName: string;
  players: Player[];
  currentTurnIndex: number;
  turnNumber: number;
  diceRoll: number | null;
  phase: GamePhase;
  secretSolution: SecretSolution;
  suggestions: Suggestion[];
  accusations: Accusation[];
  logs: GameLogItem[];
  winnerId: string | null;
  isColdCase: boolean;
  houseRules: HouseRules;
  activeEvidenceReveal: {
    suggestion: Suggestion;
    cardId?: string;
    disproverName?: string;
    noOneHadEvidence: boolean;
  } | null;
}
