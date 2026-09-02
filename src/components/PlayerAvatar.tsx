import React from 'react';
import { Player, CharacterId } from '../types';
import { CHARACTERS } from '../data/gameData';
import { Crown, Bot, AlertCircle } from 'lucide-react';

interface PlayerAvatarProps {
  player: Player;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  isActive = false,
  size = 'md',
  showDetails = false,
  onClick,
}) => {
  const char = CHARACTERS[player.characterId] || CHARACTERS.scarlet;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      id={`avatar-${player.id}`}
      className={`relative inline-flex items-center gap-2 group select-none ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div
        className={`relative rounded-full flex items-center justify-center font-bold font-serif transition-all duration-300 overflow-hidden ${sizeClasses[size]} ${
          isActive 
            ? 'ring-2 ring-[#C9A24B] shadow-[0_0_15px_rgba(201,162,75,0.4)] scale-105' 
            : 'border border-[#3A3340] opacity-95 hover:opacity-100'
        }`}
        style={{
          backgroundColor: char.color,
          color: char.id === 'white' ? '#141118' : '#F3EDE4',
        }}
      >
        {char.imageUrl ? (
          <img
            src={char.imageUrl}
            alt={char.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(char.name)}</span>
        )}

        {/* Host Crown */}
        {player.isHost && (
          <span 
            className="absolute -top-1 -right-1 bg-[#141118] text-[#C9A24B] p-0.5 rounded-full border border-[#C9A24B]/60 shadow-sm z-10"
            title="Host Detective"
          >
            <Crown className="w-3 h-3" />
          </span>
        )}

        {/* AI Badge */}
        {player.isAi && !player.isHost && (
          <span 
            className="absolute -bottom-1 -right-1 bg-[#1F1B24] text-[#9A93A6] p-0.5 rounded-full border border-[#3A3340] z-10"
            title="AI Detective"
          >
            <Bot className="w-2.5 h-2.5" />
          </span>
        )}

        {/* Out of Accusations warning */}
        {player.hasAccused && (
          <span 
            className="absolute -top-1 -left-1 bg-[#B5273B] text-[#F3EDE4] p-0.5 rounded-full border border-[#141118] z-10"
            title="Out of Accusations"
          >
            <AlertCircle className="w-3 h-3" />
          </span>
        )}
      </div>

      {showDetails && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-xs text-[#F3EDE4] truncate max-w-[90px]">
              {player.name}
            </span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] animate-pulse" />
            )}
          </div>
          <span className={`text-[10px] truncate max-w-[100px] ${char.textColor}`}>
            {char.name}
          </span>
        </div>
      )}
    </div>
  );
};

export const PlayerToken: React.FC<{
  characterId: CharacterId;
  isCurrent?: boolean;
  label?: string;
}> = ({ characterId, isCurrent = false, label }) => {
  const char = CHARACTERS[characterId] || CHARACTERS.scarlet;

  return (
    <div 
      className={`relative rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform overflow-hidden ${
        isCurrent 
          ? 'w-8 h-8 ring-2 ring-[#C9A24B] shadow-[0_0_14px_rgba(201,162,75,0.7)] animate-pulse-gold scale-110 z-20' 
          : 'w-7 h-7 border-2 border-[#141118]/90 hover:scale-110 z-10'
      }`}
      style={{
        backgroundColor: char.color,
        color: char.id === 'white' ? '#141118' : '#F3EDE4',
      }}
      title={label || char.name}
    >
      {char.imageUrl ? (
        <img
          src={char.imageUrl}
          alt={char.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-[10px] tracking-tighter">
          {char.name.split(' ')[1]?.[0] || char.name[0]}
        </span>
      )}
    </div>
  );
};
