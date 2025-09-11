"use client"

import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/data-service";

interface PostCardProps {
  post: Post;
  getAuthorName: (authorId: string) => string;
  getCategoryName: (categoryId: string) => string;
  onCategoryClick: (category: string) => void;
  onTagClick: (tag: string) => void;
}

export default function PostCard({
  post,
  getAuthorName,
  getCategoryName,
  onCategoryClick,
  onTagClick,
}: PostCardProps) {
  const categoryName = getCategoryName(post.category);
  // Use imageUrl if it exists, otherwise fall back to the image array
  const imageSrc = post.imageUrl || (post.image && post.image[0]);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-blue-100 flex flex-col h-full">
      {/* Render the post image */}
      {imageSrc && (
        <div className="relative w-full h-48">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        {categoryName && categoryName !== "Uncategorized" && (
          <button
            onClick={() => onCategoryClick(categoryName)}
            className="text-xs font-semibold text-primary-accent uppercase tracking-wider mb-2 self-start"
          >
            {categoryName}
          </button>
        )}
        <h3 className="font-bold text-xl text-black mb-3">
          <Link href={`/post/${post._id}`}>{post.title}</Link>
        </h3>
        <p className="text-sm text-gray-600 flex-grow mb-4">
          {post.description}
        </p>
        <div className="mt-auto text-xs text-gray-500">
          <span>
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
          </span>
        </div>
      </div>
    </div>
  );
}