import { Button } from "@/components/ui/button";
import { getMockUser } from "@/lib/auth";
import { getPostsForUser } from "@/lib/data";
import { PostsTable } from "@/components/posts-table";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default async function ManagePostsPage() {
  const user = await getMockUser();
  // We'll pass a dummy userId for the author role for now
  const posts = await getPostsForUser(user.role, "user-1");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {user.role === 'Author/Writer' ? 'My Posts' : 'Manage Posts'}
        </h1>
        <Link href="/manage-posts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border shadow-sm">
         <PostsTable posts={posts} />
      </div>
    </div>
  );
}