import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
} from "remotion";

export const SoftDreamyStory: React.FC<{
  senderName: string;
  recipientName: string;
  occasion?: string;
}> = ({ senderName, recipientName, occasion = "Valentine" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ---------------- SCENE TIMING ---------------- */

  const introOpacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const senderOpacity = interpolate(frame, [60, 100], [0, 1], {
    extrapolateRight: "clamp",
  });

  const occasionOpacity = interpolate(frame, [120, 160], [0, 1], {
    extrapolateRight: "clamp",
  });

  const featuresOpacity = interpolate(frame, [180, 220], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scaleSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 200, stiffness: 120 },
  });

  const glowPulse = interpolate(Math.sin(frame / 12), [-1, 1], [0.5, 1]);

  /* ---------------- UI ---------------- */

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f0f14",
        fontFamily: "Playfair Display, serif",
        color: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Soft Piano */}
      <Audio src={staticFile("soft-piano.wav")} volume={0.4} />

      {/* Ambient Glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 182, 193, 0.12), transparent)",
          filter: "blur(160px)",
          opacity: glowPulse,
        }}
      />

      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          fontSize: 140,
          fontWeight: 700,
          opacity: 0.03,
          transform: "rotate(-20deg)",
          letterSpacing: 12,
        }}
      >
        TOHFAAH
      </div>

      {/* Frame Border */}
      <div
        style={{
          position: "absolute",
          inset: 25,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />

      <div style={{ padding: "0 80px", maxWidth: 600 }}>
        {/* ---------------- INTRO ---------------- */}
        <div
          style={{
            opacity: introOpacity,
          }}
        >
          <div
            style={{
              fontSize: 38,
              letterSpacing: 2,
              fontWeight: 300,
              marginBottom: 20,
            }}
          >
            You have received
          </div>
          <div
            style={{
              fontSize: 46,
              fontWeight: 500,
            }}
          >
            A Gift
          </div>
        </div>

        {/* ---------------- SENDER → RECIPIENT ---------------- */}
        <div
          style={{
            opacity: senderOpacity,
            transform: `scale(${scaleSpring})`,
            marginTop: 60,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 400,
              marginBottom: 12,
            }}
          >
            {senderName}
          </div>

          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              opacity: 0.6,
              textTransform: "uppercase",
            }}
          >
            has sent a gift to
          </div>

          <div
            style={{
              fontSize: 52,
              fontWeight: 400,
              marginTop: 14,
            }}
          >
            {recipientName}
          </div>
        </div>

        {/* ---------------- OCCASION ---------------- */}
        <div
          style={{
            opacity: occasionOpacity,
            marginTop: 70,
          }}
        >
          <div
            style={{
              fontSize: 28,
              marginBottom: 8,
              letterSpacing: 3,
              opacity: 0.7,
            }}
          >
            A {occasion} Surprise
          </div>

          <div
            style={{
              fontSize: 20,
              opacity: 0.6,
            }}
          >
            Crafted with devotion on
          </div>

          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              marginTop: 8,
              color: "#ffb6c1",
            }}
          >
            Tohfaah
          </div>
        </div>

        {/* ---------------- FEATURES ---------------- */}
        <div
          style={{
            opacity: featuresOpacity,
            marginTop: 80,
          }}
        >
          <div style={{ fontSize: 22 }}>
            Surprises • Love Locks • Proposals
          </div>

          <div
            style={{
              fontSize: 18,
              marginTop: 30,
              fontStyle: "italic",
              opacity: 0.8,
            }}
          >
            Create yours at tohfaah.online
          </div>
        </div>
      </div>

      {/* Footer Logo */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 0.85,
        }}
      >
        <img
          src={staticFile("logo.png")}
          style={{ width: 80, marginBottom: 6 }}
        />
        <div style={{ fontSize: 14, letterSpacing: 2 }}>
          tohfaah.online
        </div>
      </div>
    </AbsoluteFill>
  );
};
