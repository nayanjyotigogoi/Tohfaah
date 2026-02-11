import { Composition } from "remotion";
import { SoftDreamyStory } from "./SoftDreamyStory";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SoftDreamyStory"
        component={SoftDreamyStory}
        durationInFrames={270}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          senderName: "Someone",
          recipientName: "You",
          occasion: "Valentine",
        }}
      />
    </>
  );
};
