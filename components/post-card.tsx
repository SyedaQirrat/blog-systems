import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/types"; // Import the unified Post type

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/post/${post.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={400}
            height={250}
            className="rounded-t-lg object-cover w-full aspect-[16/9]"
          />
        </CardHeader>
        <CardContent>
          <Badge>{post.category}</Badge>
          <CardTitle className="mt-2">{post.title}</CardTitle>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            By {post.authorName} on {post.publishedAt}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}