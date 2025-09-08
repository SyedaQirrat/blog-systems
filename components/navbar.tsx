"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface Category {
  categoryId: string
  name: string
}

interface NavbarProps {
  categories: Category[]
  currentCategory: string
  currentTag: string
  onCategoryClick: (category: string) => void
  onClearFilters: () => void
}

interface RippleEffect {
  x: number
  y: number
  timestamp: number
  id: number
}

export function Navbar({ categories, currentCategory, currentTag, onCategoryClick, onClearFilters }: NavbarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [ripples, setRipples] = useState<RippleEffect[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
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

          if (distance > 20) {
            const newRipple: RippleEffect = {
              x: newPosition.x,
              y: newPosition.y,
              timestamp: Date.now(),
              id: rippleIdRef.current++,
            }
            return [...prev, newRipple].slice(-6)
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

    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", handleMouseMove)
      containerRef.current.addEventListener("mouseenter", handleMouseEnter)
      containerRef.current.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove)
        containerRef.current.removeEventListener("mouseenter", handleMouseEnter)
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [dimensions])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setRipples((prev) => prev.filter((ripple) => now - ripple.timestamp < 1500))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const generatePath = (lineIndex: number, totalLines: number) => {
    const containerWidth = dimensions.width
    const baseLineY = (lineIndex / (totalLines - 1)) * dimensions.height

    const lineLength = containerWidth

    let path = `M 0 ${baseLineY}`
    let currentX = 0
    const step = 10

    while (currentX < lineLength) {
      let totalOffset = 0

      ripples.forEach((ripple) => {
        const age = (Date.now() - ripple.timestamp) / 1500
        const rippleRadius = age * 120
        const distanceFromRipple = Math.sqrt(Math.pow(currentX - ripple.x, 2) + Math.pow(baseLineY - ripple.y, 2))

        if (distanceFromRipple < rippleRadius && distanceFromRipple > rippleRadius - 30) {
          const waveIntensity = (1 - age) * 0.6
          const wavePhase = ((distanceFromRipple - rippleRadius + 30) / 30) * Math.PI * 2
          const waveAmplitude = Math.sin(wavePhase) * 15 * waveIntensity
          totalOffset += waveAmplitude
        }
      })

      if (isHovering) {
        const distanceFromCursor = Math.sqrt(
          Math.pow(currentX - mousePosition.x, 2) + Math.pow(baseLineY - mousePosition.y, 2),
        )

        if (distanceFromCursor < 50) {
          const magneticForce = (50 - distanceFromCursor) / 50
          const direction = baseLineY < mousePosition.y ? -1 : 1
          totalOffset += direction * magneticForce * 20
        }
      }

      const nextX = Math.min(currentX + step, lineLength)
      path += ` L ${nextX} ${baseLineY + totalOffset}`
      currentX = nextX
    }

    return path
  }

  const getLineCount = () => {
    if (dimensions.width < 640) return 12
    if (dimensions.width < 1024) return 16
    return 20
  }

  const lines = Array.from({ length: getLineCount() }, (_, i) => i)

  return (
    <header
      ref={containerRef}
      className="relative text-white overflow-hidden cursor-none bg-primary-dark"
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        {lines.map((lineIndex) => (
          <path
            key={`line-${lineIndex}`}
            d={generatePath(lineIndex, lines.length)}
            stroke="rgba(180, 220, 180, 0.9)"
            strokeWidth={isHovering ? "6" : "5"}
            fill="none"
            className="transition-all duration-100 ease-out"
          />
        ))}
      </svg>

      {isHovering && (
        <div
          className="absolute pointer-events-none transition-all duration-100 ease-out"
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "rgba(40, 40, 40, 0.9)",
            left: (mousePosition.x / dimensions.width) * 100 + "%",
            top: (mousePosition.y / dimensions.height) * 100 + "%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 20px rgba(40, 40, 40, 0.7)",
          }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="SSTRACK BLOGS Logo"
                width={55}
                height={55}
                className="mr-2 h-auto"
              />
            </Link>
          </div>

          <div className="flex space-x-4">
          <Link
            href="/create-category"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full hover:opacity-80 transition-colors cursor-pointer bg-primary-accent text-white border-2 border-primary-accent"
          >
            Create Category
          </Link>
            <Link
            href="/create-series"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full hover:opacity-80 transition-colors cursor-pointer bg-primary-accent text-white border-2 border-primary-accent"
          >
            Create Series
          </Link>
            <Link
              href="/manage-posts/new"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full hover:opacity-80 transition-colors cursor-pointer bg-primary-accent text-white border-2 border-primary-accent"
            >
              Create Post
            </Link>
            <Link
              href="/manage-posts"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full hover:opacity-80 transition-colors cursor-pointer bg-primary-accent text-white border-2 border-primary-accent"
            >
              Manage Posts
            </Link>
          </div>
        </div>

        <div className="text-center px-4 sm:px-6 md:px-8 pb-8 md:pb-12">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-thin tracking-tight leading-none text-primary-accent"
          >
            SSTRACK BLOGS
          </h1>
        </div>

        <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={onClearFilters}
              className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer border-2 border-primary-accent 
                ${!currentCategory && !currentTag ? 'bg-primary-accent text-white' : 'bg-transparent text-primary-accent'}`
              }
            >
              ALL
            </button>

            {categories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => onCategoryClick(category.name)}
                className={`px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer border-2 border-primary-accent
                  ${currentCategory === category.name ? 'bg-primary-accent text-white' : 'bg-transparent text-primary-accent'}`
                }
              >
                {category.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}