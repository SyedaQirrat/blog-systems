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
      {/* Exact interactive lines as navbar */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {lines.map((lineIndex) => (
          <path
            key={lineIndex}
            d={generatePath(lineIndex, lines.length)}
            stroke="rgba(122, 203, 89, 0.9)"
            strokeWidth={isHovering ? "6" : "5"}
            fill="none"
            className="transition-all duration-100 ease-out"
          />
        ))}
      </svg>

      {/* Wider white card */}
      <div
        className="bg-white py-8 sm:py-10 md:py-12 px-4 sm:px-10 md:px-16 mx-auto"
        style={{
          maxWidth: "900px",
          borderRadius: "18px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            ABOUT US
          </h2>
        </div>
        <div className="text-center mb-8">
          <p className="text-sm sm:text-base font-medium tracking-wide text-gray-800 uppercase mb-4">
            HERE ARE SOME REASONS YOU'LL LOVE WORKING WITH US!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <div
            className="text-center"
            style={{
              border: "1.5px solid #7ACB59",
              borderRadius: "12px",
              padding: "1rem",
              background: "white",
            }}
          >
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
              Clean Design
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Uncluttered and readable interface that focuses on content clarity
              and user experience.
            </p>
          </div>
          <div
            className="text-center"
            style={{
              border: "1.5px solid #7ACB59",
              borderRadius: "12px",
              padding: "1rem",
              background: "white",
            }}
          >
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
              Fast Performance
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Optimized for speed with efficient loading and smooth interactions.
            </p>
          </div>
          <div
            className="text-center"
            style={{
              border: "1.5px solid #7ACB59",
              borderRadius: "12px",
              padding: "1rem",
              background: "white",
            }}
          >
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
              Easy Navigation
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Intuitive structure that guides users effortlessly through content.
            </p>
          </div>
          <div
            className="text-center"
            style={{
              border: "1.5px solid #7ACB59",
              borderRadius: "12px",
              padding: "1rem",
              background: "white",
            }}
          >
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
              Responsive Layout
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Works seamlessly across all devices and screen sizes.
            </p>
          </div>
          <div
            className="text-center"
            style={{
              border: "1.5px solid #7ACB59",
              borderRadius: "12px",
              padding: "1rem",
              background: "white",
            }}
          >
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
              Engaging Content
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Focus on storytelling and meaningful connections with readers.
            </p>
          </div>
          <div
            className="text-center"
            style={{
              border: "1.5px solid #7ACB59",
              borderRadius: "12px",
              padding: "1rem",
              background: "white",
            }}
          >
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
              Modern Approach
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Contemporary design meets timeless functionality and elegance.
            </p>
          </div>
        </div>
      </div>

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