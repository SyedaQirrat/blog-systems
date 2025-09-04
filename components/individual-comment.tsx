import React from "react";
import { Comment } from "@/lib/data-service";
import { formatDistanceToNowStrict } from "date-fns"; // You might need to install date-fns: npm install date-fns

interface IndividualCommentProps {
  comment: Comment;
  onReply?: (commentId: string) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
  // Add userId or auth context to determine if edit/delete buttons should show
}

export function IndividualComment({ comment, onReply, onEdit, onDelete }: IndividualCommentProps) {
  const timeAgo = comment.createdAt ? formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true }) : "just now";

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
          {comment.authorName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{comment.authorName}</p>
          <p className="text-xs text-gray-500">{timeAgo}</p>
        </div>
      </div>
      <p className="text-gray-800 leading-relaxed">{comment.content}</p>
      <div className="flex space-x-2 mt-3 text-sm">
        {onReply && (
          <button onClick={() => onReply(comment._id)} className="text-[#7ACB59] hover:underline">
            Reply
          </button>
        )}
        {onEdit && ( // You'd add logic here to only show for the author
          <button onClick={() => onEdit(comment)} className="text-blue-600 hover:underline">
            Edit
          </button>
        )}
        {onDelete && ( // You'd add logic here to only show for the author/admin
          <button onClick={() => onDelete(comment._id)} className="text-red-600 hover:underline">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}