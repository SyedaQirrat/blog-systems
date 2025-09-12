import PostCard from "@/components/post-card"; // Correct: Default import
import { getPublishedPosts } from "@/lib/data";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">The SSTRACK Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}