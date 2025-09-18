// This file is the single source of truth for all our data structures.

export interface Post {
  id: string; // Use 'id' consistently in the frontend
  _id: string; // Keep original '_id' from the API
  title: string;
  content: string;
  description: string;
  tags: string;
  seriesId: string;
  status: "Published" | "Draft" | "Pending Approval";
  isPublished?: boolean;
  publishedAt: string;
  imageUrl?: string;
  image: string[];
  category: string;
  allowComments: boolean;
  authorId: string;
  authorName: string;
  file?: File | null;
}

export interface Author {
  authorId: string;
  name: string;
}

export interface Category {
  categoryId: string;
  name: string;
}

export interface Series {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  blogsId: string[];
}

export interface BlogData {
  posts: Post[];
  authors: Author[];
  categories: Category[];
  series: Series[];
}

export interface Comment {
  _id: string;
  blogId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}