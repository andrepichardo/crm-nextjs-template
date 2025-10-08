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
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        borderRadius: "6px",
      }}
    >
      {/* Three interconnected nodes representing CRM relationships */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connection lines */}
        <line x1="12" y1="6" x2="7" y2="16" stroke="#60a5fa" strokeWidth="1.5" />
        <line x1="12" y1="6" x2="17" y2="16" stroke="#60a5fa" strokeWidth="1.5" />
        <line x1="7" y1="16" x2="17" y2="16" stroke="#60a5fa" strokeWidth="1.5" />

        {/* Top node (main contact) */}
        <circle cx="12" cy="6" r="2.5" fill="#3b82f6" />

        {/* Bottom left node */}
        <circle cx="7" cy="16" r="2.5" fill="#3b82f6" />

        {/* Bottom right node */}
        <circle cx="17" cy="16" r="2.5" fill="#3b82f6" />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}
