"use client"

import Link from "next/link";
import { Post, Author, Category } from "@/lib/data-service";

interface PortfolioGridProps {
  filteredPosts: Post[];
  authors: Author[];
  categories: Category[];
  getAuthorName: (authorId: string) => string;
  getCategoryName: (categoryId: string) => string;
  onCategoryClick: (category: string) => void;
  onTagClick: (tag: string) => void;
}

export function PortfolioGrid({
  filteredPosts,
  authors,
  categories,
  getAuthorName,
  getCategoryName,
  onCategoryClick,
  onTagClick,
}: PortfolioGridProps) {
  return (
    <section className="py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col"
            >
              <h2 className="font-bold text-lg mb-2 text-black">{post.title}</h2>
              <div className="mb-1 text-sm text-black">
                Category:{" "}
                <button
                  onClick={() => onCategoryClick(post.category)}
                  className="underline text-black hover:text-gray-600"
                >
                  {post.category}
                </button>
              </div>
              <div className="mb-1 text-sm text-black">Tags:</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {typeof post.tags === 'string'
                  ? post.tags.split(",").map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => onTagClick(tag.trim())}
                        className="text-xs px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                      >
                        {tag.trim()}
                      </button>
                    ))
                  : null}
              </div>
              <p className="text-sm mb-4 text-black">{post.content?.slice(0, 120)}...</p>
              <Link
                href={`/post/${post._id}`}
                className="mt-auto px-4 py-2 border border-gray-300 rounded text-black font-medium bg-white hover:bg-gray-100 transition"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}