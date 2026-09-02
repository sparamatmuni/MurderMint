import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale entrance
  const logoScale = interpolate(frame, [0, 1 * fps], [0.5, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const logoOpacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Tagline
  const tagOpacity = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const tagY = interpolate(frame, [1 * fps, 2 * fps], [20, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // CTA button
  const ctaOpacity = interpolate(frame, [2.5 * fps, 3.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const ctaScale = interpolate(frame, [2.5 * fps, 3.5 * fps], [0.8, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
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
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const radius = interpolate(frame, [0.5 * fps, 2 * fps], [0, 300 + (i % 3) * 50], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const opacity = interpolate(frame, [0.5 * fps, 1 * fps, 2.5 * fps, 3 * fps], [0, 0.6, 0.6, 0], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, opacity, size: 3 + (i % 4) };
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
      {/* Radial background glow */}
      <div
        style={{
          position: "absolute",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,151,56,0.08) 0%, transparent 70%)",
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
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            fontSize: "120px",
            fontWeight: 900,
            color: "#F7EFE2",
            fontFamily: "Georgia, serif",
            letterSpacing: "12px",
            textShadow: "0 4px 40px rgba(201,151,56,0.5)",
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
            marginTop: "32px",
            fontSize: "28px",
            fontStyle: "italic",
            color: "#D4AF37",
            fontFamily: "Georgia, serif",
          }}
        >
          The classic murder mystery, reimagined.
        </div>

        {/* Sub tagline */}
        <div
          style={{
            opacity: tagOpacity,
            marginTop: "16px",
            fontSize: "18px",
            color: "#BAAFA1",
            fontFamily: "sans-serif",
          }}
        >
          Gather your detectives. Solve the case.
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale * pulseScale})`,
            marginTop: "48px",
            padding: "20px 64px",
            borderRadius: "16px",
            backgroundColor: "#9B2226",
            border: "2px solid rgba(212,175,55,0.4)",
            boxShadow: "0 0 40px rgba(155,34,38,0.5), 0 8px 32px rgba(0,0,0,0.4)",
            fontSize: "24px",
            fontWeight: 900,
            color: "#F7EFE2",
            fontFamily: "Georgia, serif",
            letterSpacing: "4px",
            textTransform: "uppercase" as const,
          }}
        >
          PLAY NOW
        </div>

        {/* URL */}
        <div
          style={{
            opacity: interpolate(frame, [4 * fps, 5 * fps], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
            marginTop: "24px",
            fontSize: "16px",
            color: "#BAAFA1",
            fontFamily: "monospace",
            letterSpacing: "2px",
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
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,7,5,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
