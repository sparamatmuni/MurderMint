import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

const CHARACTERS = [
  { name: "Miss Scarlet", color: "#B5273B", initial: "S" },
  { name: "Colonel Mustard", color: "#C9A24B", initial: "M" },
  { name: "Mrs. Peacock", color: "#2B6CB0", initial: "P" },
  { name: "Professor Plum", color: "#7A3FB0", initial: "Pl" },
  { name: "Mr. Green", color: "#2FBF8F", initial: "G" },
  { name: "Mrs. White", color: "#E8DEC8", initial: "W" },
];

export const CharactersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const titleY = interpolate(frame, [0, 0.8 * fps], [-30, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0705",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 120px",
      }}
    >
      {/* Section label */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: "60px",
          padding: "10px 28px",
          borderRadius: "28px",
          border: "1px solid rgba(155,34,38,0.6)",
          backgroundColor: "rgba(155,34,38,0.15)",
          color: "#E63946",
          fontSize: "18px",
          fontFamily: "monospace",
          letterSpacing: "4px",
          textTransform: "uppercase" as const,
        }}
      >
        The Suspects
      </div>

      {/* Characters grid - 3x2 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          justifyContent: "center",
          maxWidth: "1400px",
        }}
      >
        {CHARACTERS.map((char, i) => {
          const delay = 0.8 * fps + i * 0.2 * fps;
          const cardOpacity = interpolate(frame, [delay, delay + 0.5 * fps], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          const cardY = interpolate(frame, [delay, delay + 0.5 * fps], [30, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const cardScale = interpolate(frame, [delay, delay + 0.5 * fps], [0.8, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

          return (
            <div
              key={char.name}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px) scale(${cardScale})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                width: "200px",
              }}
            >
              {/* Character avatar - CSS circle with initial */}
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  backgroundColor: char.color,
                  border: `4px solid ${char.color}`,
                  boxShadow: `0 0 30px ${char.color}60, inset 0 -20px 40px rgba(0,0,0,0.3)`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "56px",
                  fontWeight: 900,
                  color: char.color === "#E8DEC8" ? "#1a120a" : "#F7EFE2",
                  fontFamily: "Georgia, serif",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                {char.initial}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: char.color,
                  fontFamily: "Georgia, serif",
                  textAlign: "center",
                  textShadow: "0 2px 10px rgba(0,0,0,0.6)",
                }}
              >
                {char.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          opacity: interpolate(frame, [3 * fps, 4 * fps], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
          marginTop: "60px",
          fontSize: "28px",
          fontStyle: "italic",
          color: "#D4AF37",
          fontFamily: "Georgia, serif",
          textAlign: "center",
        }}
      >
        Each hiding something. Each a potential killer.
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(10,7,5,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
