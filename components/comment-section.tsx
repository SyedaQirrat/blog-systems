"use client";

import React, { useState, useEffect } from "react";
import IndividualComment from "./individual-comment";
import { CommentForm } from "./comment-form";
import { Comment } from "@/lib/types"; // Corrected import from lib/types

interface CommentSectionProps {
  blogId: string;
}

// Mock function
const fetchCommentsForBlog = async (blogId: string): Promise<Comment[]> => {
    console.log(`Fetching comments for blog ID: ${blogId}`);
    return [
        { id: "1", authorName: "Alice", authorEmail: "alice@example.com", content: "This was an incredibly insightful read. Thank you!", postTitle: "Mock Post", postId: blogId, submittedAt: "2025-09-11", status: "Approved" },
        { id: "3", authorName: "Charlie", authorEmail: "charlie@example.com", content: "Looking forward to part 2 of this series!", postTitle: "Mock Post", postId: blogId, submittedAt: "2025-09-09", status: "Approved" },
    ];
};

export function CommentSection({ blogId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const loadComments = async () => {
            const fetchedComments = await fetchCommentsForBlog(blogId);
            setComments(fetchedComments);
        };
        loadComments();
    }, [blogId]);

    const handleCommentSubmit = (commentData: { authorName: string; authorEmail: string; content: string }) => {
        console.log("New comment submitted:", commentData);
        const newComment: Comment = {
            id: Math.random().toString(),
            postId: blogId,
            postTitle: "Mock Post", // In a real app, you might pass the title down or fetch it
            submittedAt: new Date().toISOString(),
            status: "Pending", // New comments are pending approval
            ...commentData
        };
        setComments(prevComments => [newComment, ...prevComments]);
    };

    return (
        <section className="py-8">
            <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
            <div className="space-y-6">
                {comments.map(comment => (
                    <IndividualComment key={comment.id} comment={comment} />
                ))}
            </div>
            <hr className="my-8" />
            <CommentForm 
                blogId={blogId}
                onSubmitComment={handleCommentSubmit}
                loading={loading}
            />
        </section>
    );
};