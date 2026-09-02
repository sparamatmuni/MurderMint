import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile } from "remotion";

const CHARACTERS = [
  { name: "Miss Scarlet", img: "images/char_scarlet_1787634742674.jpg", color: "#B5273B" },
  { name: "Colonel Mustard", img: "images/char_mustard_1787634756412.jpg", color: "#C9A24B" },
  { name: "Mrs. Peacock", img: "images/char_peacock_1787634792333.jpg", color: "#2B6CB0" },
  { name: "Professor Plum", img: "images/char_plum_1787634804684.jpg", color: "#7A3FB0" },
  { name: "Mr. Green", img: "images/char_green_1787634778516.jpg", color: "#2FBF8F" },
  { name: "Mrs. White", img: "images/char_white_1787634767182.jpg", color: "#E8DEC8" },
];

export const CharactersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section title
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
        padding: "60px 80px",
      }}
    >
      {/* Section label */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: "40px",
          padding: "8px 20px",
          borderRadius: "20px",
          border: "1px solid rgba(155,34,38,0.6)",
          backgroundColor: "rgba(155,34,38,0.15)",
          color: "#E63946",
          fontSize: "14px",
          fontFamily: "monospace",
          letterSpacing: "3px",
          textTransform: "uppercase" as const,
        }}
      >
        The Suspects
      </div>

      {/* Characters grid */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {CHARACTERS.map((char, i) => {
          const delay = 0.8 * fps + i * 0.25 * fps;
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
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `3px solid ${char.color}`,
                  boxShadow: `0 0 20px ${char.color}40`,
                }}
              >
                <Img
                  src={staticFile(char.img)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "16px",
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
          opacity: interpolate(frame, [4 * fps, 5 * fps], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
          marginTop: "48px",
          fontSize: "22px",
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
