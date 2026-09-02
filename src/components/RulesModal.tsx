import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Sparkles, 
  KeyRound, 
  Skull, 
  CheckCircle2, 
  Search, 
  Dices, 
  ShieldAlert, 
  HelpCircle,
  Footprints,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'simple' | 'detailed'>('simple');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-[#F7EFE2]">
      <div 
        id="rules-modal-container"
        className="bg-[#1E140D] border-2 border-[#C99738] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(201,151,56,0.25)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#4A3322] px-6 py-4 bg-[#120B07]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#2A1B12] text-[#D4AF37] border border-[#785822] shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-antique font-bold text-xl sm:text-2xl text-[#F7EFE2] tracking-wide">
                How to Play MurderMint
              </h3>
              <p className="text-xs text-[#BAAFA1] font-sans">
                The Gentleman's Guide to Murder Deduction in 1930s Blackwood Manor
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#2A1B12] hover:bg-[#3B281B] text-[#BAAFA1] hover:text-[#F7EFE2] border border-[#5A3E2B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 bg-[#170E08] border-b border-[#3E291C]">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('simple');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-antique font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'simple'
                ? 'bg-[#C99738] text-[#120B07] shadow-[0_0_15px_rgba(201,151,56,0.4)]'
                : 'bg-[#1E140D] text-[#BAAFA1] hover:text-[#F7EFE2] border border-[#4A3322]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ 60-Second Quick Start (Easy)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('detailed');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-antique font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'detailed'
                ? 'bg-[#C99738] text-[#120B07] shadow-[0_0_15px_rgba(201,151,56,0.4)]'
                : 'bg-[#1E140D] text-[#BAAFA1] hover:text-[#F7EFE2] border border-[#4A3322]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📜 Master Detective Rules</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[62vh] pr-4">
          {activeTab === 'simple' ? (
            /* SIMPLE & EASY TERMS TAB */
            <div className="space-y-4">
              {/* The Core Objective Banner */}
              <div className="bg-[#120B07] border-2 border-[#C99738]/50 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-2 text-[#D4AF37] font-antique font-bold text-sm uppercase tracking-wider mb-1">
                  <Search className="w-4 h-4 text-[#D4AF37]" />
                  <span>The Goal: Solve the Murder</span>
                </div>
                <p className="text-sm text-[#F7EFE2] font-sans leading-relaxed">
                  Find out <strong>WHO</strong> committed the murder, with <strong>WHAT</strong> weapon, in <strong>WHICH</strong> room of the bungalow.
                </p>
              </div>

              {/* 4 Simple Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-[#120B07] border border-[#4A3322] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#C99738] text-[#120B07] font-bold font-typewriter text-xs flex items-center justify-center">
                        1
                      </span>
                      <h4 className="font-antique font-bold text-sm text-[#F7EFE2]">
                        The Murder Envelope
                      </h4>
                    </div>
                    <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
                      At the start, <strong className="text-[#D4AF37]">3 secret cards</strong> (1 Suspect, 1 Weapon, 1 Room) are sealed in the confidential murder envelope. The other 18 cards are dealt into player hands.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-[#120B07] border border-[#4A3322] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#C99738] text-[#120B07] font-bold font-typewriter text-xs flex items-center justify-center">
                        2
                      </span>
                      <h4 className="font-antique font-bold text-sm text-[#F7EFE2]">
                        Roll & Enter a Room
                      </h4>
                    </div>
                    <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
                      On your turn, roll the die to move between rooms, or take a <strong className="text-[#D4AF37]">Secret Passage</strong> between diagonal corner rooms (e.g. Kitchen ⇄ Study).
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-[#120B07] border border-[#4A3322] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#C99738] text-[#120B07] font-bold font-typewriter text-xs flex items-center justify-center">
                        3
                      </span>
                      <h4 className="font-antique font-bold text-sm text-[#F7EFE2]">
                        Suggest & Disprove
                      </h4>
                    </div>
                    <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
                      Make a theory inside your room (e.g. <em>"Colonel Mustard in the Library with the Candlestick"</em>). The next player who has any of those cards <strong className="text-[#2E7D5B]">must show ONE secretly to you</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl bg-[#120B07] border border-[#4A3322] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#9B2226] text-[#F7EFE2] font-bold font-typewriter text-xs flex items-center justify-center">
                        4
                      </span>
                      <h4 className="font-antique font-bold text-sm text-[#F7EFE2]">
                        Track & Accuse!
                      </h4>
                    </div>
                    <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
                      Cross cards off your <strong className="text-[#D4AF37]">Detective Notepad</strong>. Once only 1 suspect, 1 weapon, and 1 room remain uncrossed, make your <strong className="text-[#9B2226]">Final Accusation</strong> to win!
                    </p>
                  </div>
                </div>
              </div>

              {/* Handy Pro Tips Box */}
              <div className="p-3.5 rounded-xl bg-[#170E08] border border-[#785822] flex items-start gap-3 text-xs text-[#BAAFA1]">
                <ShieldAlert className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-antique font-bold text-[#D4AF37] uppercase tracking-wider block">
                    Important Golden Rule:
                  </span>
                  <p>
                    You only get <strong>ONE Final Accusation</strong>! If your accusation is incorrect, you cannot make suggestions or accuse again (you can only answer other detectives). Be sure before you strike!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* DETAILED RULES TAB */
            <div className="space-y-4 text-xs font-sans leading-relaxed text-[#F7EFE2]/90">
              {/* Section 1 */}
              <div className="bg-[#120B07] p-4 rounded-xl border border-[#4A3322]">
                <h4 className="font-antique font-bold text-sm text-[#D4AF37] flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>1. Setup & Card Distribution</span>
                </h4>
                <p className="text-[#BAAFA1] mb-2">
                  At the beginning of every case:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#BAAFA1] ml-1">
                  <li><strong>The Crime:</strong> Exactly 1 Suspect card, 1 Weapon card, and 1 Room card are chosen at random and sealed in the murder envelope.</li>
                  <li><strong>Hands Dealt:</strong> The remaining 18 cards are dealt evenly among all active detectives (and bots).</li>
                  <li><strong>Automatic Alibis:</strong> Any card in your starting hand is automatically crossed off your notepad because you know it is not in the murder envelope!</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="bg-[#120B07] p-4 rounded-xl border border-[#4A3322]">
                <h4 className="font-antique font-bold text-sm text-[#2E7D5B] flex items-center gap-2 mb-2">
                  <Footprints className="w-4 h-4 text-[#2E7D5B]" />
                  <span>2. Turn Sequence (Roll, Move, Interrogate)</span>
                </h4>
                <div className="space-y-2 text-[#BAAFA1]">
                  <p><strong>A. Roll Die:</strong> Click the roll button. The die roll determines your maximum step range across the bungalow hallways.</p>
                  <p><strong>B. Move to a Room:</strong> Click any highlighted door to enter a room. Once inside, your movement ends.</p>
                  <p><strong>C. Formulate a Suggestion:</strong> When inside a room, you can question the parlor: choose 1 Suspect and 1 Weapon. The room is locked to the chamber you currently occupy.</p>
                  <p><strong>D. Disproving Round:</strong> Starting clockwise from your left, other players check if they hold any of the 3 cards. The first player who holds at least one card must secretly show ONE card to you. Only you see this card, and it is marked off in your notebook.</p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="bg-[#120B07] p-4 rounded-xl border border-[#4A3322]">
                <h4 className="font-antique font-bold text-sm text-[#D4AF37] flex items-center gap-2 mb-2">
                  <Compass className="w-4 h-4 text-[#D4AF37]" />
                  <span>3. Secret Passages & Board Layout</span>
                </h4>
                <p className="text-[#BAAFA1] mb-2">
                  The bungalow features hidden diagonal passages between the outer corner rooms:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-typewriter">
                  <div className="p-2 rounded bg-[#1E140D] border border-[#5A3E2B] text-center text-[#F7EFE2]">
                    Kitchen ⇄ Study
                  </div>
                  <div className="p-2 rounded bg-[#1E140D] border border-[#5A3E2B] text-center text-[#F7EFE2]">
                    Conservatory ⇄ Lounge
                  </div>
                </div>
                <p className="text-[#BAAFA1] mt-2 text-[11px]">
                  If you start your turn in a corner room, you can travel immediately through the secret passage without rolling the die!
                </p>
              </div>

              {/* Section 4 */}
              <div className="bg-[#120B07] p-4 rounded-xl border border-[#9B2226]">
                <h4 className="font-antique font-bold text-sm text-[#E63946] flex items-center gap-2 mb-2">
                  <Skull className="w-4 h-4 text-[#E63946]" />
                  <span>4. Making the Final Accusation (Victory or Defeat)</span>
                </h4>
                <p className="text-[#BAAFA1] mb-2">
                  At any point on your turn (even without moving or from any room), you can make a <strong>Final Accusation</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#BAAFA1] ml-1">
                  <li><strong className="text-[#2E7D5B]">If all 3 cards match the envelope:</strong> You immediately solve the case and win the game!</li>
                  <li><strong className="text-[#E63946]">If even ONE card is wrong:</strong> You are eliminated from making further turns or suggestions. However, you remain at the table to show cards when other detectives make suggestions.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#120B07] border-t border-[#4A3322] flex items-center justify-between">
          <span className="text-[11px] font-typewriter text-[#BAAFA1]">
            MurderMint Case Guide • 1930s Edition
          </span>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#C99738] hover:bg-[#D4AF37] text-[#120B07] font-antique font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
          >
            I'm Ready to Investigate
          </button>
        </div>
      </div>
    </div>
  );
};

