import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

const ROOMS = [
  { name: "Kitchen", icon: "🍳", color: "#C9A24B" },
  { name: "Ballroom", icon: "💃", color: "#7A3FB0" },
  { name: "Conservatory", icon: "🌿", color: "#2FBF8F" },
  { name: "Library", icon: "📚", color: "#2B6CB0" },
  { name: "Study", icon: "📜", color: "#B5273B" },
];

export const GameplayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const diceScale = interpolate(
    frame,
    [0.8 * fps, 1.1 * fps, 1.4 * fps],
    [0, 1.3, 1],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  const diceRotation = interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 360], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const roomHighlightIndex = Math.floor(
    interpolate(frame, [1.5 * fps, 5 * fps], [0, ROOMS.length - 0.01], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  const sugOpacity = interpolate(frame, [5 * fps, 6 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const sugY = interpolate(frame, [5 * fps, 6 * fps], [20, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const evidenceOpacity = interpolate(frame, [6.5 * fps, 7.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const evidenceScale = interpolate(frame, [6.5 * fps, 7.5 * fps], [0.5, 1], {
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
          marginBottom: "48px",
          padding: "10px 28px",
          borderRadius: "28px",
          border: "1px solid rgba(47,191,143,0.6)",
          backgroundColor: "rgba(47,191,143,0.15)",
          color: "#2FBF8F",
          fontSize: "18px",
          fontFamily: "monospace",
          letterSpacing: "4px",
          textTransform: "uppercase" as const,
        }}
      >
        The Investigation
      </div>

      {/* Main content area */}
      <div style={{ display: "flex", gap: "60px", alignItems: "center" }}>
        {/* Left: Dice */}
        <div
          style={{
            opacity: interpolate(frame, [0.6 * fps, 1 * fps], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "20px",
              backgroundColor: "#1E140D",
              border: "4px solid #C99738",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "80px",
              transform: `scale(${diceScale}) rotate(${diceRotation}deg)`,
              boxShadow: "0 0 40px rgba(201,151,56,0.4)",
            }}
          >
            🎲
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#BAAFA1",
              fontFamily: "monospace",
              textTransform: "uppercase" as const,
              letterSpacing: "3px",
            }}
          >
            Roll & Move
          </div>
        </div>

        {/* Center: Room cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {ROOMS.map((room, i) => {
            const isActive = i === roomHighlightIndex;
            const cardOpacity = interpolate(
              frame,
              [1 * fps + i * 0.12 * fps, 1.5 * fps + i * 0.12 * fps],
              [0, 1],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );

            return (
              <div
                key={room.name}
                style={{
                  opacity: cardOpacity,
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "16px 28px",
                  borderRadius: "16px",
                  border: `2px solid ${isActive ? room.color : "#4A3322"}`,
                  backgroundColor: isActive ? `${room.color}15` : "rgba(30,20,13,0.8)",
                  transform: `scale(${isActive ? 1.05 : 1})`,
                  width: "320px",
                }}
              >
                <span style={{ fontSize: "32px" }}>{room.icon}</span>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: isActive ? room.color : "#BAAFA1",
                    fontFamily: "Georgia, serif",
                    flex: 1,
                  }}
                >
                  {room.name}
                </span>
                {isActive && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: room.color,
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    ENTER
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Suggestion + Evidence */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "380px" }}>
          {/* Suggestion bubble */}
          <div
            style={{
              opacity: sugOpacity,
              transform: `translateY(${sugY}px)`,
              padding: "28px",
              borderRadius: "20px",
              backgroundColor: "rgba(47,191,143,0.15)",
              border: "1px solid rgba(47,191,143,0.4)",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#2FBF8F",
                fontFamily: "monospace",
                textTransform: "uppercase" as const,
                letterSpacing: "3px",
                marginBottom: "12px",
              }}
            >
              Suggestion
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "#F7EFE2",
                fontFamily: "Georgia, serif",
                lineHeight: 1.5,
              }}
            >
              "Miss Scarlet with the Dagger in the Library"
            </div>
          </div>

          {/* Evidence card reveal */}
          <div
            style={{
              opacity: evidenceOpacity,
              transform: `scale(${evidenceScale})`,
              padding: "28px",
              borderRadius: "20px",
              backgroundColor: "rgba(201,151,56,0.15)",
              border: "2px solid #C99738",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#D4AF37",
                fontFamily: "monospace",
                textTransform: "uppercase" as const,
                letterSpacing: "3px",
                marginBottom: "12px",
              }}
            >
              Evidence Revealed
            </div>
            <div style={{ fontSize: "60px", marginBottom: "12px" }}>🔍</div>
            <div
              style={{
                fontSize: "18px",
                color: "#F7EFE2",
                fontFamily: "Georgia, serif",
              }}
            >
              A card has been shown...
            </div>
          </div>
        </div>
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
