"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Post } from "@/lib/data-service"
import { Badge } from "@/components/ui/badge"

interface PostCardProps {
  post: Post
  getAuthorName: (authorId: string) => string
  getCategoryName: (categoryId: string) => string
  onCategoryClick: (category: string) => void
  onTagClick: (tag: string) => void
}

export default function PostCard({ post, getAuthorName, getCategoryName, onCategoryClick, onTagClick }: PostCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const getFallbackImage = () => {
    const colors = ["f97316", "fbbf24", "10b981", "3b82f6", "8b5cf6", "ec4899"]
    // Using a consistent value from post._id to generate a color
    const color = colors[post._id.charCodeAt(0) % colors.length]
    return `https://via.placeholder.com/800x400/${color}/ffffff?text=${encodeURIComponent(post.title)}`
  }
  
  const images = post.image || [];
  const firstImage = images.length > 0 ? images[0] : null;
  const tagsArray = typeof post.tags === 'string'
    ? post.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];

  const contentText = typeof post.content === 'string' ? 
    post.content.substring(0, 150) : 
    '';

  return (
    <div className="flex-1 min-h-[450px]">
      <div
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group p-0 h-full flex flex-col border border-gray-200"
      >
        {/* Header with image, overlay, and title */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {firstImage && (
            <Image
              src={imageError ? getFallbackImage() : firstImage}
              alt={post.title}
              fill
              className="object-cover"
              onError={handleImageError}
            />
          )}
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative z-10 flex items-end p-4 min-h-[100px]">
            <h2 className="text-xl font-bold tracking-wide leading-tight">
              <Link href={`/post/${post._id}`} className="text-white hover:text-[#7ACB59] transition-colors">
                {post.title}
              </Link>
            </h2>
          </div>
        </div>

        {/* Main content section */}
        <div className="p-6 space-y-4 flex flex-col flex-grow">
          <div className="text-sm text-gray-500">
            Category: <button onClick={() => onCategoryClick(post.category)} className="underline font-bold text-black-600 hover:text-black transition-colors">{post.category}</button>
          </div>
          <div className="text-black text-sm leading-relaxed">{contentText}...</div>
          
          <div className="flex flex-wrap gap-1 mt-auto">
            {tagsArray.map((tag, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => onTagClick(tag)}>
                {tag}
              </Badge>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            {!post.isPublished && (
              <Badge variant="destructive" className="mr-2">DRAFT</Badge>
            )}
            <Link
              href={`/post/${post._id}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-black font-medium bg-white hover:bg-gray-100 transition rounded-md ml-auto"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}