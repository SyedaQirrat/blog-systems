import { Post, User, Category, Series, Comment } from "./types";

// Sample user data
const allUsers: User[] = [
  { id: "user-1", name: "Jane Doe", email: "jane.doe@example.com", role: "Author/Writer", posts: 2 },
  { id: "user-2", name: "John Smith", email: "john.smith@example.com", role: "Editor", posts: 1 },
  { id: "user-3", name: "Alex Ray", email: "alex.ray@example.com", role: "Admin", posts: 1 },
];

export const getUsers = async (): Promise<User[]> => {
  return allUsers;
};

export const inviteUser = async (email: string, role: string): Promise<User> => {
    console.log(`Pretending to send an invitation to ${email} for the role of ${role}.`);
    const newUser: User = {
        id: `user-${Math.floor(Math.random() * 1000)}`,
        name: "Invited User",
        email: email,
        role: role as "Admin" | "Editor" | "Author/Writer",
        posts: 0,
    };
    allUsers.push(newUser);
    return newUser;
};

// Sample category data
const allCategories: Category[] = [
  { categoryId: "1", name: "Guides" },
  { categoryId: "2", name: "Creative Content" },
  { categoryId: "3", name: "Updates" },
  { categoryId: "4", name: "Design" },
];

export const getCategories = async (): Promise<Category[]> => {
  return allCategories;
};

// Sample series data
const allSeries: Series[] = [
  { _id: "1", title: "Sustainable Design", description: "A 3-part series on eco-friendly design principles.", imageUrl: "", blogsId: [] },
  { _id: "2", title: "Branding 101", description: "Everything you need to know to get started.", imageUrl: "", blogsId: [] },
];

export const getSeries = async (): Promise<Series[]> => {
  return allSeries;
};

// CORRECTED: This array now includes the 'id' property
const allComments: Comment[] = [
  { id: "1", _id: "1", authorName: "Alice", authorEmail: "alice@example.com", content: "This was an incredibly insightful read. Thank you!", blogId: "1", createdAt: "2025-09-11" },
  { id: "2", _id: "2", authorName: "Bob", authorEmail: "bob@example.com", content: "Great article, but I have a question about the color palette choices.", blogId: "2", createdAt: "2025-09-10" },
];

export const getComments = async (): Promise<Comment[]> => {
  // This function now correctly returns data that matches the Comment type
  return allComments; 
};

// Corrected sample data with all required properties
const allPosts: Post[] = [
  { id: "1", _id: "1", title: "The Principles of Sustainable Design", authorName: "Jane Doe", authorId: "user-1", category: "Design", status: "Published", publishedAt: "2025-09-10", imageUrl: "/sustainable-design.png", image: ["/sustainable-design.png"], content: "<p>Content for sustainable design...</p>", description: "A look into sustainable design.", tags: "design, sustainable", seriesId: "1", allowComments: true },
  { id: "2", _id: "2", title: "Mastering Color Theory in Branding", authorName: "John Smith", authorId: "user-2", category: "Creative", status: "Published", publishedAt: "2025-09-08", imageUrl: "/color-theory-brand.png", image: ["/color-theory-brand.png"], content: "<p>Content for color theory...</p>", description: "Understanding color in branding.", tags: "color, branding", seriesId: "2", allowComments: true },
  { id: "3", _id: "3", title: "A Guide to User Experience Design", authorName: "Jane Doe", authorId: "user-1", category: "Guides", status: "Pending Approval", publishedAt: "-", imageUrl: "/user-experience-design.png", image: ["/user-experience-design.png"], content: "<p>Content for UX design...</p>", description: "A guide to UX.", tags: "ux, guide", seriesId: "1", allowComments: true },
  { id: "4", _id: "4", title: "Minimalism in Web Development", authorName: "Alex Ray", authorId: "user-3", category: "Development", status: "Draft", publishedAt: "-", imageUrl: "/minimalist-design-principles.png", image: ["/minimalist-design-principles.png"], content: "<p>Content for minimalism...</p>", description: "Less is more in code.", tags: "code, minimalism", seriesId: "none", allowComments: false },
];

export const getPostsForUser = async (role: string, userId: string): Promise<Post[]> => {
  if (role === "Admin" || role === "Editor") {
    return allPosts;
  }
  if (role === "Author/Writer") {
    return allPosts.filter(post => post.authorId === userId);
  }
  return [];
};

export const getPublishedPosts = async (): Promise<Post[]> => {
  return allPosts.filter(post => post.status === "Published");
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
    return allPosts.find(post => post.id === id);
};

export async function createSeries(name: string) {
  console.log(`Creating series: ${name}`);
}