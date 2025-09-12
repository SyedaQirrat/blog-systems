import Image from "next/image";
import { getPostById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import CommentSection from "@/components/comment-section";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(params.id);

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
      
      <Image
        src={post.featureImage}
        alt={post.title}
        width={800}
        height={400}
        className="rounded-lg object-cover w-full mb-8"
      />
      
      {/* This renders the HTML content from the CKEditor.
        In a real app, you MUST sanitize this HTML to prevent XSS attacks.
      */}
      <div 
        className="prose max-w-none" 
        dangerouslySetInnerHTML={{ __html: "Post content from CKEditor will go here. The real content is not yet saved in our mock data." }} 
      />

      <hr className="my-12" />

      <CommentSection />
    </article>
  );
}