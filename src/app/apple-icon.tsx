import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: "#0A0A0F",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.4), transparent 60%), radial-gradient(circle at 80% 80%, rgba(123, 97, 255, 0.3), transparent 60%)",
        }}
      >
        <span
          style={{
            background: "linear-gradient(135deg, #00D4FF 0%, #7B61FF 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          SK
        </span>
      </div>
    ),
    { ...size }
  );
}
