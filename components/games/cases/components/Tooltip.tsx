"use client";

import { useState } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%) scale(1)",
            background: "rgba(20,20,20,0.95)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(212,168,67,0.2)",
            borderRadius: "6px",
            padding: "4px 10px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            color: "#A8A8A8",
            whiteSpace: "nowrap",
            zIndex: 999,
            pointerEvents: "none",
            animation: "fadeInUp 0.15s ease-out",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
