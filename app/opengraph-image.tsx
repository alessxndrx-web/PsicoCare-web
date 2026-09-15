import { ImageResponse } from "next/og";
export const alt = "Psico Care. Tu bienestar importa. Un espacio para hablar, practicar y avanzar a tu ritmo.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ background: "#000022", color: "#D9EDF6", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "90px" }}><span style={{ color: "#A2AAE8", fontSize: 30 }}>Psico Care</span><div style={{ display: "flex", flexDirection: "column", fontSize: 88, lineHeight: 1.1, margin: "30px 0" }}><span>Tu bienestar</span><span style={{ color: "#A2AAE8" }}>importa.</span></div><span style={{ fontSize: 27 }}>Un espacio para hablar, practicar y avanzar a tu ritmo.</span></div>, size);
}
