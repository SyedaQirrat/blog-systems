// app/post/[id]/page.tsx
import Image from "next/image";
import { fetchSingleBlog } from "@/lib/data-service"; // <-- UPDATED IMPORT
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/comment-section";

// Define the interface for the page props
interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  // Use the function that fetches from the live API
  const post = await fetchSingleBlog(params.id);

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{post.title}</h1>
        <div className="text-sm text-muted-foreground">
          <span>By {post.authorName}</span> | <span>Published on {post.publishedAt}</span>
        </div>
        <Badge className="mt-2">{post.category}</Badge>
      </header>
      
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={800}
          height={400}
          className="rounded-lg object-cover w-full mb-8"
        />
      )}
      
      <div 
        className="prose prose-lg dark:prose-invert max-w-none" 
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      <hr className="my-8" />

      {/* Ensure postId is correctly passed to CommentSection */}
      <CommentSection postId={params.id} />
    </article>
  );
}