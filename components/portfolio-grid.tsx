"use client"

import Link from "next/link";
import { Post } from "@/lib/data-service";
import PostCard from "./post-card";

interface PortfolioGridProps {
  filteredPosts: Post[];
  getAuthorName: (authorId: string) => string;
  getCategoryName: (categoryId: string) => string;
  onCategoryClick: (category: string) => void;
  onTagClick: (tag: string) => void;
}

export function PortfolioGrid({
  filteredPosts,
  getAuthorName,
  getCategoryName,
  onCategoryClick,
  onTagClick,
}: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredPosts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          getAuthorName={getAuthorName}
          getCategoryName={getCategoryName}
          onCategoryClick={onCategoryClick}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}