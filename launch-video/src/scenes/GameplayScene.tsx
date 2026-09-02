import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile } from "remotion";

const FONT_BRAND = "'Cinzel Decorative', 'Cinzel', serif";
const FONT_ANTIQUE = "'IM Fell English', 'Cormorant Garamond', Georgia, serif";

const ROOMS = [
  { name: "Kitchen", img: "images/room_kitchen_1787633957300.jpg", color: "#C9A24B" },
  { name: "Ballroom", img: "images/room_ballroom_1787633938262.jpg", color: "#7A3FB0" },
  { name: "Conservatory", img: "images/room_conservatory_1787633927809.jpg", color: "#2FBF8F" },
  { name: "Library", img: "images/room_library_1787633914841.jpg", color: "#2B6CB0" },
  { name: "Study", img: "images/room_study_1787634010880.jpg", color: "#B5273B" },
];

const WEAPONS = [
  { name: "Dagger", img: "images/weapon_dagger_1787634831283.jpg" },
  { name: "Revolver", img: "images/weapon_revolver_1787634859317.jpg" },
  { name: "Candlestick", img: "images/weapon_candlestick_1787634817189.jpg" },
];

export const GameplayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Detective magnifying glass mascot - moves across scenes
  const mascotX = interpolate(frame, [0, 3 * fps, 6 * fps, 9 * fps, 12 * fps], [100, 400, 700, 400, 100], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const mascotY = interpolate(frame, [0, 2 * fps, 4 * fps, 6 * fps, 8 * fps], [200, 150, 250, 180, 200], {
    extrapolateRight: "clamp",
  });
  const mascotRotation = interpolate(frame, [0, 6 * fps, 12 * fps], [0, 15, -10], {
    extrapolateRight: "clamp",
  });
  const mascotOpacity = interpolate(frame, [0.5 * fps, 1.5 * fps, 10 * fps, 12 * fps], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Room highlight
  const roomHighlightIndex = Math.floor(
    interpolate(frame, [2 * fps, 8 * fps], [0, ROOMS.length - 0.01], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  // Weapon reveal
  const weaponRevealIndex = Math.floor(
    interpolate(frame, [6 * fps, 10 * fps], [0, WEAPONS.length - 0.01], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  // Suggestion text
  const sugOpacity = interpolate(frame, [8 * fps, 9.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out
  const fadeOut = interpolate(frame, [10.5 * fps, 12.5 * fps], [1, 0], {
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
        padding: "60px 100px",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 30% 40%, rgba(201,151,56,0.06) 0%, transparent 50%), radial-gradient(ellipse at center, #1E140D 0%, #120B07 80%)",
          pointerEvents: "none",
        }}
      />

      {/* Detective Magnifying Glass Mascot */}
      <div
        style={{
          position: "absolute",
          left: mascotX,
          top: mascotY,
          opacity: mascotOpacity,
          transform: `rotate(${mascotRotation}deg)`,
          zIndex: 20,
          fontSize: "80px",
          filter: "drop-shadow(0 4px 20px rgba(201,151,56,0.4))",
          pointerEvents: "none",
        }}
      >
        🔍
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", opacity: fadeOut }}>
        {/* Section label */}
        <div
          style={{
            opacity: titleOpacity,
            textAlign: "center" as const,
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              padding: "8px 24px",
              borderRadius: "24px",
              border: "1px solid rgba(47,191,143,0.5)",
              backgroundColor: "rgba(47,191,143,0.1)",
              color: "#2FBF8F",
              fontSize: "14px",
              fontFamily: "'Special Elite', monospace",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
            }}
          >
            The Investigation
          </span>
        </div>

        {/* Main content - Rooms on left, Weapons on right */}
        <div style={{ display: "flex", gap: "60px", justifyContent: "center" }}>
          {/* Left: Room cards with images */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {ROOMS.map((room, i) => {
              const isActive = i === roomHighlightIndex;
              const cardOpacity = interpolate(
                frame,
                [1 * fps + i * 0.2 * fps, 1.8 * fps + i * 0.2 * fps],
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
                    borderRadius: "14px",
                    border: `2px solid ${isActive ? room.color : "#3E291C"}`,
                    backgroundColor: isActive ? `${room.color}15` : "rgba(18,11,7,0.8)",
                    transform: `scale(${isActive ? 1.03 : 1})`,
                    width: "360px",
                    transition: "none",
                  }}
                >
                  <Img
                    src={staticFile(room.img)}
                    style={{
                      width: "64px",
                      height: "48px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      opacity: isActive ? 1 : 0.6,
                      filter: isActive ? "brightness(1.1)" : "brightness(0.7)",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: isActive ? room.color : "#BAAFA1",
                        fontFamily: FONT_ANTIQUE,
                      }}
                    >
                      {room.name}
                    </div>
                  </div>
                  {isActive && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: room.color,
                        fontFamily: "'Special Elite', monospace",
                        fontWeight: 700,
                        letterSpacing: "2px",
                      }}
                    >
                      ENTER
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Weapon cards with images */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                fontSize: "14px",
                color: "#D4AF37",
                fontFamily: "'Special Elite', monospace",
                letterSpacing: "3px",
                textTransform: "uppercase" as const,
                opacity: interpolate(frame, [5 * fps, 6 * fps], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              The Weapons
            </div>
            {WEAPONS.map((weapon, i) => {
              const isActive = i === weaponRevealIndex;
              const weaponOpacity = interpolate(
                frame,
                [5.5 * fps + i * 0.8 * fps, 6.5 * fps + i * 0.8 * fps],
                [0, 1],
                { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
              );
              const weaponScale = interpolate(
                frame,
                [5.5 * fps + i * 0.8 * fps, 6.5 * fps + i * 0.8 * fps],
                [0.8, 1],
                { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
              );

              return (
                <div
                  key={weapon.name}
                  style={{
                    opacity: weaponOpacity,
                    transform: `scale(${weaponScale})`,
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px 24px",
                    borderRadius: "16px",
                    border: `2px solid ${isActive ? "#9B2226" : "#3E291C"}`,
                    backgroundColor: isActive ? "rgba(155,34,38,0.12)" : "rgba(18,11,7,0.8)",
                    width: "300px",
                  }}
                >
                  <Img
                    src={staticFile(weapon.img)}
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      filter: isActive ? "brightness(1.1) saturate(1.2)" : "brightness(0.7)",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: isActive ? "#F7EFE2" : "#BAAFA1",
                        fontFamily: FONT_ANTIQUE,
                      }}
                    >
                      {weapon.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestion bubble */}
        <div
          style={{
            opacity: sugOpacity,
            marginTop: "40px",
            textAlign: "center" as const,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "20px 40px",
              borderRadius: "20px",
              backgroundColor: "rgba(155,34,38,0.15)",
              border: "1px solid rgba(155,34,38,0.4)",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontStyle: "italic",
                color: "#F7EFE2",
                fontFamily: FONT_ANTIQUE,
              }}
            >
              "Miss Scarlet with the Dagger in the Library..."
            </div>
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
