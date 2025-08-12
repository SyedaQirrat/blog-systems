"use client"

import { useRef, useState, useEffect } from "react";

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

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
    <section
      ref={containerRef}
      className="relative py-10 sm:py-14 md:py-18"
      style={{ backgroundColor: "#0E4772", overflow: "hidden" }}
    >
      {/* Interactive SVG lines - exact as navbar */}
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

      {/* Smaller white card, centered */}
      <div
        className="relative mx-auto"
        style={{
          maxWidth: "900px",
          background: "white",
          borderRadius: "18px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "2.5rem 1.5rem",
          zIndex: 1,
        }}
      >
        {/* Secondary heading */}
        <div className="mb-4 md:mb-6">
          <p className="text-xs sm:text-sm font-light tracking-widest text-gray-600 uppercase text-center sm:text-left">
            HERE ARE SOME REASONS YOU'LL LOVE WORKING WITH US!
          </p>
        </div>

        {/* Subtle graphic element */}
        <div className="mb-6 md:mb-8 flex justify-center">
          <div className="w-12 sm:w-16 h-0.5" style={{ backgroundColor: "#aab8f7" }}></div>
        </div>

        {/* Main heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-gray-900">
            ABOUT US
          </h2>
        </div>

        {/* Content description */}
        <div className="max-w-2xl mx-auto text-center mb-6">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-light px-2 sm:px-0">
            This minimalist blog is designed for readers who value clarity and simplicity. With a focus on typography,
            seamless navigation, and distraction-free reading, it delivers an elegant and enjoyable experience across
            all devices.
          </p>
        </div>

        {/* Feature list */}
        <div className="mb-8 md:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Clean Design</h3>
              <p className="text-sm text-gray-600">uncluttered and readable</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Performance</h3>
              <p className="text-sm text-gray-600">optimized for speed</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Navigation</h3>
              <p className="text-sm text-gray-600">intuitive structure</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto text-center mt-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Responsivesss Layout</h3>
              <p className="text-sm text-gray-600">works on all devices</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Engaging Content</h3>
              <p className="text-sm text-gray-600">focus on storytelling</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
