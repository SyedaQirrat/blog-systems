import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostForm } from "./post-form";

export default function NewPostPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
        <CardDescription>
          Fill out the details below to create a new blog post.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PostForm />
      </CardContent>
    </Card>
  );
}