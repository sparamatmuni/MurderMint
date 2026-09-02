import React, { useState } from 'react';
import { playDiceSound } from '../utils/sound';
import { Dices } from 'lucide-react';

interface DiceProps {
  value: number | null;
  onRoll: () => void;
  isRolling?: boolean;
  disabled?: boolean;
}

export const Dice: React.FC<DiceProps> = ({
  value,
  onRoll,
  isRolling = false,
  disabled = false,
}) => {
  const [localRolling, setLocalRolling] = useState(false);

  const handleRoll = () => {
    if (disabled || isRolling || localRolling) return;
    playDiceSound();
    setLocalRolling(true);
    setTimeout(() => {
      setLocalRolling(false);
      onRoll();
    }, 600);
  };

  const activeRolling = isRolling || localRolling;

  // Render pip dots for die faces (1 through 6)
  const renderPips = (num: number) => {
    const pips: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };

    const activeIndices = pips[num] || [4];

    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-8 h-8 p-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full mx-auto my-auto transition-opacity ${
              activeIndices.includes(i) ? 'bg-[#141118]' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-3">
      {/* 3D Ivory Die Box */}
      <div
        id="dice-die-element"
        onClick={handleRoll}
        className={`w-14 h-14 rounded-xl bg-[#F3EDE4] border-2 border-[#C9A24B] shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer transition-transform ${
          activeRolling ? 'animate-spin scale-110' : 'hover:scale-105 active:scale-95'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={disabled ? 'Dice already rolled' : 'Click to roll dice'}
      >
        {activeRolling ? (
          <Dices className="w-7 h-7 text-[#141118] animate-bounce" />
        ) : value ? (
          renderPips(value)
        ) : (
          <Dices className="w-7 h-7 text-[#141118]" />
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-wider text-[#9A93A6] font-mono">
          Movement Die
        </span>
        <span className="text-sm font-bold font-cormorant text-[#F3EDE4]">
          {activeRolling ? 'Rolling...' : value ? `${value} Steps` : 'Ready to Roll'}
        </span>
      </div>
    </div>
  );
};
