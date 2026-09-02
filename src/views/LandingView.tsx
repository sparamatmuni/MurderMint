import React, { useState } from 'react';
import { 
  Sparkles, 
  KeyRound, 
  HelpCircle, 
  Skull, 
  Footprints, 
  Users, 
  Flame,
  Radio,
  BookOpen,
  Search,
  Dices,
  CheckCircle2,
  FileSpreadsheet,
  ChevronDown,
  ArrowRight,
  ShieldAlert,
  Compass,
  Sword,
  DoorOpen
} from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { AmbientAudioWidget } from '../components/AmbientAudioWidget';
import { RulesModal } from '../components/RulesModal';

interface LandingViewProps {
  onCreateGame: () => void;
  onJoinGame: () => void;
  onQuickPlay: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onCreateGame,
  onJoinGame,
  onQuickPlay,
}) => {
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const scrollToHowToPlay = () => {
    playClickSound();
    const el = document.getElementById('how-to-play');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#120B07] text-[#F7EFE2] flex flex-col justify-between overflow-x-hidden bg-blueprint selection:bg-[#9B2226]">
      {/* Warm Bungalow Lantern Glow & Shadow Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#C99738]/8 rounded-full blur-3xl pointer-events-none animate-pulse-gold" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#9B2226]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#1E140D] border-2 border-[#C99738] flex items-center justify-center text-[#D4AF37] shadow-md font-brand font-bold text-base">
            MM
          </div>
          <span className="font-brand font-bold text-xl tracking-widest text-[#F7EFE2]">
            MURDER<span className="text-[#2E7D5B]">MINT</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="btn-nav-how-to-play"
            onClick={scrollToHowToPlay}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E140D] hover:bg-[#2A1B12] text-[#BAAFA1] hover:text-[#F7EFE2] border border-[#4A3322] text-xs font-antique font-bold transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>How to Play</span>
          </button>

          <AmbientAudioWidget variant="compact" />

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onQuickPlay();
            }}
            className="px-4 py-2 rounded-lg bg-[#2A1B12] hover:bg-[#3B281B] text-[#D4AF37] border border-[#C99738]/60 text-xs font-bold font-antique tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Solo Match</span>
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-10 pb-16 flex flex-col items-center text-center">
        {/* Vintage Bungalow Seal */}
        <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E140D] border border-[#C99738]/60 text-[#D4AF37] text-xs font-typewriter tracking-wider uppercase animate-candle shadow-md">
          <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Blackwood Estate • 1930s Mystery Deduction</span>
        </div>

        {/* Title */}
        <h1 className="font-brand font-black text-4xl sm:text-6xl md:text-7xl tracking-wider text-[#F7EFE2] mb-3 leading-none drop-shadow-2xl">
          MURDER<span className="text-[#2E7D5B]">MINT</span>
        </h1>

        {/* Hero Tagline */}
        <h2 className="font-antique italic font-bold text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] mb-5 tracking-wide">
          A midnight crime in a shuttered bungalow.
        </h2>

        {/* Supporting Narrative */}
        <p className="font-sans text-sm sm:text-base text-[#BAAFA1] max-w-xl mb-8 leading-relaxed">
          Step onto the verandas of Blackwood Bungalow. Examine antique parlors, interrogate suspects, send secret telegraph dispatches, and deduce the killer before another detective claims the glory.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mb-6">
          <button
            id="btn-landing-create"
            type="button"
            onClick={() => {
              playClickSound();
              onCreateGame();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-[#9B2226] hover:bg-[#7E1A1E] text-[#F7EFE2] font-bold text-sm sm:text-base shadow-xl shadow-[0_0_24px_rgba(155,34,38,0.4)] transition-all flex items-center justify-center gap-2 font-antique tracking-wider uppercase cursor-pointer border border-[#D4AF37]/40"
          >
            <KeyRound className="w-4 h-4" />
            <span>CREATE CASE</span>
          </button>

          <button
            id="btn-landing-join"
            type="button"
            onClick={() => {
              playClickSound();
              onJoinGame();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-[#1E140D] hover:bg-[#2A1B12] text-[#F7EFE2] border-2 border-[#5A3E2B] hover:border-[#C99738] font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 font-antique tracking-wider uppercase cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>JOIN CASE</span>
          </button>
        </div>

        {/* Learn to Play Guide Button */}
        <button
          type="button"
          onClick={scrollToHowToPlay}
          className="inline-flex items-center gap-2 text-xs font-antique font-bold text-[#D4AF37] hover:text-[#F7EFE2] transition-colors py-2 cursor-pointer mb-10"
        >
          <span>New to detective games? Read the simple How-to-Play guide</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </button>

        {/* 3 Pillars / Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left font-sans">
          <div className="p-4 rounded-xl bg-[#1E140D]/95 border border-[#4A3322] flex flex-col justify-between shadow-lg">
            <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-antique font-bold text-base text-[#F7EFE2]">3–6 Detectives</span>
            </div>
            <p className="text-xs text-[#BAAFA1] leading-relaxed">
              Investigate alongside companions or test your wits against ruthless AI detectives in private rooms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1E140D]/95 border border-[#4A3322] flex flex-col justify-between shadow-lg">
            <div className="flex items-center gap-2 mb-2 text-[#2E7D5B]">
              <Radio className="w-4 h-4 text-[#2E7D5B]" />
              <span className="font-antique font-bold text-base text-[#F7EFE2]">Parlor Telegraph</span>
            </div>
            <p className="text-xs text-[#BAAFA1] leading-relaxed">
              Real-time room chat, secret whisper dispatches, and quick interrogation banter between turns.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1E140D]/95 border border-[#4A3322] flex flex-col justify-between shadow-lg">
            <div className="flex items-center gap-2 mb-2 text-[#9B2226]">
              <Skull className="w-4 h-4 text-[#9B2226]" />
              <span className="font-antique font-bold text-base text-[#F7EFE2]">High-Stakes Accusation</span>
            </div>
            <p className="text-xs text-[#BAAFA1] leading-relaxed">
              One false accusation leaves your case ruined. Check your alibis and seal the evidence notebook.
            </p>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* HOW TO PLAY SECTION (SIMPLE & EASY EXPLANATIONS) */}
      {/* ========================================================================= */}
      <section 
        id="how-to-play" 
        className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 border-t-2 border-[#5A3E2B] my-8"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E140D] border border-[#C99738] text-[#D4AF37] text-xs font-typewriter tracking-widest uppercase mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Detective Academy</span>
          </div>
          <h2 className="font-antique font-bold text-3xl sm:text-4xl text-[#F7EFE2] mb-3 tracking-wide">
            How to Play MurderMint
          </h2>
          <p className="font-sans text-sm text-[#BAAFA1] leading-relaxed">
            The classic murder mystery deduction game explained in simple, easy-to-learn terms. Master the rules in 2 minutes!
          </p>
        </div>

        {/* 1. The Core Objective */}
        <div className="bg-[#1E140D] border-2 border-[#C99738] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C99738]/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-typewriter text-[#D4AF37] uppercase tracking-wider block">
                The Mission
              </span>
              <h3 className="font-antique font-bold text-2xl text-[#F7EFE2]">
                Your Goal: Deduce the 3 Hidden Murder Secrets
              </h3>
              <p className="text-xs sm:text-sm text-[#BAAFA1] max-w-xl font-sans leading-relaxed">
                Sir Reginald Blackwood was murdered in his estate bungalow. At the start of the match, <strong className="text-[#F7EFE2]">3 confidential cards</strong> are placed into the sealed murder envelope in the center of the board:
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0 w-full md:w-auto text-center">
              <div className="p-3 rounded-xl bg-[#120B07] border border-[#E63946]/60 shadow">
                <Users className="w-5 h-5 text-[#E63946] mx-auto mb-1" />
                <span className="text-[11px] font-antique font-bold text-[#F7EFE2] block">WHO?</span>
                <span className="text-[9px] font-typewriter text-[#BAAFA1]">1 of 6 Suspects</span>
              </div>

              <div className="p-3 rounded-xl bg-[#120B07] border border-[#C99738]/60 shadow">
                <Sword className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
                <span className="text-[11px] font-antique font-bold text-[#F7EFE2] block">WHAT?</span>
                <span className="text-[9px] font-typewriter text-[#BAAFA1]">1 of 6 Weapons</span>
              </div>

              <div className="p-3 rounded-xl bg-[#120B07] border border-[#2E7D5B]/60 shadow">
                <DoorOpen className="w-5 h-5 text-[#2E7D5B] mx-auto mb-1" />
                <span className="text-[11px] font-antique font-bold text-[#F7EFE2] block">WHERE?</span>
                <span className="text-[9px] font-typewriter text-[#BAAFA1]">1 of 9 Rooms</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Step-by-Step Flow */}
        <div className="mb-10">
          <h3 className="font-antique font-bold text-xl text-[#F7EFE2] mb-6 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>How Your Turn Works (4 Simple Steps)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="bg-[#1E140D] border-2 border-[#5A3E2B] rounded-2xl p-5 flex flex-col justify-between shadow-lg relative group hover:border-[#C99738] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-[#2A1B12] border border-[#785822] text-[#D4AF37] font-typewriter font-bold text-sm flex items-center justify-center">
                    01
                  </span>
                  <Dices className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h4 className="font-antique font-bold text-base text-[#F7EFE2] mb-2">
                  Roll & Move
                </h4>
                <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
                  Roll the dice and walk through the estate hallways to enter any room. Or take a <strong>Secret Passage</strong> directly between opposite corner rooms!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#4A3322]/50 text-[10px] font-typewriter text-[#D4AF37]">
                Tip: Corner rooms connect Kitchen ⇄ Study!
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1E140D] border-2 border-[#5A3E2B] rounded-2xl p-5 flex flex-col justify-between shadow-lg relative group hover:border-[#C99738] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-[#2A1B12] border border-[#785822] text-[#D4AF37] font-typewriter font-bold text-sm flex items-center justify-center">
                    02
                  </span>
                  <Search className="w-5 h-5 text-[#2E7D5B]" />
                </div>
                <h4 className="font-antique font-bold text-base text-[#F7EFE2] mb-2">
                  Make a Suggestion
                </h4>
                <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
                  Once inside a room, test a theory! Name 1 Suspect + 1 Weapon (the room is the one you are standing in). E.g. <em>"Col. Mustard in the Library with the Wrench."</em>
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#4A3322]/50 text-[10px] font-typewriter text-[#2E7D5B]">
                Moves the suspect into your room!
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1E140D] border-2 border-[#5A3E2B] rounded-2xl p-5 flex flex-col justify-between shadow-lg relative group hover:border-[#C99738] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-[#2A1B12] border border-[#785822] text-[#D4AF37] font-typewriter font-bold text-sm flex items-center justify-center">
                    03
                  </span>
                  <FileSpreadsheet className="w-5 h-5 text-[#C99738]" />
                </div>
                <h4 className="font-antique font-bold text-base text-[#F7EFE2] mb-2">
                  Check Clues & Disprove
                </h4>
                <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
                  Other players check their cards in clockwise order. The first player who holds any of your 3 cards <strong>must secretly show 1 card to you</strong>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#4A3322]/50 text-[10px] font-typewriter text-[#C99738]">
                Only you get to see that card!
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#1E140D] border-2 border-[#5A3E2B] rounded-2xl p-5 flex flex-col justify-between shadow-lg relative group hover:border-[#9B2226] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-[#9B2226] text-[#F7EFE2] font-typewriter font-bold text-sm flex items-center justify-center">
                    04
                  </span>
                  <Skull className="w-5 h-5 text-[#9B2226]" />
                </div>
                <h4 className="font-antique font-bold text-base text-[#F7EFE2] mb-2">
                  Mark & Accuse
                </h4>
                <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
                  Cross the revealed card off your Detective Notepad. When only 1 suspect, weapon, and room remain uncrossed, make your <strong>Final Accusation to win!</strong>
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#4A3322]/50 text-[10px] font-typewriter text-[#E63946]">
                One try only: make sure you're right!
              </div>
            </div>
          </div>
        </div>

        {/* 3. Essential Detective Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-[#1E140D] border border-[#4A3322] space-y-1.5">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-antique font-bold text-sm text-[#F7EFE2]">Your Starting Hand</span>
            </div>
            <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
              Every card in your own starting hand is automatically marked innocent on your notepad at the beginning of the case!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1E140D] border border-[#4A3322] space-y-1.5">
            <div className="flex items-center gap-2 text-[#2E7D5B]">
              <Compass className="w-4 h-4" />
              <span className="font-antique font-bold text-sm text-[#F7EFE2]">Secret Passageways</span>
            </div>
            <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
              Corner rooms contain secret tunnels: <strong>Kitchen ⇄ Study</strong> and <strong>Conservatory ⇄ Lounge</strong>. Use them to jump across the board instantly.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1E140D] border border-[#4A3322] space-y-1.5">
            <div className="flex items-center gap-2 text-[#9B2226]">
              <ShieldAlert className="w-4 h-4" />
              <span className="font-antique font-bold text-sm text-[#F7EFE2]">Observe Other Turns</span>
            </div>
            <p className="text-xs text-[#BAAFA1] font-sans leading-relaxed">
              Even when it's not your turn, watch who disproves whose suggestions! The case chronology log tracks every event.
            </p>
          </div>
        </div>

        {/* Full Casebook Lightbox Trigger */}
        <div className="bg-[#120B07] border border-[#785822] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-antique font-bold text-lg text-[#F7EFE2] mb-1">
              Want the full rulebook with house rules & detailed strategies?
            </h4>
            <p className="text-xs text-[#BAAFA1] font-sans">
              Open the complete Blackwood Manor Detective Dossier & Rulebook anytime.
            </p>
          </div>

          <button
            type="button"
            id="btn-open-full-rules"
            onClick={() => {
              playClickSound();
              setIsRulesModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#2A1B12] hover:bg-[#3B281B] text-[#D4AF37] border border-[#C99738] font-antique font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 shadow"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Detective Dossier</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-[#BAAFA1]/60 border-t border-[#3E291C] font-typewriter flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
        <span>MURDERMINT • BLACKWOOD BUNGALOW ARCHIVES</span>
        <span>1930s MYSTERY DEDUCTION</span>
      </footer>

      {/* Detective Rules Modal */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
};


