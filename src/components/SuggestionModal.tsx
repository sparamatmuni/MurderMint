import React, { useState } from 'react';
import { CharacterId, WeaponId, RoomId } from '../types';
import { CHARACTERS, WEAPONS, ROOMS } from '../data/gameData';
import { EvidenceCard } from './EvidenceCard';
import { ALL_CARDS } from '../data/gameData';
import { HelpCircle, X, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoom: RoomId;
  onSubmitSuggestion: (suspect: CharacterId, weapon: WeaponId, room: RoomId) => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({
  isOpen,
  onClose,
  currentRoom,
  onSubmitSuggestion,
}) => {
  const [selectedSuspect, setSelectedSuspect] = useState<CharacterId>('scarlet');
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponId>('candlestick');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const roomCard = ALL_CARDS.find(c => c.category === 'room' && c.rawId === currentRoom)!;
  const suspectCard = ALL_CARDS.find(c => c.category === 'suspect' && c.rawId === selectedSuspect)!;
  const weaponCard = ALL_CARDS.find(c => c.category === 'weapon' && c.rawId === selectedWeapon)!;

  const handleSubmit = () => {
    playClickSound();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuggestion(selectedSuspect, selectedWeapon, currentRoom);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141118]/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#1F1B24] border-2 border-[#3A3340] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-5 sm:p-6 text-[#F3EDE4]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3A3340] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#2FBF8F]/20 text-[#2FBF8F] border border-[#2FBF8F]/40">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cormorant font-bold text-xl text-[#F3EDE4] tracking-wide">
                Interrogation & Suggestion
              </h3>
              <p className="text-xs text-[#9A93A6] font-dm">
                Formulate your hypothesis to challenge other detectives
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#141118] text-[#9A93A6] hover:text-[#F3EDE4] border border-[#3A3340] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Trio Preview Cards */}
        <div className="bg-[#120B07] border-2 border-[#5A3E2B] rounded-xl p-3.5 mb-5 grid grid-cols-3 gap-2.5 items-center">
          {/* Suspect Preview */}
          <div className="flex flex-col items-center text-center p-2 rounded-lg bg-[#1E140D] border border-[#B5273B]/50">
            <span className="text-[9px] uppercase font-bold text-[#E63946] tracking-wider mb-1 font-typewriter">
              Suspect
            </span>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#B5273B] mb-1.5 shadow-md bg-[#120B07]">
              {CHARACTERS[selectedSuspect].imageUrl ? (
                <img
                  src={CHARACTERS[selectedSuspect].imageUrl}
                  alt={CHARACTERS[selectedSuspect].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: CHARACTERS[selectedSuspect].color }}
                >
                  {CHARACTERS[selectedSuspect].name[0]}
                </div>
              )}
            </div>
            <span className="font-antique font-bold text-xs text-[#F7EFE2] truncate w-full">
              {CHARACTERS[selectedSuspect].name}
            </span>
          </div>

          {/* Weapon Preview */}
          <div className="flex flex-col items-center text-center p-2 rounded-lg bg-[#1E140D] border border-[#C99738]/50">
            <span className="text-[9px] uppercase font-bold text-[#D4AF37] tracking-wider mb-1 font-typewriter">
              Weapon
            </span>
            <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-[#C99738] mb-1.5 shadow-md bg-[#120B07]">
              {WEAPONS[selectedWeapon].imageUrl ? (
                <img
                  src={WEAPONS[selectedWeapon].imageUrl}
                  alt={WEAPONS[selectedWeapon].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                  ⚔
                </div>
              )}
            </div>
            <span className="font-antique font-bold text-xs text-[#F7EFE2] truncate w-full">
              {WEAPONS[selectedWeapon].name}
            </span>
          </div>

          {/* Room Preview */}
          <div className="flex flex-col items-center text-center p-2 rounded-lg bg-[#1E140D] border border-[#2FBF8F]/50">
            <span className="text-[9px] uppercase font-bold text-[#48BB78] tracking-wider mb-1 font-typewriter">
              Room (Current)
            </span>
            <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-[#2FBF8F] mb-1.5 shadow-md bg-[#120B07]">
              {ROOMS[currentRoom].imageUrl ? (
                <img
                  src={ROOMS[currentRoom].imageUrl}
                  alt={ROOMS[currentRoom].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#48BB78] font-bold text-sm">
                  🏰
                </div>
              )}
            </div>
            <span className="font-antique font-bold text-xs text-[#F7EFE2] truncate w-full">
              {ROOMS[currentRoom].name}
            </span>
          </div>
        </div>

        {/* Step 1: Select Suspect */}
        <div className="mb-4">
          <label className="text-xs font-bold font-antique uppercase tracking-wider text-[#E63946] block mb-2 flex items-center gap-1.5">
            <span>1. Question a Suspect</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(CHARACTERS) as CharacterId[]).map(sId => {
              const char = CHARACTERS[sId];
              const isSelected = selectedSuspect === sId;

              return (
                <button
                  key={sId}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSelectedSuspect(sId);
                  }}
                  className={`p-1.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#B5273B]/25 border-[#E63946] shadow-[0_0_12px_rgba(230,57,70,0.4)] scale-105'
                      : 'bg-[#1E140D] border-[#4A3322] hover:border-[#E63946]/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#120B07] shadow bg-[#120B07]">
                    {char.imageUrl ? (
                      <img
                        src={char.imageUrl}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-bold text-xs"
                        style={{
                          backgroundColor: char.color,
                          color: char.id === 'white' ? '#120B07' : '#F7EFE2',
                        }}
                      >
                        {char.name[0]}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-antique font-semibold leading-tight truncate w-full text-[#F7EFE2]">
                    {char.name.split(' ')[1] || char.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Weapon */}
        <div className="mb-4">
          <label className="text-xs font-bold font-antique uppercase tracking-wider text-[#D4AF37] block mb-2">
            2. Propose a Murder Weapon
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(WEAPONS) as WeaponId[]).map(wId => {
              const weapon = WEAPONS[wId];
              const isSelected = selectedWeapon === wId;

              return (
                <button
                  key={wId}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSelectedWeapon(wId);
                  }}
                  className={`p-1.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#C99738]/25 border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-105'
                      : 'bg-[#1E140D] border-[#4A3322] hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#5A3E2B] shadow bg-[#120B07]">
                    {weapon.imageUrl ? (
                      <img
                        src={weapon.imageUrl}
                        alt={weapon.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs">
                        ⚔
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-antique font-semibold leading-tight truncate w-full text-[#F7EFE2]">
                    {weapon.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Room Notification (Fixed) */}
        <div className="bg-[#2A2430] p-3 rounded-lg border border-[#3A3340] mb-5 text-xs text-[#9A93A6] flex items-center justify-between">
          <span>
            Location locked to your current room: <strong className="text-[#2FBF8F]">{ROOMS[currentRoom].name}</strong>
          </span>
          <span className="text-[10px] font-mono text-[#C9A24B]">Mansion Rule</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 mt-auto pt-2 border-t border-[#3A3340]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#141118] hover:bg-[#2A2430] text-[#9A93A6] border border-[#3A3340] text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="btn-submit-suggestion"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-[#2FBF8F] hover:bg-[#269E76] text-[#141118] font-bold text-sm shadow-lg shadow-[0_0_15px_rgba(47,191,143,0.3)] transition-all flex items-center gap-2 cursor-pointer font-dm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'QUESTIONING DETECTIVES...' : 'MAKE SUGGESTION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
