import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { CharactersScene } from "./scenes/CharactersScene";
import { GameplayScene } from "./scenes/GameplayScene";
import { DeductionScene } from "./scenes/DeductionScene";
import { CTAScene } from "./scenes/CTAScene";

// 30fps, ~45 seconds total = 1350 frames
// Scene breakdown:
// 1. Intro:      0-8s   (0-240 frames)
// 2. Characters: 8-16s  (240-480 frames)
// 3. Gameplay:   16-28s (480-840 frames)
// 4. Deduction:  28-36s (840-1080 frames)
// 5. CTA:        36-45s (1080-1350 frames)

export const MurderMintLaunchVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0705" }}>
      {/* Scene 1: Intro (0-8s) */}
      <Sequence from={0} durationInFrames={8 * fps}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: Characters (8-16s) */}
      <Sequence from={8 * fps} durationInFrames={8 * fps}>
        <CharactersScene />
      </Sequence>

      {/* Scene 3: Gameplay (16-28s) */}
      <Sequence from={16 * fps} durationInFrames={12 * fps}>
        <GameplayScene />
      </Sequence>

      {/* Scene 4: Deduction (28-36s) */}
      <Sequence from={28 * fps} durationInFrames={8 * fps}>
        <DeductionScene />
      </Sequence>

      {/* Scene 5: CTA (36-45s) */}
      <Sequence from={36 * fps} durationInFrames={9 * fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MyComposition = MurderMintLaunchVideo;
