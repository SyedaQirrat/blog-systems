import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/post/${post.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardHeader className="p-0">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={400}
            height={250}
            className="rounded-t-lg object-cover w-full aspect-[16/9]"
          />
        </CardHeader>
        <CardContent className="flex-1 pt-4">
          <Badge>{post.category}</Badge>
          <CardTitle className="mt-2 text-lg">{post.title}</CardTitle>
        </CardContent>
        <CardFooter className="flex items-center gap-2 pt-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt={post.authorName} />
            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.authorName}</p>
            <p className="text-xs text-muted-foreground">{post.publishedAt}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}