import React, { useState, useEffect } from "react";
import { Comment, fetchCommentsForBlog, createComment } from "@/lib/data-service";
import { IndividualComment } from "./individual-comment";
import { CommentForm } from "./comment-form";

interface CommentSectionProps {
  blogId: string;
}

export function CommentSection({ blogId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      setLoadingComments(true);
      try {
        const fetchedComments = await fetchCommentsForBlog(blogId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };
    loadComments();
  }, [blogId]);

  const handleSubmitNewComment = async (newCommentData: Omit<Comment, "_id" | "createdAt">) => {
    setSubmittingComment(true);
    try {
      const createdComment = await createComment(newCommentData);
      setComments((prevComments) => [createdComment, ...prevComments]); // Add new comment to top
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Comments</h2>
      
      {loadingComments ? (
        <div className="text-center text-gray-600">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-600">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <IndividualComment key={comment._id} comment={comment} />
          ))}
        </div>
      )}

      <CommentForm blogId={blogId} onSubmitComment={handleSubmitNewComment} loading={submittingComment} />
    </div>
  );
}