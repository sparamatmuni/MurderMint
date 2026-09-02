import React, { useState } from 'react';
import { CharacterId, WeaponId, RoomId } from '../types';
import { CHARACTERS, WEAPONS, ROOMS } from '../data/gameData';
import { AlertTriangle, ShieldAlert, X, Skull } from 'lucide-react';
import { playAccusationSound, playClickSound } from '../utils/sound';

interface AccusationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAccusation: (suspect: CharacterId, weapon: WeaponId, room: RoomId) => void;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  isOpen,
  onClose,
  onSubmitAccusation,
}) => {
  const [selectedSuspect, setSelectedSuspect] = useState<CharacterId>('scarlet');
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponId>('candlestick');
  const [selectedRoom, setSelectedRoom] = useState<RoomId>('hall');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!isConfirmed) return;
    playAccusationSound();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitAccusation(selectedSuspect, selectedWeapon, selectedRoom);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141118]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#1F1B24] border-2 border-[#B5273B] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-[0_0_40px_rgba(181,39,59,0.35)] flex flex-col p-5 sm:p-6 text-[#F3EDE4]">
        {/* Header with High-Stakes Crimson Alert */}
        <div className="flex items-center justify-between border-b border-[#3A3340] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#B5273B]/20 text-[#E14B4B] border border-[#B5273B]/50 animate-pulse">
              <Skull className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cormorant font-bold text-2xl text-[#E14B4B] tracking-wide">
                FINAL ACCUSATION
              </h3>
              <p className="text-xs text-[#9A93A6] font-dm">
                Declare the murderer, weapon, and crime scene
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

        {/* Severe Warning Notice */}
        <div className="bg-[#B5273B]/10 border border-[#B5273B]/40 rounded-xl p-3.5 mb-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#E14B4B] shrink-0 mt-0.5" />
          <div className="text-xs text-[#F3EDE4] space-y-1 font-dm">
            <strong className="text-[#E14B4B] font-bold block">
              WARNING: This decision cannot be undone.
            </strong>
            <p className="text-[#9A93A6]">
              If your accusation is correct, you solve the case and win immediately. If you are wrong, you will be permanently eliminated from making any future accusations!
            </p>
          </div>
        </div>

        {/* Selected Accusation Dossier */}
        <div className="bg-[#120B07] border-2 border-[#9B2226] rounded-xl p-3.5 mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-[#1E140D] border border-[#B5273B]/50 flex flex-col items-center">
            <span className="text-[9px] uppercase font-bold text-[#E63946] tracking-wider mb-1.5 font-typewriter">
              The Murderer
            </span>
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#B5273B] mb-2 shadow-md bg-[#120B07]">
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
            <span className="font-antique font-bold text-sm text-[#F7EFE2]">
              {CHARACTERS[selectedSuspect].name}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#1E140D] border border-[#C99738]/50 flex flex-col items-center">
            <span className="text-[9px] uppercase font-bold text-[#D4AF37] tracking-wider mb-1.5 font-typewriter">
              The Weapon
            </span>
            <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-[#C99738] mb-2 shadow-md bg-[#120B07]">
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
            <span className="font-antique font-bold text-sm text-[#F7EFE2]">
              {WEAPONS[selectedWeapon].name}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#1E140D] border border-[#2FBF8F]/50 flex flex-col items-center">
            <span className="text-[9px] uppercase font-bold text-[#48BB78] tracking-wider mb-1.5 font-typewriter">
              The Scene
            </span>
            <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-[#2FBF8F] mb-2 shadow-md bg-[#120B07]">
              {ROOMS[selectedRoom].imageUrl ? (
                <img
                  src={ROOMS[selectedRoom].imageUrl}
                  alt={ROOMS[selectedRoom].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#48BB78] font-bold text-sm">
                  🏰
                </div>
              )}
            </div>
            <span className="font-antique font-bold text-sm text-[#F7EFE2]">
              {ROOMS[selectedRoom].name}
            </span>
          </div>
        </div>

        {/* 1. Select Suspect */}
        <div className="mb-4">
          <label className="text-xs font-bold font-antique uppercase tracking-wider text-[#E63946] block mb-2">
            1. Accuse the Murderer
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

        {/* 2. Select Weapon */}
        <div className="mb-4">
          <label className="text-xs font-bold font-antique uppercase tracking-wider text-[#D4AF37] block mb-2">
            2. Identify the Murder Weapon
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

        {/* 3. Select Room */}
        <div className="mb-5">
          <label className="text-xs font-bold font-antique uppercase tracking-wider text-[#48BB78] block mb-2">
            3. Pinpoint the Murder Scene
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
            {(Object.keys(ROOMS) as RoomId[]).map(rId => {
              const room = ROOMS[rId];
              const isSelected = selectedRoom === rId;

              return (
                <button
                  key={rId}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSelectedRoom(rId);
                  }}
                  className={`p-1.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2FBF8F]/25 border-[#48BB78] shadow-[0_0_12px_rgba(72,187,120,0.4)] scale-[1.02]'
                      : 'bg-[#1E140D] border-[#4A3322] hover:border-[#48BB78]/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#5A3E2B] shrink-0 bg-[#120B07]">
                    {room.imageUrl ? (
                      <img
                        src={room.imageUrl}
                        alt={room.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#BAAFA1]">
                        🏰
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-antique font-bold text-[#F7EFE2] truncate flex-1">
                    {room.name}
                  </span>
                  {isSelected && <span className="text-xs text-[#48BB78] font-bold mr-1">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="bg-[#2A2430] p-3.5 rounded-xl border border-[#3A3340] mb-5 flex items-center gap-3">
          <input
            id="accuse-confirm-check"
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="w-4 h-4 rounded bg-[#141118] border-[#3A3340] text-[#B5273B] focus:ring-[#B5273B] cursor-pointer"
          />
          <label
            htmlFor="accuse-confirm-check"
            className="text-xs text-[#F3EDE4] cursor-pointer font-medium select-none"
          >
            I stake my detective reputation on this claim and understand there is no second chance.
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-auto pt-2 border-t border-[#3A3340]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#141118] hover:bg-[#2A2430] text-[#9A93A6] border border-[#3A3340] text-xs font-medium cursor-pointer"
          >
            Withdraw Accusation
          </button>
          <button
            id="btn-submit-final-accusation"
            type="button"
            onClick={handleSubmit}
            disabled={!isConfirmed || isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm shadow-xl transition-all flex items-center gap-2 font-dm ${
              !isConfirmed || isSubmitting
                ? 'bg-[#3A3340] text-[#9A93A6] opacity-50 cursor-not-allowed'
                : 'bg-[#B5273B] hover:bg-[#9E1F32] text-[#F3EDE4] shadow-[0_0_20px_rgba(181,39,59,0.5)] cursor-pointer'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isSubmitting ? 'VERIFYING WITH CORONER...' : 'SEAL ACCUSATION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
