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
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
        style={{ border: "1.5px solid #000000" }}
      >
        {/* Post Image */}
        {post.image && (
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={imageError ? getFallbackImage() : post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          </div>
        )}

        {/* Content Block */}
        <div className="p-6 space-y-4">
          {/* Meta Information - changed from text-gray-500 to text-black */}
          <div className="text-sm text-black font-light">
            {new Date().toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>

          {/* Title - changed from text-black-xl to text-xl and ensured black color */}
          <h2 className="text-xl font-bold uppercase tracking-wide leading-tight text-black">
            <Link href={`/post/${post.id}`} className="hover:text-green transition-colors">
              {post.title}
            </Link>
          </h2>

          {/* Author and Category - changed from text-gray-600 to text-black */}
          <div className="flex items-center gap-2 text-sm text-black">
            <span>by {getAuthorName(post.authorId)}</span>
            <span>•</span>
            <button onClick={() => onCategoryClick(post.categoryId)} className="hover:text-black-600 transition-colors">
              {getCategoryName(post.categoryId)}
            </button>
          </div>

          {/* Content Preview - changed from text-gray-700 to text-black */}
          <div className="text-black text-sm leading-relaxed">{post.content.substring(0, 150)}...</div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                style={{
                  border: "1.5px solid #000000",
                  backgroundColor: "white",
                  color: "#000000",
                  borderRadius: "999px",
                  padding: "0.25rem 0.75rem",
                  marginRight: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                className="transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
