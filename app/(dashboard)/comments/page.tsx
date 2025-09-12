import { getComments } from "@/lib/data";
import { CommentsTable } from "./comments-table";

export default async function CommentsPage() {
  const comments = await getComments();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Manage Comments</h1>
      </div>
      <div className="rounded-lg border shadow-sm">
        <CommentsTable comments={comments} />
      </div>
    </div>
  );
}