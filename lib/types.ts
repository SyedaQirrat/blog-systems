// This file is the single source of truth for our data structures.

export interface Post {
  id: string; // The primary identifier for a post.
  title: string;
  content: string; 
  description: string;
  tags: string;
  seriesId: string;
  status: "Published" | "Draft" | "Pending Approval";
  publishedAt: string;
  imageUrl: string; // The URL for the post's feature image.
  category: string;
  allowComments: boolean;
  authorId: string;
  authorName: string;
}

// Add other shared types like User, Category, etc. here in the future.
