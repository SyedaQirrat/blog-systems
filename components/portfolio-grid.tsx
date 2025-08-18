"use client"

interface Post {
  id: number
  title: string
  content: string // Changed to store HTML string
  image: string[] | string
  authorId: string
  categoryId: string
  tags: string[]
  isPublished?: boolean
  publishedDate?: string
  parentId?: number | null
}
interface Author {
  authorId: string
  name: string
}

interface Category {
  categoryId: string
  name: string
}

interface PortfolioGridProps {
  filteredPosts: Post[]
  authors: Author[]
  categories: Category[]
  getAuthorName: (authorId: string) => string
  getCategoryName: (categoryId: string) => string
  onCategoryClick: (categoryId: string) => void
  onTagClick: (tag: string) => void
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
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col"
              style={{ color: "#000" }}
            >
              <h2 className="font-bold text-lg mb-2 text-black">{post.title}</h2>
              <div className="mb-1 text-sm text-black">
                Category: <span className="underline text-black">{getCategoryName(post.categoryId)}</span>
              </div>
              <div className="mb-1 text-sm text-black">Author: {getAuthorName(post.authorId)}</div>
              <p className="text-sm mb-4 text-black">{post.content.slice(0, 120)}...</p>
              <button className="mt-auto px-4 py-2 border border-gray-300 rounded text-black font-medium bg-white hover:bg-gray-100 transition">
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
