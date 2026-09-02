import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile } from "remotion";

// Web app fonts: Cinzel Decorative for brand, IM Fell English for antique, DM Sans for body
const FONT_BRAND = "'Cinzel Decorative', 'Cinzel', serif";
const FONT_ANTIQUE = "'IM Fell English', 'Cormorant Garamond', Georgia, serif";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow zoom on bungalow
  const bgScale = interpolate(frame, [0, 13 * fps], [1, 1.15], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const bgOpacity = interpolate(frame, [0, 2 * fps], [0, 0.7], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Candle glow pulse
  const glowOpacity = interpolate(
    frame % (3 * fps),
    [0, 1.5 * fps, 3 * fps],
    [0.3, 0.6, 0.3],
    { extrapolateRight: "clamp" }
  );

  // Title reveal with dramatic timing
  const titleOpacity = interpolate(frame, [1.5 * fps, 3 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleY = interpolate(frame, [1.5 * fps, 3 * fps], [60, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleScale = interpolate(frame, [1.5 * fps, 3 * fps], [0.8, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Subtitle
  const subOpacity = interpolate(frame, [3.5 * fps, 5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Tagline
  const tagOpacity = interpolate(frame, [5 * fps, 7 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out at end
  const fadeOut = interpolate(frame, [11 * fps, 13 * fps], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#120B07" }}>
      {/* Background bungalow with slow zoom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("images/bungalow_exterior_1787633886090.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: bgOpacity,
            filter: "brightness(0.35) sepia(0.4) contrast(1.1)",
            transform: `scale(${bgScale})`,
          }}
        />
      </div>

      {/* Dark overlay with vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, #120B07 85%)",
          pointerEvents: "none",
        }}
      />

      {/* Warm candle glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,151,56,0.2) 0%, transparent 60%)",
          opacity: glowOpacity,
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
          justifyContent: "center",
          height: "100%",
          padding: "0 160px",
          opacity: fadeOut,
        }}
      >
        {/* Badge */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: "40px",
            padding: "14px 36px",
            borderRadius: "36px",
            border: "1px solid rgba(201,151,56,0.5)",
            backgroundColor: "rgba(18,11,7,0.85)",
            color: "#D4AF37",
            fontSize: "16px",
            fontFamily: "'Special Elite', monospace",
            letterSpacing: "5px",
            textTransform: "uppercase" as const,
          }}
        >
          Blackwood Estate — 1930s Mystery
        </div>

        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px) scale(${titleScale})`,
            fontSize: "140px",
            fontWeight: 400,
            color: "#F7EFE2",
            fontFamily: FONT_BRAND,
            letterSpacing: "16px",
            textShadow: "0 4px 60px rgba(0,0,0,0.9), 0 0 120px rgba(201,151,56,0.15)",
            lineHeight: 1,
          }}
        >
          MURDER<span style={{ color: "#2E7D5B" }}>MINT</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            marginTop: "40px",
            fontSize: "48px",
            fontWeight: 400,
            fontStyle: "italic",
            color: "#D4AF37",
            fontFamily: FONT_ANTIQUE,
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          A midnight crime in a shuttered bungalow.
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: tagOpacity,
            marginTop: "48px",
            fontSize: "26px",
            color: "#BAAFA1",
            fontFamily: "'DM Sans', sans-serif",
            maxWidth: "800px",
            lineHeight: 1.7,
            textAlign: "center" as const,
          }}
        >
          Six suspects. Six weapons. Nine rooms of secrets.
          <br />
          Only one detective can crack the case.
        </div>
      </div>

      {/* Bottom vignette */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "300px",
          background: "linear-gradient(to top, #120B07, transparent)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
