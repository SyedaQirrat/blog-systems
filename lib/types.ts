// This file is the single source of truth for all our data structures.

export interface Post {
  id: string;
  title: string;
  content: string;
  description: string;
  tags: string;
  seriesId: string;
  status: "Published" | "Draft" | "Pending Approval";
  publishedAt: string;
  imageUrl: string;
  category: string;
  allowComments: boolean;
  authorId: string;
  authorName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Author/Writer";
  posts: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  postCount: number;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  postCount: number;
}

// Add the missing Comment interface here
export interface Comment {
  id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  postTitle: string;
  postId: string;
  submittedAt: string;
  status: "Approved" | "Pending";
}