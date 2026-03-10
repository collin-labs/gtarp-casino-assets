"use client";

import { useState, useRef } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ text, children, position = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const posStyles: Record<string, React.CSSProperties> = {
    top: { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    left: { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    right: { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ position: "relative", display: "inline-flex" }}
    >
      {children}
      {show && (
        <div style={{
          position: "absolute", ...posStyles[position],
          background: "rgba(20,20,20,0.95)", border: "1px solid rgba(212,168,67,0.4)",
          borderRadius: "6px", padding: "6px 12px",
          fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#D4A843",
          whiteSpace: "nowrap", zIndex: 100, pointerEvents: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}>
          {text}
        </div>
      )}
    </div>
  );
}
