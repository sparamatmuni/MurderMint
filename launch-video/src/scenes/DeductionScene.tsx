import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

const NOTEPAD_ITEMS = [
  { name: "Miss Scarlet", category: "suspect", eliminated: false },
  { name: "Colonel Mustard", category: "suspect", eliminated: true },
  { name: "Mrs. Peacock", category: "suspect", eliminated: false },
  { name: "Brass Candlestick", category: "weapon", eliminated: true },
  { name: "Antique Dagger", category: "weapon", eliminated: false },
  { name: "Lead Pipe", category: "weapon", eliminated: true },
  { name: "Kitchen", category: "room", eliminated: true },
  { name: "Ballroom", category: "room", eliminated: false },
  { name: "Library", category: "room", eliminated: true },
];

export const DeductionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Notepad items appear sequentially
  const itemsVisible = Math.floor(
    interpolate(frame, [0.5 * fps, 4 * fps], [0, NOTEPAD_ITEMS.length], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  // Cross-out animation for eliminated items
  const crossProgress = (index: number) => {
    const itemDelay = 0.5 * fps + index * 0.35 * fps;
    if (!NOTEPAD_ITEMS[index].eliminated) return 0;
    return interpolate(frame, [itemDelay, itemDelay + 0.3 * fps], [0, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
  };

  // Stats counter
  const statsOpacity = interpolate(frame, [5 * fps, 6 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const ruledOut = NOTEPAD_ITEMS.filter((item) => item.eliminated).length;
  const countUp = Math.floor(
    interpolate(frame, [5 * fps, 6.5 * fps], [0, ruledOut], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0705",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 80px",
      }}
    >
      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          opacity: titleOpacity,
          padding: "8px 20px",
          borderRadius: "20px",
          border: "1px solid rgba(201,151,56,0.6)",
          backgroundColor: "rgba(201,151,56,0.15)",
          color: "#D4AF37",
          fontSize: "14px",
          fontFamily: "monospace",
          letterSpacing: "3px",
          textTransform: "uppercase" as const,
        }}
      >
        Detective Notepad
      </div>

      {/* Notepad card */}
      <div
        style={{
          width: "800px",
          backgroundColor: "#1F1B24",
          borderRadius: "20px",
          border: "2px solid #3A3340",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Notepad header */}
        <div
          style={{
            padding: "20px 24px",
            backgroundColor: "#2A2430",
            borderBottom: "2px solid #3A3340",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>📋</span>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#F3EDE4",
                  fontFamily: "Georgia, serif",
                }}
              >
                Detective Notepad
              </div>
              <div style={{ fontSize: "12px", color: "#9A93A6", fontFamily: "monospace" }}>
                Confidential Dossier
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "12px",
              backgroundColor: "rgba(201,162,75,0.15)",
              border: "1px solid rgba(201,162,75,0.3)",
              fontSize: "14px",
              fontWeight: 700,
              color: "#C9A24B",
              fontFamily: "monospace",
            }}
          >
            {countUp}/{NOTEPAD_ITEMS.length} Ruled Out
          </div>
        </div>

        {/* Notepad items */}
        <div style={{ padding: "16px 24px" }}>
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
                  padding: "10px 16px",
                  marginBottom: "4px",
                  borderRadius: "8px",
                  backgroundColor: isEliminated ? "rgba(181,39,59,0.08)" : "transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor:
                        item.category === "suspect"
                          ? "#B5273B"
                          : item.category === "weapon"
                          ? "#C9A24B"
                          : "#2FBF8F",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "16px",
                      color: isEliminated ? "#9A93A6" : "#F3EDE4",
                      fontFamily: "Georgia, serif",
                      textDecoration: isEliminated ? "line-through" : "none",
                      textDecorationColor: "#E14B4B",
                      textDecorationThickness: "2px",
                    }}
                  >
                    {item.name}
                  </span>
                </div>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    border: `2px solid ${isEliminated ? "#B5273B" : "#3A3340"}`,
                    backgroundColor: isEliminated ? "rgba(181,39,59,0.2)" : "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "14px",
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
          position: "absolute",
          bottom: "80px",
          opacity: statsOpacity,
          fontSize: "22px",
          fontStyle: "italic",
          color: "#D4AF37",
          fontFamily: "Georgia, serif",
          textAlign: "center",
        }}
      >
        Every clue. Every silence. Closer to the truth.
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
