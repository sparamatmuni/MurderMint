import { 
  CharacterId, 
  CharacterInfo, 
  WeaponId, 
  WeaponInfo, 
  RoomId, 
  RoomInfo, 
  GameCard 
} from '../types';

import bungalowExteriorImg from '../assets/images/bungalow_exterior_1787633886090.jpg';
import roomKitchenImg from '../assets/images/room_kitchen_1787633957300.jpg';
import roomBallroomImg from '../assets/images/room_ballroom_1787633938262.jpg';
import roomConservatoryImg from '../assets/images/room_conservatory_1787633927809.jpg';
import roomDiningRoomImg from '../assets/images/room_dining_room_1787633969569.jpg';
import roomBilliardImg from '../assets/images/room_billiard_1787633982134.jpg';
import roomLibraryImg from '../assets/images/room_library_1787633914841.jpg';
import roomLoungeImg from '../assets/images/room_lounge_study_1787633996367.jpg';
import roomGrandHallImg from '../assets/images/room_grand_hall_1787633902898.jpg';
import roomStudyImg from '../assets/images/room_study_1787634010880.jpg';

import charScarletImg from '../assets/images/char_scarlet_1787634742674.jpg';
import charMustardImg from '../assets/images/char_mustard_1787634756412.jpg';
import charWhiteImg from '../assets/images/char_white_1787634767182.jpg';
import charGreenImg from '../assets/images/char_green_1787634778516.jpg';
import charPeacockImg from '../assets/images/char_peacock_1787634792333.jpg';
import charPlumImg from '../assets/images/char_plum_1787634804684.jpg';

import weaponCandlestickImg from '../assets/images/weapon_candlestick_1787634817189.jpg';
import weaponDaggerImg from '../assets/images/weapon_dagger_1787634831283.jpg';
import weaponLeadPipeImg from '../assets/images/weapon_leadpipe_1787634847542.jpg';
import weaponRevolverImg from '../assets/images/weapon_revolver_1787634859317.jpg';
import weaponRopeImg from '../assets/images/weapon_rope_1787634871380.jpg';
import weaponWrenchImg from '../assets/images/weapon_wrench_1787634883941.jpg';

export const BUNGALOW_BG_IMAGE = bungalowExteriorImg;

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  scarlet: {
    id: 'scarlet',
    name: 'Miss Scarlet',
    title: 'The Enigmatic Actress',
    color: '#B5273B',
    accentColor: '#E63946',
    bgBadge: 'bg-red-950/80 text-red-300 border-red-800',
    textColor: 'text-red-400',
    borderClass: 'border-[#B5273B]',
    bio: 'A glamorous London stage actress with a razor-sharp mind and a habit of knowing everyone’s deepest secrets.',
    startingRoom: 'lounge',
    imageUrl: charScarletImg,
  },
  mustard: {
    id: 'mustard',
    name: 'Colonel Mustard',
    title: 'The Decorated Veteran',
    color: '#C9A24B',
    accentColor: '#E0A92C',
    bgBadge: 'bg-amber-950/80 text-amber-300 border-amber-800',
    textColor: 'text-amber-400',
    borderClass: 'border-[#C9A24B]',
    bio: 'A stern imperial officer decorated in foreign campaigns, carrying an explosive temper and heavy debts.',
    startingRoom: 'dining_room',
    imageUrl: charMustardImg,
  },
  peacock: {
    id: 'peacock',
    name: 'Mrs. Peacock',
    title: 'The Grand Socialite',
    color: '#2B6CB0',
    accentColor: '#4299E1',
    bgBadge: 'bg-blue-950/80 text-blue-300 border-blue-800',
    textColor: 'text-blue-400',
    borderClass: 'border-[#2B6CB0]',
    bio: 'An aristocratic widow whose high-society demeanor conceals four late husbands and an empty bank account.',
    startingRoom: 'conservatory',
    imageUrl: charPeacockImg,
  },
  plum: {
    id: 'plum',
    name: 'Professor Plum',
    title: 'The Arcane Scholar',
    color: '#7A3FB0',
    accentColor: '#9F7AEA',
    bgBadge: 'bg-purple-950/80 text-purple-300 border-purple-800',
    textColor: 'text-purple-400',
    borderClass: 'border-[#7A3FB0]',
    bio: 'A disgraced archaeologist and chemist who was expelled from Oxford for studying lethal ancient botanicals.',
    startingRoom: 'study',
    imageUrl: charPlumImg,
  },
  green: {
    id: 'green',
    name: 'Mr. Green',
    title: 'The Shadow Broker',
    color: '#2FBF8F',
    accentColor: '#48BB78',
    bgBadge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    textColor: 'text-emerald-400',
    borderClass: 'border-[#2FBF8F]',
    bio: 'A silver-tongued financier and counterfeit dealer who knows precisely how much every human conscience costs.',
    startingRoom: 'ballroom',
    imageUrl: charGreenImg,
  },
  white: {
    id: 'white',
    name: 'Mrs. White',
    title: 'The Silent Housekeeper',
    color: '#E8DEC8',
    accentColor: '#FAF5EA',
    bgBadge: 'bg-stone-900 text-stone-200 border-stone-700',
    textColor: 'text-stone-300',
    borderClass: 'border-[#E8DEC8]',
    bio: 'The mansion’s solemn housekeeper of thirty years who holds keys to every locked cabinet in Blackwood Manor.',
    startingRoom: 'kitchen',
    imageUrl: charWhiteImg,
  },
};

export const WEAPONS: Record<WeaponId, WeaponInfo> = {
  candlestick: {
    id: 'candlestick',
    name: 'Brass Candlestick',
    description: 'Heavy solid brass heirloom with sharp sculpted edges and wax stains.',
    icon: 'Flame',
    imageUrl: weaponCandlestickImg,
  },
  dagger: {
    id: 'dagger',
    name: 'Antique Dagger',
    description: 'A damascus steel hunting dagger engraved with an unholy crest.',
    icon: 'Sword',
    imageUrl: weaponDaggerImg,
  },
  lead_pipe: {
    id: 'lead_pipe',
    name: 'Lead Pipe',
    description: 'A blunt, heavy section of plumbing wrenched from the manor cellar.',
    icon: 'Wrench',
    imageUrl: weaponLeadPipeImg,
  },
  revolver: {
    id: 'revolver',
    name: 'Engraved Revolver',
    description: 'A customized .38 caliber snub-nose pistol with ivory inlay and five live rounds.',
    icon: 'Crosshair',
    imageUrl: weaponRevolverImg,
  },
  rope: {
    id: 'rope',
    name: 'Braided Rope',
    description: 'Thick hemp bell-rope cut cleanly from the grand courtyard tower.',
    icon: 'Anchor',
    imageUrl: weaponRopeImg,
  },
  wrench: {
    id: 'wrench',
    name: 'Heavy Wrench',
    description: 'A cast-iron boiler wrench capable of crushing heavy padlocks.',
    icon: 'Hammer',
    imageUrl: weaponWrenchImg,
  },
};

export const ROOMS: Record<RoomId, RoomInfo> = {
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Cold stone floors, cast iron stoves, and a meat hook swaying quietly.',
    secretPassageTo: 'study',
    gridRow: 0,
    gridCol: 0,
    doors: ['dining_room', 'ballroom'],
    ambientText: 'The cast iron hearth is still warm...',
    imageUrl: roomKitchenImg,
  },
  ballroom: {
    id: 'ballroom',
    name: 'Ballroom',
    description: 'Vast parquet floors under a grand Bohemian crystal chandelier.',
    gridRow: 0,
    gridCol: 1,
    doors: ['kitchen', 'conservatory'],
    ambientText: 'Dust motes dance over the grand piano...',
    imageUrl: roomBallroomImg,
  },
  conservatory: {
    id: 'conservatory',
    name: 'Conservatory',
    description: 'A glass greenhouse tangled with nightshade and exotic ferns.',
    secretPassageTo: 'lounge',
    gridRow: 0,
    gridCol: 2,
    doors: ['ballroom', 'billiard_room'],
    ambientText: 'Rain taps against the cracked glass dome...',
    imageUrl: roomConservatoryImg,
  },
  dining_room: {
    id: 'dining_room',
    name: 'Dining Room',
    description: 'A long mahogany table set for eight guests who never ate dessert.',
    gridRow: 1,
    gridCol: 0,
    doors: ['kitchen', 'lounge'],
    ambientText: 'Half-empty wine glasses sit untouched...',
    imageUrl: roomDiningRoomImg,
  },
  billiard_room: {
    id: 'billiard_room',
    name: 'Billiard Room',
    description: 'Green baize table, cue racks, and a faint smell of cigar smoke.',
    gridRow: 1,
    gridCol: 1,
    doors: ['conservatory', 'library'],
    ambientText: 'The 8-ball rests near the corner pocket...',
    imageUrl: roomBilliardImg,
  },
  library: {
    id: 'library',
    name: 'Library',
    description: 'Floor-to-ceiling leather-bound tomes and a ladder near the safe.',
    gridRow: 1,
    gridCol: 2,
    doors: ['billiard_room', 'study'],
    ambientText: 'An open encyclopedia on toxicology lies on the desk...',
    imageUrl: roomLibraryImg,
  },
  lounge: {
    id: 'lounge',
    name: 'Lounge',
    description: 'Plush velvet armchairs facing an unlit marble fireplace.',
    secretPassageTo: 'conservatory',
    gridRow: 2,
    gridCol: 0,
    doors: ['dining_room', 'hall'],
    ambientText: 'Faint embers glow in the grate...',
    imageUrl: roomLoungeImg,
  },
  hall: {
    id: 'hall',
    name: 'Grand Hall',
    description: 'The monumental entrance with dual staircases and suits of armor.',
    gridRow: 2,
    gridCol: 1,
    doors: ['lounge', 'study'],
    ambientText: 'The grandfather clock chimes midnight...',
    imageUrl: roomGrandHallImg,
  },
  study: {
    id: 'study',
    name: 'Study',
    description: 'Dark wood wainscoting, a roll-top desk, and a concealed wall safe.',
    secretPassageTo: 'kitchen',
    gridRow: 2,
    gridCol: 2,
    doors: ['hall', 'library'],
    ambientText: 'Shredded financial ledgers litter the wastebasket...',
    imageUrl: roomStudyImg,
  },
};

// Adjacency graph for mansion navigation
export const ROOM_ADJACENCY: Record<RoomId, RoomId[]> = {
  kitchen: ['dining_room', 'ballroom'],
  ballroom: ['kitchen', 'conservatory'],
  conservatory: ['ballroom', 'billiard_room'],
  dining_room: ['kitchen', 'lounge'],
  billiard_room: ['conservatory', 'library'],
  library: ['billiard_room', 'study'],
  lounge: ['dining_room', 'hall'],
  hall: ['lounge', 'study'],
  study: ['hall', 'library'],
};

// Generate Full 21-Card Deck
export const ALL_CARDS: GameCard[] = [
  // 6 Suspects
  { id: 'suspect_scarlet', rawId: 'scarlet', name: 'Miss Scarlet', category: 'suspect', icon: 'User', description: 'The glamorous London actress' },
  { id: 'suspect_mustard', rawId: 'mustard', name: 'Colonel Mustard', category: 'suspect', icon: 'Shield', description: 'The decorated military officer' },
  { id: 'suspect_peacock', rawId: 'peacock', name: 'Mrs. Peacock', category: 'suspect', icon: 'Crown', description: 'The high-society socialite' },
  { id: 'suspect_plum', rawId: 'plum', name: 'Professor Plum', category: 'suspect', icon: 'BookOpen', description: 'The arcane poison scholar' },
  { id: 'suspect_green', rawId: 'green', name: 'Mr. Green', category: 'suspect', icon: 'Briefcase', description: 'The underground broker' },
  { id: 'suspect_white', rawId: 'white', name: 'Mrs. White', category: 'suspect', icon: 'Key', description: 'The silent manor housekeeper' },

  // 6 Weapons
  { id: 'weapon_candlestick', rawId: 'candlestick', name: 'Brass Candlestick', category: 'weapon', icon: 'Flame', description: 'Heavy solid brass' },
  { id: 'weapon_dagger', rawId: 'dagger', name: 'Antique Dagger', category: 'weapon', icon: 'Sword', description: 'Damascus hunting blade' },
  { id: 'weapon_lead_pipe', rawId: 'lead_pipe', name: 'Lead Pipe', category: 'weapon', icon: 'Wrench', description: 'Heavy plumbing section' },
  { id: 'weapon_revolver', rawId: 'revolver', name: 'Engraved Revolver', category: 'weapon', icon: 'Crosshair', description: '.38 snub-nose pistol' },
  { id: 'weapon_rope', rawId: 'rope', name: 'Braided Rope', category: 'weapon', icon: 'Anchor', description: 'Courtyard bell-rope' },
  { id: 'weapon_wrench', rawId: 'wrench', name: 'Heavy Wrench', category: 'weapon', icon: 'Hammer', description: 'Cast-iron boiler tool' },

  // 9 Rooms
  { id: 'room_kitchen', rawId: 'kitchen', name: 'Kitchen', category: 'room', icon: 'Utensils', description: 'Cold stone hearth' },
  { id: 'room_ballroom', rawId: 'ballroom', name: 'Ballroom', category: 'room', icon: 'Music', description: 'Crystal chandelier hall' },
  { id: 'room_conservatory', rawId: 'conservatory', name: 'Conservatory', category: 'room', icon: 'Flower2', description: 'Glass greenhouse of flora' },
  { id: 'room_dining_room', rawId: 'dining_room', name: 'Dining Room', category: 'room', icon: 'Coffee', description: 'Long mahogany banquet' },
  { id: 'room_billiard_room', rawId: 'billiard_room', name: 'Billiard Room', category: 'room', icon: 'CircleDot', description: 'Green baize cue room' },
  { id: 'room_library', rawId: 'library', name: 'Library', category: 'room', icon: 'Book', description: 'Shelves of leather tomes' },
  { id: 'room_lounge', rawId: 'lounge', name: 'Lounge', category: 'room', icon: 'Armchair', description: 'Velvet fireplace parlor' },
  { id: 'room_hall', rawId: 'hall', name: 'Grand Hall', category: 'room', icon: 'Landmark', description: 'Monumental manor foyer' },
  { id: 'room_study', rawId: 'study', name: 'Study', category: 'room', icon: 'Scroll', description: 'Roll-top desk & wall safe' },
];

export const CARD_BY_ID: Record<string, GameCard> = ALL_CARDS.reduce((acc, card) => {
  acc[card.id] = card;
  return acc;
}, {} as Record<string, GameCard>);

export function getCardForRaw(category: 'suspect' | 'weapon' | 'room', rawId: string): GameCard | undefined {
  return ALL_CARDS.find(c => c.category === category && c.rawId === rawId);
}
