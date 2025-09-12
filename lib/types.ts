// This file will hold all our common data structures.

export interface Post {
  id: string; // Using simple 'id' for consistency
  title: string;
  content: string;
  description: string;
  tags: string;
  seriesId: string;
  status: "Published" | "Draft" | "Pending Approval";
  publishedAt: string;
  imageUrl: string; // Unified image property
  category: string;
  allowComments: boolean;
  authorId: string;
  authorName: string;
}

// You can add other types like User, Category, etc., here as well.