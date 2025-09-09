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

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-200 flex flex-col h-full">
      {post.image && post.image[0] && (
        <div className="relative w-full h-40">
          <Image
            src={post.image[0]}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        {categoryName && categoryName !== "Uncategorized" && (
          <button
            onClick={() => onCategoryClick(categoryName)}
            className="text-xs font-semibold text-primary-accent uppercase tracking-wider mb-2 self-start"
          >
            {categoryName}
          </button>
        )}
        <h3 className="font-bold text-lg text-black mb-2">
          <Link href={`/post/${post._id}`}>{post.title}</Link>
        </h3>
        <p className="text-sm text-gray-600 flex-grow mb-4">
          {post.description}
        </p>
        <div className="mt-auto">
          <span className="text-xs text-gray-500">
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
          </span>
        </div>
      </div>
    </div>
  );
}