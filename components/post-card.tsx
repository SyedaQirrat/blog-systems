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
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group p-6"
        style={{ border: "1.5px solid #E5E7EB" }}
      >
        {/* Content Block */}
        <div className="space-y-4">
          {/* Title */}
          <h2 className="text-xl font-bold tracking-wide leading-tight text-black">
            <Link href={`/post/${post.id}`} className="hover:text-green-600 transition-colors">
              {post.title}
            </Link>
          </h2>
          
          {/* Category */}
          <div className="text-sm text-gray-500">
            Category: <button onClick={() => onCategoryClick(post.categoryId)} className="underline text-black-600 hover:text-black transition-colors">{getCategoryName(post.categoryId)}</button>
          </div>

          {/* Author */}
          <div className="text-sm text-gray-500">
            Author: {getAuthorName(post.authorId)}
          </div>

          {/* Content Preview */}
          <div className="text-gray-700 text-sm leading-relaxed">{post.content.substring(0, 150)}...</div>

          {/* Read More button */}
          <div className="pt-4">
            <Link
              href={`/post/${post.id}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-black font-medium bg-white hover:bg-gray-100 transition rounded-md"
            >
              Read More
            </Link>
          </div>

          {/* Tags - removed as per new design */}
        </div>
      </div>
    </div>
  )
}