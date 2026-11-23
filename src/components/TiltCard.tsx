import React, { useRef, useState, type ReactNode } from "react";
import { soundManager } from "@/utils/audio";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  glare?: boolean;
  glareColor?: string;
  hoverSound?: boolean;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  perspective = 1000,
  glare = true,
  glareColor = "rgba(56, 189, 248, 0.12)",
  hoverSound = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTilt({ x: rotateX, y: rotateY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hoverSound) {
      soundManager.playHover();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
      }}
      className={`relative ${className}`}
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${
            isHovered ? 1.015 : 1
          }, ${isHovered ? 1.015 : 1}, 1)`,
          transformStyle: "preserve-3d",
          transition: isHovered
            ? "transform 0.1s cubic-bezier(0.03, 0.98, 0.52, 0.99)"
            : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className="relative h-full w-full rounded-inherit"
      >
        {children}

        {/* 3D Glare highlight overlay */}
        {glare && (
          <div
            aria-hidden
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, ${glareColor}, transparent 70%)`,
              transition: isHovered ? "opacity 0.2s ease" : "opacity 0.6s ease",
            }}
            className="pointer-events-none absolute inset-0 rounded-inherit z-30 mix-blend-screen"
          />
        )}
      </div>
    </div>
  );
}
