"use client";

import { useState, useRef, useCallback, useId, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LuxuryTooltipProps {
  children: ReactNode;
  title?: string;
  text: string;
  icon?: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  maxWidth?: number;
}

const COLORS = {
  bg: "rgba(15,12,5,0.96)",
  border: "rgba(212,168,67,0.3)",
  titleColor: "#D4A843",
  textColor: "rgba(255,255,255,0.75)",
  shadow: "0 4px 24px rgba(0,0,0,0.7), 0 0 40px rgba(212,168,67,0.06)",
};

const CARET_SIZE = 6;

function getCaretStyle(position: string): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
  };

  switch (position) {
    case "top":
      return {
        ...base,
        bottom: -CARET_SIZE,
        left: "50%",
        transform: "translateX(-50%)",
        borderWidth: `${CARET_SIZE}px ${CARET_SIZE}px 0 ${CARET_SIZE}px`,
        borderColor: `${COLORS.border} transparent transparent transparent`,
      };
    case "bottom":
      return {
        ...base,
        top: -CARET_SIZE,
        left: "50%",
        transform: "translateX(-50%)",
        borderWidth: `0 ${CARET_SIZE}px ${CARET_SIZE}px ${CARET_SIZE}px`,
        borderColor: `transparent transparent ${COLORS.border} transparent`,
      };
    case "left":
      return {
        ...base,
        right: -CARET_SIZE,
        top: "50%",
        transform: "translateY(-50%)",
        borderWidth: `${CARET_SIZE}px 0 ${CARET_SIZE}px ${CARET_SIZE}px`,
        borderColor: `transparent transparent transparent ${COLORS.border}`,
      };
    case "right":
      return {
        ...base,
        left: -CARET_SIZE,
        top: "50%",
        transform: "translateY(-50%)",
        borderWidth: `${CARET_SIZE}px ${CARET_SIZE}px ${CARET_SIZE}px 0`,
        borderColor: `transparent ${COLORS.border} transparent transparent`,
      };
    default:
      return base;
  }
}

function getTooltipPosition(position: string): React.CSSProperties {
  switch (position) {
    case "top":
      return {
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: CARET_SIZE + 4,
      };
    case "bottom":
      return {
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: CARET_SIZE + 4,
      };
    case "left":
      return {
        right: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        marginRight: CARET_SIZE + 4,
      };
    case "right":
      return {
        left: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        marginLeft: CARET_SIZE + 4,
      };
    default:
      return {};
  }
}

function getMotionOrigin(position: string) {
  switch (position) {
    case "top":    return { initial: { opacity: 0, y: 6 },  animate: { opacity: 1, y: 0 } };
    case "bottom": return { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 } };
    case "left":   return { initial: { opacity: 0, x: 6 },  animate: { opacity: 1, x: 0 } };
    case "right":  return { initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 } };
    default:       return { initial: { opacity: 0, y: 6 },  animate: { opacity: 1, y: 0 } };
  }
}

export default function LuxuryTooltip({
  children,
  title,
  text,
  icon,
  position = "top",
  delay = 400,
  maxWidth = 260,
}: LuxuryTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const handleEnter = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const handleLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setVisible(false);
  }, []);

  const anim = getMotionOrigin(position);

  return (
    <span
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      aria-describedby={visible ? tooltipId : undefined}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={anim.initial}
            animate={anim.animate}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              zIndex: 9999,
              pointerEvents: "none",
              maxWidth,
              ...getTooltipPosition(position),
            }}
          >
            {/* Corpo do tooltip */}
            <div
              style={{
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: "10px 14px",
                boxShadow: COLORS.shadow,
              }}
            >
              {/* Titulo (opcional) */}
              {title && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  {icon && (
                    <img
                      src={icon}
                      alt=""
                      style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.8 }}
                    />
                  )}
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 700,
                      fontSize: 11,
                      color: COLORS.titleColor,
                      letterSpacing: "1.2px",
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </span>
                </div>
              )}

              {/* Texto principal */}
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontWeight: 400,
                  fontSize: 11,
                  color: COLORS.textColor,
                  lineHeight: 1.5,
                  display: "block",
                }}
              >
                {text}
              </span>
            </div>

            {/* Seta/caret */}
            <div style={getCaretStyle(position)} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
