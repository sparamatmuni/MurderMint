import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

const FONT_BRAND = "'Cinzel Decorative', 'Cinzel', serif";
const FONT_ANTIQUE = "'IM Fell English', 'Cormorant Garamond', Georgia, serif";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale entrance
  const logoScale = interpolate(frame, [0, 1.5 * fps], [0.6, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const logoOpacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Tagline
  const tagOpacity = interpolate(frame, [1.5 * fps, 2.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const tagY = interpolate(frame, [1.5 * fps, 2.5 * fps], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // CTA button
  const ctaOpacity = interpolate(frame, [3 * fps, 4 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ctaScale = interpolate(frame, [3 * fps, 4 * fps], [0.8, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Button pulse
  const pulseScale = interpolate(
    frame % (1.5 * fps),
    [0, 0.75 * fps, 1.5 * fps],
    [1, 1.05, 1],
    { extrapolateRight: "clamp" }
  );

  // Gold particles
  const particles = Array.from({ length: 25 }, (_, i) => {
    const angle = (i / 25) * Math.PI * 2;
    const radius = interpolate(frame, [0.5 * fps, 2.5 * fps], [0, 350 + (i % 4) * 60], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const opacity = interpolate(frame, [0.5 * fps, 1.2 * fps, 3 * fps, 4 * fps], [0, 0.7, 0.7, 0], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, opacity, size: 3 + (i % 5) };
  });

  // URL
  const urlOpacity = interpolate(frame, [5 * fps, 6 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#120B07",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Radial background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, #1E140D 0%, #120B07 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Warm candle glow */}
      <div
        style={{
          position: "absolute",
          width: "1000px",
          height: "1000px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,151,56,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Gold particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            backgroundColor: "#D4AF37",
            opacity: p.opacity,
            transform: `translate(${p.x}px, ${p.y}px)`,
            pointerEvents: "none",
            boxShadow: "0 0 6px rgba(212,175,55,0.6)",
          }}
        />
      ))}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center" as const,
        }}
      >
        {/* Logo */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            fontSize: "140px",
            fontWeight: 400,
            color: "#F7EFE2",
            fontFamily: FONT_BRAND,
            letterSpacing: "16px",
            textShadow: "0 4px 60px rgba(201,151,56,0.3), 0 0 120px rgba(0,0,0,0.8)",
            lineHeight: 1,
          }}
        >
          MURDER<span style={{ color: "#2E7D5B" }}>MINT</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            marginTop: "40px",
            fontSize: "34px",
            fontStyle: "italic",
            color: "#D4AF37",
            fontFamily: FONT_ANTIQUE,
          }}
        >
          The classic murder mystery, reimagined.
        </div>

        {/* Sub tagline */}
        <div
          style={{
            opacity: tagOpacity,
            marginTop: "20px",
            fontSize: "22px",
            color: "#BAAFA1",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Gather your detectives. Solve the case.
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale * pulseScale})`,
            marginTop: "60px",
            padding: "24px 80px",
            borderRadius: "20px",
            backgroundColor: "#9B2226",
            border: "2px solid rgba(212,175,55,0.4)",
            boxShadow: "0 0 50px rgba(155,34,38,0.5), 0 8px 40px rgba(0,0,0,0.5)",
            fontSize: "28px",
            fontWeight: 400,
            color: "#F7EFE2",
            fontFamily: FONT_BRAND,
            letterSpacing: "6px",
            textTransform: "uppercase" as const,
          }}
        >
          PLAY NOW
        </div>

        {/* URL */}
        <div
          style={{
            opacity: urlOpacity,
            marginTop: "30px",
            fontSize: "18px",
            color: "#BAAFA1",
            fontFamily: "'Special Elite', monospace",
            letterSpacing: "3px",
          }}
        >
          murdermint.app
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 35%, #120B07 85%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
