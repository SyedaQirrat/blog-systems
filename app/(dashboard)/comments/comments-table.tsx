"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Comment } from "@/lib/data";
import Link from "next/link";
import { Check, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface CommentsTableProps {
  comments: Comment[];
}

export function CommentsTable({ comments: initialComments }: CommentsTableProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleApprove = (commentId: string) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, status: "Approved" } : c
    ));
    // In a real app, you would also call an API to update the status
    console.log(`Approving comment ${commentId}`);
  };

  const handleDelete = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
    // In a real app, you would also call an API to delete the comment
    console.log(`Deleting comment ${commentId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Author</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead>In Response To</TableHead>
          <TableHead>Submitted On</TableHead>
          <TableHead><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comments.map((comment) => (
          <TableRow key={comment.id}>
            <TableCell className="font-medium">
                <div>{comment.authorName}</div>
                <div className="text-sm text-muted-foreground">{comment.authorEmail}</div>
            </TableCell>
            <TableCell>{comment.content}</TableCell>
            <TableCell>
              <Link href={`/post/${comment.postId}`} className="hover:underline">
                {comment.postTitle}
              </Link>
            </TableCell>
            <TableCell>{comment.submittedAt}</TableCell>
            <TableCell>
                {comment.status === 'Pending' && (
                    <Button variant="outline" size="sm" onClick={() => handleApprove(comment.id)}>
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                    </Button>
                )}
                 <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleDelete(comment.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}