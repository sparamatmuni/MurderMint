import React from 'react';
import { DeductionState } from '../types';
import { HelpCircle, X, Check, Eye } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface DeductionCellProps {
  state: DeductionState;
  onChange: (nextState: DeductionState) => void;
  isInHand?: boolean;
  label: string;
}

export const DeductionCell: React.FC<DeductionCellProps> = ({
  state,
  onChange,
  isInHand = false,
  label,
}) => {
  const getNextState = (current: DeductionState): DeductionState => {
    if (isInHand) return current; // Keep in-hand cards marked
    switch (current) {
      case 'unknown':
        return 'eliminated';
      case 'eliminated':
        return 'confirmed';
      case 'confirmed':
        return 'unknown';
      default:
        return 'eliminated';
    }
  };

  const handleClick = () => {
    playClickSound();
    onChange(getNextState(state));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Status visual mapping (WCAG AA compliant with text/symbols + colors)
  const config = {
    unknown: {
      bg: 'bg-[#141118] hover:bg-[#2A2430] border-[#3A3340]',
      textColor: 'text-[#9A93A6]',
      icon: <HelpCircle className="w-3.5 h-3.5 opacity-50" />,
      text: '?',
      ariaLabel: `${label}: Unknown`,
    },
    eliminated: {
      bg: 'bg-[#B5273B]/20 hover:bg-[#B5273B]/30 border-[#B5273B]/50',
      textColor: 'text-[#E14B4B]',
      icon: <X className="w-3.5 h-3.5 stroke-[2.5]" />,
      text: '✗',
      ariaLabel: `${label}: Ruled out / Disproved`,
    },
    confirmed: {
      bg: 'bg-[#2FBF8F]/20 hover:bg-[#2FBF8F]/30 border-[#2FBF8F]/60',
      textColor: 'text-[#2FBF8F]',
      icon: <Check className="w-3.5 h-3.5 stroke-[2.5]" />,
      text: '✓',
      ariaLabel: `${label}: Confirmed Murder Clue`,
    },
    in_hand: {
      bg: 'bg-[#C9A24B]/20 border-[#C9A24B]/50',
      textColor: 'text-[#C9A24B]',
      icon: <Eye className="w-3.5 h-3.5" />,
      text: 'HAND',
      ariaLabel: `${label}: In your private evidence hand`,
    },
  };

  const current = isInHand ? config.in_hand : config[state];

  return (
    <button
      type="button"
      id={`deduction-cell-${label.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isInHand}
      aria-label={current.ariaLabel}
      title={current.ariaLabel}
      className={`w-7 h-7 rounded border transition-colors flex items-center justify-center font-bold text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A24B] select-none ${current.bg} ${current.textColor} ${
        isInHand ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {current.icon}
    </button>
  );
};
