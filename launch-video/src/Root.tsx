import "./index.css";
import { Composition } from "remotion";
import { MurderMintLaunchVideo } from "./Composition";

// Voiceover durations (Brian voice, mysterious tone):
// scene-01-intro: 13.64s
// scene-02-characters: 18.23s
// scene-03-gameplay: 12.67s
// scene-04-deduction: 9.33s
// scene-05-cta: 12.67s
// Total: ~66.5s

const FPS = 30;
const TOTAL_DURATION = Math.ceil(67 * FPS); // 67 seconds

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MurderMintLaunch"
        component={MurderMintLaunchVideo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
