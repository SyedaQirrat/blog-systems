import type { Metadata } from 'next';
import { fetchSingleBlog } from "@/lib/data-service";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const post = await fetchSingleBlog(params.id);
  
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    return {
      title: post.title,
      description: post.description,
      keywords: typeof post.tags === 'string' ? post.tags.split(',').map(tag => tag.trim()) : [],
      openGraph: {
        title: post.title,
        description: post.description,
        images: post.image && post.image.length > 0 ? [{ url: post.image[0] }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Error',
      description: 'An unexpected error occurred while fetching the post.',
    };
  }
}