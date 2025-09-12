export interface Post {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  category: string;
  status: "Published" | "Draft" | "Pending Approval";
  publishedAt: string;
}

// Sample data - in a real app, this comes from your database
const allPosts: Post[] = [
  { id: "1", title: "The Principles of Sustainable Design", authorName: "Jane Doe", authorId: "user-1", category: "Design", status: "Published", publishedAt: "2025-09-10" },
  { id: "2", title: "Mastering Color Theory in Branding", authorName: "John Smith", authorId: "user-2", category: "Creative", status: "Published", publishedAt: "2025-09-08" },
  { id: "3", title: "A Guide to User Experience Design", authorName: "Jane Doe", authorId: "user-1", category: "Guides", status: "Pending Approval", publishedAt: "-" },
  { id: "4", title: "Minimalism in Web Development", authorName: "Alex Ray", authorId: "user-3", category: "Development", status: "Draft", publishedAt: "-" },
];

// This function simulates fetching posts based on user role
export const getPostsForUser = async (role: string, userId: string): Promise<Post[]> => {
  if (role === "Admin" || role === "Editor") {
    return allPosts;
  }
  if (role === "Author/Writer") {
    return allPosts.filter(post => post.authorId === userId);
  }
  return [];
};