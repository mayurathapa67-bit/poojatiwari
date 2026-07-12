import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = "PT — Pooja Tiwari";
export const runtime = "edge";

export default async function AppleIcon() {
  const font = await fetch(
    "https://cdn.jsdelivr.net/npm/@fontsource/inter@4.5.0/files/inter-latin-600-normal.woff"
  ).then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          borderRadius: 40,
          border: "2px solid rgba(255,255,255,0.14)",
          boxShadow: "0 0 60px rgba(59,130,246,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: "-3px",
            fontFamily: "Inter",
            backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          PT
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, weight: 600, style: "normal" }],
    }
  );
}
