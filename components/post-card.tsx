"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface Post {
  id: number
  title: string
  content: string
  image: string
  authorId: string
  categoryId: string
  tags: string[]
}

interface PostCardProps {
  post: Post
  getAuthorName: (authorId: string) => string
  getCategoryName: (categoryId: string) => string
  onCategoryClick: (categoryId: string) => void
  onTagClick: (tag: string) => void
}

export default function PostCard({ post, getAuthorName, getCategoryName, onCategoryClick, onTagClick }: PostCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const getFallbackImage = () => {
    const colors = ["f97316", "fbbf24", "10b981", "3b82f6", "8b5cf6", "ec4899"]
    const color = colors[post.id % colors.length]
    return `https://via.placeholder.com/800x400/${color}/ffffff?text=${encodeURIComponent(post.title)}`
  }

  return (
    <div className="break-inside-avoid mb-6">
      <div
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group p-0"
        style={{ border: "1.5px solid #E5E7EB" }}
      >
        {/* Header with image, overlay, and title */}
        <div className="relative w-full overflow-hidden rounded-t-lg">
          {post.image && (
            <Image
              src={imageError ? getFallbackImage() : post.image}
              alt={post.title}
              fill
              className="object-cover"
              onError={handleImageError}
            />
          )}
          <div className="absolute inset-0 bg-green-500 opacity-25"></div>
          <div className="relative z-10 flex items-end p-4 min-h-[100px]">
            <h2 className="text-xl font-bold tracking-wide leading-tight">
              <Link href={`/post/${post.id}`} className="text-white hover:text-[#7ACB59] transition-colors">
                {post.title}
              </Link>
            </h2>
          </div>
        </div>

        {/* Main content section */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-500">
            Category: <button onClick={() => onCategoryClick(post.categoryId)} className="underline font-bold text-black-600 hover:text-black transition-colors">{getCategoryName(post.categoryId)}</button>
          </div>
          <div className="text-sm text-gray-500">
            Author: {getAuthorName(post.authorId)}
          </div>
          <div className="text-gray-700 text-sm leading-relaxed">{post.content.substring(0, 150)}...</div>

          <div className="pt-4">
            <Link
              href={`/post/${post.id}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-black font-medium bg-white hover:bg-gray-100 transition rounded-md"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}