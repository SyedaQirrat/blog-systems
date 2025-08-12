"use client"

import { useRef, useState, useEffect } from "react";

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const node = containerRef.current;
    node.addEventListener("mousemove", handleMouseMove);
    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      node.removeEventListener("mousemove", handleMouseMove);
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const getLineCount = () => 11;
  const generatePath = (lineIndex: number, totalLines: number) => {
    const { width, height } = dimensions;
    const y = ((lineIndex + 1) / (totalLines + 1)) * height;
    const curve = 50 * ((lineIndex % 2) ? 1 : -1);
    return `M0,${y} Q${width / 2},${y + curve} ${width},${y}`;
  };
  const lines = Array.from({ length: getLineCount() }, (_, i) => i);

  return (
    <footer
      ref={containerRef}
      style={{
        backgroundColor: "#0E4772",
        color: "#7ACB59",
        borderTop: "2px solid #7ACB59",
        padding: "1rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Footer bottom */}
      <div className="bg-white border-t border-gray-100 py-8 px-4 sm:px-6 md:px-8" style={{ position: "relative", zIndex: 1 }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2025 SSTRACK.io  All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}