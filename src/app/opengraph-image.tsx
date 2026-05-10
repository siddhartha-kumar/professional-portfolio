import { ImageResponse } from "next/og";

export const alt =
  "Siddhartha Kumar — Data Infrastructure Architect — Engineering data systems that scale beyond limits";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0A0F",
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(0, 212, 255, 0.25), transparent 50%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(123, 97, 255, 0.20), transparent 50%)",
          display: "flex",
          flexDirection: "column",
          padding: "80px 96px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          color: "#FFFFFF",
          position: "relative",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            display: "flex",
          }}
        />

        {/* Brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "linear-gradient(135deg, #00D4FF 0%, #7B61FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 24,
              color: "#0A0A0F",
              letterSpacing: "-0.02em",
            }}
          >
            SK
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#FFFFFF",
                lineHeight: 1.2,
              }}
            >
              Siddhartha Kumar
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#8892A0",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "ui-monospace, monospace",
                marginTop: 4,
              }}
            >
              Data Infrastructure Architect
            </div>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 36,
          }}
        >
          <span style={{ color: "#FFFFFF" }}>Engineering data systems</span>
          <span
            style={{
              background: "linear-gradient(135deg, #00D4FF 0%, #7B61FF 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            that scale beyond limits.
          </span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: "auto",
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {[
            { value: "8,000+", label: "Concurrent Executions" },
            { value: "99.9%", label: "Reliability" },
            { value: "15+", label: "Markets" },
            { value: "5+ Yrs", label: "Experience" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#00D4FF",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#8892A0",
                  fontFamily: "ui-monospace, monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
