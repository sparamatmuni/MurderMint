import React from 'react';
import { GameCard, CardCategory, RoomId, CharacterId, WeaponId } from '../types';
import { 
  User, 
  Shield, 
  Crown, 
  BookOpen, 
  Briefcase, 
  Key, 
  Flame, 
  Sword, 
  Wrench, 
  Crosshair, 
  Anchor, 
  Hammer, 
  Utensils, 
  Music, 
  Flower2, 
  Coffee, 
  CircleDot, 
  Book, 
  Armchair, 
  Landmark, 
  Scroll 
} from 'lucide-react';
import { CHARACTERS, WEAPONS, ROOMS } from '../data/gameData';

interface EvidenceCardProps {
  card: GameCard;
  isSelected?: boolean;
  isRevealed?: boolean;
  isDimmed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  card,
  isSelected = false,
  isRevealed = true,
  isDimmed = false,
  size = 'md',
  onClick,
}) => {
  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'User': return <User className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Key': return <Key className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Sword': return <Sword className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      case 'Crosshair': return <Crosshair className={className} />;
      case 'Anchor': return <Anchor className={className} />;
      case 'Hammer': return <Hammer className={className} />;
      case 'Utensils': return <Utensils className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Flower2': return <Flower2 className={className} />;
      case 'Coffee': return <Coffee className={className} />;
      case 'CircleDot': return <CircleDot className={className} />;
      case 'Book': return <Book className={className} />;
      case 'Armchair': return <Armchair className={className} />;
      case 'Landmark': return <Landmark className={className} />;
      case 'Scroll': return <Scroll className={className} />;
      default: return <Key className={className} />;
    }
  };

  const categoryLabels: Record<CardCategory, { label: string; color: string; border: string; bg: string }> = {
    suspect: {
      label: 'SUSPECT',
      color: 'text-[#E63946]',
      border: 'border-[#B5273B]',
      bg: 'bg-[#B5273B]/30',
    },
    weapon: {
      label: 'WEAPON',
      color: 'text-[#D4AF37]',
      border: 'border-[#C99738]',
      bg: 'bg-[#C99738]/30',
    },
    room: {
      label: 'ROOM',
      color: 'text-[#48BB78]',
      border: 'border-[#2FBF8F]',
      bg: 'bg-[#2FBF8F]/30',
    },
  };

  const badge = categoryLabels[card.category];

  // Specific accent colors for suspects
  let charColor = '#C9A24B';
  if (card.category === 'suspect' && card.rawId in CHARACTERS) {
    charColor = CHARACTERS[card.rawId as CharacterId].color;
  }

  const dimensions = {
    sm: 'w-28 h-40 p-2 text-xs',
    md: 'w-36 h-52 p-2.5 text-sm',
    lg: 'w-48 h-68 p-3 text-base',
  };

  if (!isRevealed) {
    return (
      <div 
        className={`${dimensions[size]} rounded-xl bg-[#1E140D] border-2 border-[#5A3E2B] flex flex-col items-center justify-center relative shadow-lg select-none`}
      >
        <div className="absolute inset-2 border border-dashed border-[#5A3E2B] rounded-lg flex flex-col items-center justify-center bg-[#120B07]">
          <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-antique font-bold text-xs mb-1">
            MM
          </div>
          <span className="text-[10px] tracking-widest text-[#BAAFA1] font-typewriter uppercase">
            Confidential
          </span>
        </div>
      </div>
    );
  }

  // Get rich vintage artwork
  let cardArtworkUrl: string | undefined = undefined;
  if (card.category === 'suspect' && card.rawId in CHARACTERS) {
    cardArtworkUrl = CHARACTERS[card.rawId as CharacterId]?.imageUrl;
  } else if (card.category === 'weapon' && card.rawId in WEAPONS) {
    cardArtworkUrl = WEAPONS[card.rawId as WeaponId]?.imageUrl;
  } else if (card.category === 'room' && card.rawId in ROOMS) {
    cardArtworkUrl = ROOMS[card.rawId as RoomId]?.imageUrl;
  }

  return (
    <div
      id={`evidence-card-${card.id}`}
      onClick={onClick}
      className={`${dimensions[size]} rounded-xl bg-[#1E140D] border-2 transition-all duration-200 flex flex-col justify-between relative shadow-xl select-none group overflow-hidden ${
        isSelected
          ? 'border-[#D4AF37] shadow-[0_0_22px_rgba(212,175,55,0.6)] scale-105 -translate-y-1 bg-[#2A1B12]'
          : isDimmed
          ? 'border-[#4A3322] opacity-40 hover:opacity-80'
          : 'border-[#5A3E2B] hover:border-[#D4AF37]/80 hover:-translate-y-0.5'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Top Header with Category Badge & Status indicator */}
      <div className="flex items-center justify-between z-10 pb-1">
        <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded ${badge.bg} ${badge.color} border ${badge.border} backdrop-blur-sm`}>
          {badge.label}
        </span>
        <div 
          className="w-2.5 h-2.5 rounded-full border border-[#120B07] shadow"
          style={{ backgroundColor: charColor }}
        />
      </div>

      {/* Center Artwork or Motif */}
      <div className="relative my-auto flex-1 w-full rounded-lg overflow-hidden border border-[#5A3E2B] bg-[#120B07] flex items-center justify-center my-1 group-hover:border-[#D4AF37]/50 transition-colors">
        {cardArtworkUrl ? (
          <>
            <img
              src={cardArtworkUrl}
              alt={card.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120B07]/80 via-transparent to-[#120B07]/30 pointer-events-none" />
          </>
        ) : (
          <div 
            className="p-3 rounded-full bg-[#1E140D] border border-[#5A3E2B] shadow-inner"
            style={{ color: card.category === 'suspect' ? charColor : badge.color.replace('text-', '') }}
          >
            {renderIcon(card.icon, size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12')}
          </div>
        )}
      </div>

      {/* Card Title & Brief Description */}
      <div className="pt-1 text-center z-10">
        <h4 className="font-antique font-bold text-[#F7EFE2] leading-tight text-xs truncate group-hover:text-[#D4AF37] transition-colors">
          {card.name}
        </h4>
        {size !== 'sm' && card.description && (
          <p className="text-[9px] text-[#BAAFA1] line-clamp-1 mt-0.5 font-sans">
            {card.description}
          </p>
        )}
      </div>

      {/* Subtle Corner Accents */}
      <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#D4AF37]/40 pointer-events-none" />
      <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#D4AF37]/40 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#D4AF37]/40 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#D4AF37]/40 pointer-events-none" />
    </div>
  );
};
