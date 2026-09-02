import "./index.css";
import { Composition } from "remotion";
import { MurderMintLaunchVideo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MurderMintLaunch"
        component={MurderMintLaunchVideo}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
