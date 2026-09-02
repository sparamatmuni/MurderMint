import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile } from "remotion";

const ROOMS = [
  { name: "Kitchen", img: "images/room_kitchen_1787633957300.jpg" },
  { name: "Ballroom", img: "images/room_ballroom_1787633938262.jpg" },
  { name: "Conservatory", img: "images/room_conservatory_1787633927809.jpg" },
  { name: "Library", img: "images/room_library_1787633914841.jpg" },
  { name: "Study", img: "images/room_study_1787634010880.jpg" },
];

export const GameplayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Dice animation
  const diceScale = interpolate(
    frame,
    [1 * fps, 1.3 * fps, 1.6 * fps],
    [0, 1.3, 1],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  const diceRotation = interpolate(frame, [1 * fps, 1.6 * fps], [0, 360], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Rooms highlight sequence
  const roomHighlightIndex = Math.floor(
    interpolate(frame, [2 * fps, 6 * fps], [0, ROOMS.length - 0.01], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  // Suggestion text
  const sugOpacity = interpolate(frame, [6 * fps, 7 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const sugY = interpolate(frame, [6 * fps, 7 * fps], [20, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Evidence reveal
  const evidenceOpacity = interpolate(frame, [8 * fps, 9 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const evidenceScale = interpolate(frame, [8 * fps, 9 * fps], [0.5, 1], {
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
          marginBottom: "32px",
          padding: "8px 20px",
          borderRadius: "20px",
          border: "1px solid rgba(47,191,143,0.6)",
          backgroundColor: "rgba(47,191,143,0.15)",
          color: "#2FBF8F",
          fontSize: "14px",
          fontFamily: "monospace",
          letterSpacing: "3px",
          textTransform: "uppercase" as const,
        }}
      >
        The Investigation
      </div>

      {/* Main content area */}
      <div style={{ display: "flex", gap: "48px", alignItems: "center" }}>
        {/* Left: Dice */}
        <div
          style={{
            opacity: interpolate(frame, [0.8 * fps, 1.2 * fps], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "16px",
              backgroundColor: "#1E140D",
              border: "3px solid #C99738",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "64px",
              fontWeight: 900,
              color: "#D4AF37",
              fontFamily: "Georgia, serif",
              transform: `scale(${diceScale}) rotate(${diceRotation}deg)`,
              boxShadow: "0 0 30px rgba(201,151,56,0.4)",
            }}
          >
            🎲
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#BAAFA1",
              fontFamily: "monospace",
              textTransform: "uppercase" as const,
              letterSpacing: "2px",
            }}
          >
            Roll & Move
          </div>
        </div>

        {/* Center: Room cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {ROOMS.map((room, i) => {
            const isActive = i === roomHighlightIndex;
            const cardOpacity = interpolate(
              frame,
              [1.5 * fps + i * 0.15 * fps, 2 * fps + i * 0.15 * fps],
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
                  gap: "16px",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: `2px solid ${isActive ? "#2FBF8F" : "#4A3322"}`,
                  backgroundColor: isActive ? "rgba(47,191,143,0.1)" : "rgba(30,20,13,0.8)",
                  transition: "none",
                  transform: `scale(${isActive ? 1.05 : 1})`,
                }}
              >
                <Img
                  src={staticFile(room.img)}
                  style={{
                    width: "60px",
                    height: "45px",
                    borderRadius: "6px",
                    objectFit: "cover",
                    opacity: isActive ? 1 : 0.6,
                  }}
                />
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: isActive ? "#2FBF8F" : "#BAAFA1",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {room.name}
                </span>
                {isActive && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "12px",
                      color: "#2FBF8F",
                      fontFamily: "monospace",
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
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "300px" }}>
          {/* Suggestion bubble */}
          <div
            style={{
              opacity: sugOpacity,
              transform: `translateY(${sugY}px)`,
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "rgba(47,191,143,0.15)",
              border: "1px solid rgba(47,191,143,0.4)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#2FBF8F",
                fontFamily: "monospace",
                textTransform: "uppercase" as const,
                letterSpacing: "2px",
                marginBottom: "8px",
              }}
            >
              Suggestion
            </div>
            <div
              style={{
                fontSize: "16px",
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
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "rgba(201,151,56,0.15)",
              border: "2px solid #C99738",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#D4AF37",
                fontFamily: "monospace",
                textTransform: "uppercase" as const,
                letterSpacing: "2px",
                marginBottom: "8px",
              }}
            >
              Evidence Revealed
            </div>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "8px",
              }}
            >
              🔍
            </div>
            <div
              style={{
                fontSize: "14px",
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
