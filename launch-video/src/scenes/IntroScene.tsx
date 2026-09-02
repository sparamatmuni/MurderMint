import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile } from "remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 1.5 * fps], [0, 0.6], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const glowScale = interpolate(
    frame % (2 * fps),
    [0, fps, 2 * fps],
    [1, 1.3, 1],
    { extrapolateRight: "clamp" }
  );

  const titleOpacity = interpolate(frame, [1.5 * fps, 3 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleY = interpolate(frame, [1.5 * fps, 3 * fps], [40, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subOpacity = interpolate(frame, [3 * fps, 4.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const subY = interpolate(frame, [3 * fps, 4.5 * fps], [20, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const tagOpacity = interpolate(frame, [5 * fps, 6.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0705",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Img
        src={staticFile("images/bungalow_exterior_1787633886090.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: bgOpacity,
          filter: "brightness(0.4) sepia(0.3)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,151,56,0.15) 0%, transparent 70%)",
          transform: `scale(${glowScale})`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: "24px",
            padding: "8px 24px",
            borderRadius: "24px",
            border: "1px solid rgba(201,151,56,0.6)",
            backgroundColor: "rgba(30,20,13,0.9)",
            color: "#D4AF37",
            fontSize: "14px",
            fontFamily: "monospace",
            letterSpacing: "3px",
            textTransform: "uppercase" as const,
          }}
        >
          Blackwood Estate - 1930s Mystery
        </div>

        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: "96px",
            fontWeight: 900,
            color: "#F7EFE2",
            fontFamily: "Georgia, serif",
            letterSpacing: "8px",
            textShadow: "0 4px 30px rgba(0,0,0,0.8)",
            lineHeight: 1,
          }}
        >
          MURDER<span style={{ color: "#2E7D5B" }}>MINT</span>
        </div>

        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginTop: "24px",
            fontSize: "36px",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#D4AF37",
            fontFamily: "Georgia, serif",
          }}
        >
          A midnight crime in a shuttered bungalow.
        </div>

        <div
          style={{
            opacity: tagOpacity,
            marginTop: "32px",
            fontSize: "18px",
            color: "#BAAFA1",
            fontFamily: "sans-serif",
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          Six suspects. Six weapons. Nine rooms of secrets.
          Only one detective can crack the case.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,7,5,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
