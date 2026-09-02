import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile } from "remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 1.5 * fps], [0, 0.5], {
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

  const titleOpacity = interpolate(frame, [1 * fps, 2.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleY = interpolate(frame, [1 * fps, 2.5 * fps], [40, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subOpacity = interpolate(frame, [2.5 * fps, 4 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const subY = interpolate(frame, [2.5 * fps, 4 * fps], [20, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const tagOpacity = interpolate(frame, [4 * fps, 5.5 * fps], [0, 1], {
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
      {/* Background - use CSS gradient instead of small image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, #1a120a 0%, #0a0705 100%)",
        }}
      />

      {/* Warm candle glow overlay */}
      <div
        style={{
          position: "absolute",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,151,56,0.12) 0%, transparent 70%)",
          transform: `scale(${glowScale})`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 120px",
        }}
      >
        {/* Brand badge */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: "32px",
            padding: "12px 32px",
            borderRadius: "32px",
            border: "1px solid rgba(201,151,56,0.6)",
            backgroundColor: "rgba(30,20,13,0.9)",
            color: "#D4AF37",
            fontSize: "18px",
            fontFamily: "monospace",
            letterSpacing: "4px",
            textTransform: "uppercase" as const,
          }}
        >
          Blackwood Estate — 1930s Mystery
        </div>

        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: "120px",
            fontWeight: 900,
            color: "#F7EFE2",
            fontFamily: "Georgia, serif",
            letterSpacing: "12px",
            textShadow: "0 4px 40px rgba(0,0,0,0.8)",
            lineHeight: 1,
          }}
        >
          MURDER<span style={{ color: "#2E7D5B" }}>MINT</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginTop: "32px",
            fontSize: "42px",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#D4AF37",
            fontFamily: "Georgia, serif",
          }}
        >
          A midnight crime in a shuttered bungalow.
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: tagOpacity,
            marginTop: "40px",
            fontSize: "24px",
            color: "#BAAFA1",
            fontFamily: "sans-serif",
            maxWidth: "700px",
            lineHeight: 1.6,
          }}
        >
          Six suspects. Six weapons. Nine rooms of secrets.
          <br />
          Only one detective can crack the case.
        </div>
      </div>

      {/* Vignette overlay */}
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
