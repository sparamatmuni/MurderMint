import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

const FONT_BRAND = "'Cinzel Decorative', 'Cinzel', serif";
const FONT_ANTIQUE = "'IM Fell English', 'Cormorant Garamond', Georgia, serif";

const NOTEPAD_ITEMS = [
  { name: "Miss Scarlet", category: "suspect", eliminated: false, color: "#B5273B" },
  { name: "Colonel Mustard", category: "suspect", eliminated: true, color: "#C9A24B" },
  { name: "Mrs. Peacock", category: "suspect", eliminated: false, color: "#2B6CB0" },
  { name: "Brass Candlestick", category: "weapon", eliminated: true, color: "#D4AF37" },
  { name: "Antique Dagger", category: "weapon", eliminated: false, color: "#E63946" },
  { name: "Lead Pipe", category: "weapon", eliminated: true, color: "#9A93A6" },
  { name: "Kitchen", category: "room", eliminated: true, color: "#2FBF8F" },
  { name: "Ballroom", category: "room", eliminated: false, color: "#7A3FB0" },
  { name: "Library", category: "room", eliminated: true, color: "#2B6CB0" },
];

export const DeductionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Notepad items appear sequentially
  const itemsVisible = Math.floor(
    interpolate(frame, [0.8 * fps, 5 * fps], [0, NOTEPAD_ITEMS.length], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  // Cross-out animation for eliminated items
  const crossProgress = (index: number) => {
    const itemDelay = 0.8 * fps + index * 0.4 * fps;
    if (!NOTEPAD_ITEMS[index].eliminated) return 0;
    return interpolate(frame, [itemDelay, itemDelay + 0.4 * fps], [0, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
  };

  // Stats counter
  const statsOpacity = interpolate(frame, [6 * fps, 7 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const ruledOut = NOTEPAD_ITEMS.filter((item) => item.eliminated).length;
  const countUp = Math.floor(
    interpolate(frame, [6 * fps, 7.5 * fps], [0, ruledOut], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  // Detective mascot
  const mascotOpacity = interpolate(frame, [0, 1 * fps, 7 * fps, 9 * fps], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Fade out
  const fadeOut = interpolate(frame, [7.5 * fps, 9 * fps], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
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
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 30%, #1E140D 0%, #120B07 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Detective mascot - magnifying glass */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          right: "200px",
          opacity: mascotOpacity,
          fontSize: "100px",
          filter: "drop-shadow(0 4px 30px rgba(201,151,56,0.4))",
          transform: `rotate(-15deg)`,
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        🔍
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, width: "900px", opacity: fadeOut }}>
        {/* Section label */}
        <div
          style={{
            opacity: titleOpacity,
            textAlign: "center" as const,
            marginBottom: "30px",
          }}
        >
          <span
            style={{
              padding: "8px 24px",
              borderRadius: "24px",
              border: "1px solid rgba(201,151,56,0.5)",
              backgroundColor: "rgba(201,151,56,0.1)",
              color: "#D4AF37",
              fontSize: "14px",
              fontFamily: "'Special Elite', monospace",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
            }}
          >
            Detective Notepad
          </span>
        </div>

        {/* Notepad card */}
        <div
          style={{
            backgroundColor: "#1E140D",
            borderRadius: "24px",
            border: "2px solid #3E291C",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,151,56,0.1)",
          }}
        >
          {/* Notepad header */}
          <div
            style={{
              padding: "24px 32px",
              backgroundColor: "#2A1B12",
              borderBottom: "2px solid #3E291C",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "28px" }}>📋</span>
              <div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 400,
                    color: "#F7EFE2",
                    fontFamily: FONT_ANTIQUE,
                  }}
                >
                  Detective Notepad
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#BAAFA1",
                    fontFamily: "'Special Elite', monospace",
                    letterSpacing: "1px",
                  }}
                >
                  Confidential Dossier
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "8px 18px",
                borderRadius: "14px",
                backgroundColor: "rgba(201,151,56,0.12)",
                border: "1px solid rgba(201,151,56,0.3)",
                fontSize: "16px",
                fontWeight: 700,
                color: "#D4AF37",
                fontFamily: "'Special Elite', monospace",
              }}
            >
              {countUp}/{NOTEPAD_ITEMS.length} Ruled Out
            </div>
          </div>

          {/* Notepad items */}
          <div style={{ padding: "20px 32px" }}>
            {NOTEPAD_ITEMS.slice(0, itemsVisible).map((item, i) => {
              const isEliminated = item.eliminated;
              const crossProg = crossProgress(i);

              return (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 20px",
                    marginBottom: "6px",
                    borderRadius: "10px",
                    backgroundColor: isEliminated ? "rgba(155,34,38,0.08)" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: item.color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "18px",
                        color: isEliminated ? "#9A93A6" : "#F7EFE2",
                        fontFamily: FONT_ANTIQUE,
                        textDecoration: isEliminated ? "line-through" : "none",
                        textDecorationColor: "#E14B4B",
                        textDecorationThickness: "2px",
                      }}
                    >
                      {item.name}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#BAAFA1",
                        fontFamily: "'Special Elite', monospace",
                        textTransform: "uppercase" as const,
                        letterSpacing: "1px",
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: `2px solid ${isEliminated ? "#B5273B" : "#3E291C"}`,
                      backgroundColor: isEliminated ? "rgba(155,34,38,0.2)" : "transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "16px",
                      color: "#E14B4B",
                      fontWeight: 700,
                      opacity: crossProg,
                    }}
                  >
                    ✗
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            opacity: statsOpacity,
            marginTop: "30px",
            textAlign: "center" as const,
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontStyle: "italic",
              color: "#D4AF37",
              fontFamily: FONT_ANTIQUE,
            }}
          >
            Every clue. Every silence. Closer to the truth.
          </div>
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
