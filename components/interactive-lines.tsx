"use client"

import { useEffect, useRef, useState } from "react"

interface RippleEffect {
  x: number
  y: number
  timestamp: number
  id: number
}

export function InteractiveLines() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [ripples, setRipples] = useState<RippleEffect[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 })
  const rippleIdRef = useRef(0)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const newPosition = {
          x: ((e.clientX - rect.left) / rect.width) * dimensions.width,
          y: ((e.clientY - rect.top) / rect.height) * dimensions.height,
        }
        setMousePosition(newPosition)

        setRipples((prev) => {
          const lastRipple = prev[prev.length - 1]
          const distance = lastRipple
            ? Math.sqrt(Math.pow(newPosition.x - lastRipple.x, 2) + Math.pow(newPosition.y - lastRipple.y, 2))
            : Number.POSITIVE_INFINITY

          if (distance > 15) {
            // Less frequent ripples for better performance
            const newRipple: RippleEffect = {
              x: newPosition.x,
              y: newPosition.y,
              timestamp: Date.now(),
              id: rippleIdRef.current++,
            }
            return [...prev, newRipple].slice(-8) // Keep fewer ripples
          }
          return prev
        })
      }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => {
      setIsHovering(false)
      setRipples([])
    }

    document.addEventListener("mousemove", handleMouseMove)
    if (containerRef.current) {
      containerRef.current.addEventListener("mouseenter", handleMouseEnter)
      containerRef.current.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseenter", handleMouseEnter)
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [dimensions])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setRipples((prev) => prev.filter((ripple) => now - ripple.timestamp < 2000)) // 2 second ripple duration
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const generatePath = (lineIndex: number, totalLines: number) => {
    const containerWidth = dimensions.width
    const baseLineY = (lineIndex / (totalLines - 1)) * (dimensions.height * 0.8) + dimensions.height * 0.1

    const progressFromLeft = lineIndex / (totalLines - 1)
    const lineLength = containerWidth * (1 - progressFromLeft * 0.6)

    let path = `M 0 ${baseLineY}`
    let currentX = 0
    const step = 8 // Smaller steps for smoother curves

    while (currentX < lineLength) {
      let totalOffset = 0

      ripples.forEach((ripple) => {
        const age = (Date.now() - ripple.timestamp) / 2000 // 2 second duration
        const rippleRadius = age * 150 // Expanding ripple
        const distanceFromRipple = Math.sqrt(Math.pow(currentX - ripple.x, 2) + Math.pow(baseLineY - ripple.y, 2))

        // Create wave effect based on distance from ripple center
        if (distanceFromRipple < rippleRadius && distanceFromRipple > rippleRadius - 40) {
          const waveIntensity = (1 - age) * 0.8 // Fade over time
          const wavePhase = ((distanceFromRipple - rippleRadius + 40) / 40) * Math.PI * 2
          const waveAmplitude = Math.sin(wavePhase) * 20 * waveIntensity
          totalOffset += waveAmplitude
        }
      })

      if (isHovering) {
        const distanceFromCursor = Math.sqrt(
          Math.pow(currentX - mousePosition.x, 2) + Math.pow(baseLineY - mousePosition.y, 2),
        )

        if (distanceFromCursor < 60) {
          const magneticForce = (60 - distanceFromCursor) / 60
          const direction = baseLineY < mousePosition.y ? -1 : 1
          totalOffset += direction * magneticForce * 25
        }
      }

      const nextX = Math.min(currentX + step, lineLength)
      path += ` L ${nextX} ${baseLineY + totalOffset}`
      currentX = nextX
    }

    return path
  }

  const getLineCount = () => {
    if (dimensions.width < 640) return 18
    if (dimensions.width < 1024) return 22
    return 26
  }

  const lines = Array.from({ length: getLineCount() }, (_, i) => i)

  return (
    <div className="w-full py-4 sm:py-6 md:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div
          ref={containerRef}
          className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-visible cursor-none rounded-lg bg-white transition-all duration-300"
          style={{
            background: isHovering
              ? "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(170, 184, 247, 0.05) 0%, rgba(255, 255, 255, 1) 70%)"
              : "white",
            // @ts-ignore
            "--mouse-x": `${(mousePosition.x / dimensions.width) * 100}%`,
            "--mouse-y": `${(mousePosition.y / dimensions.height) * 100}%`,
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="none"
          >
            {lines.map((lineIndex) => (
              <path
                key={`line-${lineIndex}`}
                d={generatePath(lineIndex, lines.length)}
                stroke="#aab8f7"
                strokeWidth={isHovering ? "3" : "2"}
                fill="none"
                className="transition-all duration-100 ease-out"
                opacity={isHovering ? 1 : 0.8}
              />
            ))}
          </svg>

          {isHovering && (
            <>
              <div
                className="absolute pointer-events-none transition-all duration-100 ease-out animate-pulse"
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#aab8f7",
                  left: (mousePosition.x / dimensions.width) * 100 + "%",
                  top: (mousePosition.y / dimensions.height) * 100 + "%",
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 30px rgba(170, 184, 247, 0.8), 0 0 60px rgba(170, 184, 247, 0.4)",
                  opacity: 0.9,
                }}
              />
              <div
                className="absolute pointer-events-none transition-all duration-200 ease-out"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "2px solid rgba(170, 184, 247, 0.3)",
                  left: (mousePosition.x / dimensions.width) * 100 + "%",
                  top: (mousePosition.y / dimensions.height) * 100 + "%",
                  transform: "translate(-50%, -50%)",
                  animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
