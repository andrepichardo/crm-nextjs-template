import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 32,
  height: 32,
}

export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1e40af",
      }}
    >
      {/* Simple C letter for CRM */}
      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        C
      </div>
    </div>,
    {
      ...size,
    },
  )
}
