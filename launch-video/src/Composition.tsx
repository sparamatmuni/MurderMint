import { AbsoluteFill, Sequence, useVideoConfig, staticFile, Audio } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { CharactersScene } from "./scenes/CharactersScene";
import { GameplayScene } from "./scenes/GameplayScene";
import { DeductionScene } from "./scenes/DeductionScene";
import { CTAScene } from "./scenes/CTAScene";

// Scene durations based on voiceover audio lengths (in seconds)
const SCENE_DURATIONS = {
  intro: 13.64,
  characters: 18.23,
  gameplay: 12.67,
  deduction: 9.33,
  cta: 12.67,
};

export const MurderMintLaunchVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  const introFrames = Math.ceil(SCENE_DURATIONS.intro * fps);
  const charactersFrames = Math.ceil(SCENE_DURATIONS.characters * fps);
  const gameplayFrames = Math.ceil(SCENE_DURATIONS.gameplay * fps);
  const deductionFrames = Math.ceil(SCENE_DURATIONS.deduction * fps);
  const ctaFrames = Math.ceil(SCENE_DURATIONS.cta * fps);

  const introStart = 0;
  const charactersStart = introFrames;
  const gameplayStart = charactersStart + charactersFrames;
  const deductionStart = gameplayStart + gameplayFrames;
  const ctaStart = deductionStart + deductionFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: "#120B07" }}>
      {/* Background music - loops for entire duration */}
      <Audio
        src={staticFile("voiceover/background-music.mp3")}
        volume={0.12}
        loop
      />

      {/* Scene 1: Intro with voiceover */}
      <Sequence from={introStart} durationInFrames={introFrames}>
        <IntroScene />
        <Audio src={staticFile("voiceover/scene-01-intro.mp3")} />
      </Sequence>

      {/* Scene 2: Characters with voiceover */}
      <Sequence from={charactersStart} durationInFrames={charactersFrames}>
        <CharactersScene />
        <Audio src={staticFile("voiceover/scene-02-characters.mp3")} />
      </Sequence>

      {/* Scene 3: Gameplay with voiceover */}
      <Sequence from={gameplayStart} durationInFrames={gameplayFrames}>
        <GameplayScene />
        <Audio src={staticFile("voiceover/scene-03-gameplay.mp3")} />
      </Sequence>

      {/* Scene 4: Deduction with voiceover */}
      <Sequence from={deductionStart} durationInFrames={deductionFrames}>
        <DeductionScene />
        <Audio src={staticFile("voiceover/scene-04-deduction.mp3")} />
      </Sequence>

      {/* Scene 5: CTA with voiceover */}
      <Sequence from={ctaStart} durationInFrames={ctaFrames}>
        <CTAScene />
        <Audio src={staticFile("voiceover/scene-05-cta.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MyComposition = MurderMintLaunchVideo;
