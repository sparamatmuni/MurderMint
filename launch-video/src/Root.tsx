import "./index.css";
import { Composition } from "remotion";
import { MurderMintLaunchVideo } from "./Composition";

// Audio durations (from ffprobe):
// scene-01-intro: 8.67s
// scene-02-characters: 9.69s
// scene-03-gameplay: 7.76s
// scene-04-deduction: 7.65s
// scene-05-cta: 6.87s
// Total: ~40.6s + padding = ~42s at 30fps = 1260 frames

const FPS = 30;
const TOTAL_DURATION = 42 * FPS; // 42 seconds

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
