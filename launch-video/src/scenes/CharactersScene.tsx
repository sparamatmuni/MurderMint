import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile } from "remotion";

const FONT_BRAND = "'Cinzel Decorative', 'Cinzel', serif";
const FONT_ANTIQUE = "'IM Fell English', 'Cormorant Garamond', Georgia, serif";

const CHARACTERS = [
  { name: "Miss Scarlet", title: "The Enigmatic Actress", img: "images/char_scarlet_1787634742674.jpg", color: "#B5273B" },
  { name: "Colonel Mustard", title: "The Decorated Veteran", img: "images/char_mustard_1787634756412.jpg", color: "#C9A24B" },
  { name: "Mrs. Peacock", title: "The Grand Socialite", img: "images/char_peacock_1787634792333.jpg", color: "#2B6CB0" },
  { name: "Professor Plum", title: "The Arcane Scholar", img: "images/char_plum_1787634804684.jpg", color: "#7A3FB0" },
  { name: "Mr. Green", title: "The Shadow Broker", img: "images/char_green_1787634778516.jpg", color: "#2FBF8F" },
  { name: "Mrs. White", title: "The Silent Housekeeper", img: "images/char_white_1787634767182.jpg", color: "#E8DEC8" },
];

export const CharactersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section label
  const labelOpacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Title
  const titleOpacity = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Fade out
  const fadeOut = interpolate(frame, [16 * fps, 18 * fps], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#120B07",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 120px",
      }}
    >
      {/* Dark radial background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, #1E140D 0%, #120B07 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", opacity: fadeOut }}>
        {/* Section label */}
        <div
          style={{
            opacity: labelOpacity,
            marginBottom: "16px",
            textAlign: "center" as const,
          }}
        >
          <span
            style={{
              padding: "8px 24px",
              borderRadius: "24px",
              border: "1px solid rgba(155,34,38,0.5)",
              backgroundColor: "rgba(155,34,38,0.1)",
              color: "#E63946",
              fontSize: "14px",
              fontFamily: "'Special Elite', monospace",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
            }}
          >
            The Suspects
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            textAlign: "center" as const,
            marginBottom: "50px",
          }}
        >
          <h2
            style={{
              fontSize: "52px",
              fontWeight: 400,
              color: "#F7EFE2",
              fontFamily: FONT_ANTIQUE,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            Each hiding something. Each a potential killer.
          </h2>
        </div>

        {/* Characters grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "32px",
            justifyContent: "center",
          }}
        >
          {CHARACTERS.map((char, i) => {
            const delay = 1.5 * fps + i * 0.3 * fps;
            const cardOpacity = interpolate(frame, [delay, delay + 0.6 * fps], [0, 1], {
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            const cardY = interpolate(frame, [delay, delay + 0.6 * fps], [40, 0], {
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            const cardScale = interpolate(frame, [delay, delay + 0.6 * fps], [0.85, 1], {
              extrapolateRight: "clamp",
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
                  gap: "14px",
                  width: "240px",
                }}
              >
                {/* Character portrait with border glow */}
                <div
                  style={{
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `3px solid ${char.color}`,
                    boxShadow: `0 0 25px ${char.color}50, inset 0 0 30px rgba(0,0,0,0.4)`,
                    position: "relative",
                  }}
                >
                  <Img
                    src={staticFile(char.img)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.9) contrast(1.1)",
                    }}
                  />
                </div>
                {/* Name */}
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: char.color,
                    fontFamily: FONT_ANTIQUE,
                    textAlign: "center" as const,
                    textShadow: `0 2px 12px ${char.color}40`,
                  }}
                >
                  {char.name}
                </div>
                {/* Title */}
                <div
                  style={{
                    fontSize: "13px",
                    color: "#BAAFA1",
                    fontFamily: "'Special Elite', monospace",
                    letterSpacing: "1px",
                    textAlign: "center" as const,
                  }}
                >
                  {char.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, #120B07 85%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
