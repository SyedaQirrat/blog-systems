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


export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Author/Writer";
  posts: number; // A count of posts they've created
}

// Sample user data
const allUsers: User[] = [
  { id: "user-1", name: "Jane Doe", email: "jane.doe@example.com", role: "Author/Writer", posts: 2 },
  { id: "user-2", name: "John Smith", email: "john.smith@example.com", role: "Editor", posts: 1 },
  { id: "user-3", name: "Alex Ray", email: "alex.ray@example.com", role: "Admin", posts: 1 },
];

export const getUsers = async (): Promise<User[]> => {
  // In a real app, you'd fetch this from your database
  return allUsers;
};

// Mock function to simulate sending an invitation
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

export interface Category {
  id: string;
  name: string;
  description: string;
  postCount: number;
}

// Sample category data
const allCategories: Category[] = [
  { id: "1", name: "Guides", description: "In-depth tutorials and walkthroughs.", postCount: 1 },
  { id: "2", name: "Creative Content", description: "Design inspiration and creative ideas.", postCount: 1 },
  { id: "3", name: "Updates", description: "News and updates about our platform.", postCount: 0 },
  { id: "4", name: "Design", description: "Articles related to visual and UX design.", postCount: 1 },
];

export const getCategories = async (): Promise<Category[]> => {
  return allCategories;
};

export const createCategory = async (categoryData: { name: string, description: string }): Promise<Category> => {
    console.log(`Creating category: ${categoryData.name}`);
    const newCategory: Category = {
        id: `cat-${Math.floor(Math.random() * 1000)}`,
        name: categoryData.name,
        description: categoryData.description,
        postCount: 0,
    };
    allCategories.push(newCategory);
    return newCategory;
};
export interface Series {
  id: string;
  title: string;
  description: string;
  postCount: number;
}

// Sample series data
const allSeries: Series[] = [
  { id: "1", title: "Sustainable Design", description: "A 3-part series on eco-friendly design principles.", postCount: 2 },
  { id: "2", title: "Branding 101", description: "Everything you need to know to get started.", postCount: 1 },
];

export const getSeries = async (): Promise<Series[]> => {
  return allSeries;
};

export const createSeries = async (seriesData: { title: string, description: string }): Promise<Series> => {
    console.log(`Creating series: ${seriesData.title}`);
    const newSeries: Series = {
        id: `series-${Math.floor(Math.random() * 1000)}`,
        title: seriesData.title,
        description: seriesData.description,
        postCount: 0,
    };
    allSeries.push(newSeries);
    return newSeries;
};
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

// Sample comment data
const allComments: Comment[] = [
  { id: "1", authorName: "Alice", authorEmail: "alice@example.com", content: "This was an incredibly insightful read. Thank you!", postTitle: "The Principles of Sustainable Design", postId: "1", submittedAt: "2025-09-11", status: "Approved" },
  { id: "2", authorName: "Bob", authorEmail: "bob@example.com", content: "Great article, but I have a question about the color palette choices.", postTitle: "Mastering Color Theory in Branding", postId: "2", submittedAt: "2025-09-10", status: "Pending" },
  { id: "3", authorName: "Charlie", authorEmail: "charlie@example.com", content: "Looking forward to part 2 of this series!", postTitle: "A Guide to User Experience Design", postId: "3", submittedAt: "2025-09-09", status: "Approved" },
  { id: "4", authorName: "David", authorEmail: "david@example.com", content: "This is spam.", postTitle: "Mastering Color Theory in Branding", postId: "2", submittedAt: "2025-09-12", status: "Pending" },
];

export const getComments = async (): Promise<Comment[]> => {
  return allComments;
};
export interface Post {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  category: string;
  status: "Published" | "Draft" | "Pending Approval";
  publishedAt: string;
  featureImage: string; // 1. Add this property
}

// 2. Update the sample data with image URLs
const allPosts: Post[] = [
  { id: "1", title: "The Principles of Sustainable Design", authorName: "Jane Doe", authorId: "user-1", category: "Design", status: "Published", publishedAt: "2025-09-10", featureImage: "/sustainable-design.png" },
  { id: "2", title: "Mastering Color Theory in Branding", authorName: "John Smith", authorId: "user-2", category: "Creative", status: "Published", publishedAt: "2025-09-08", featureImage: "/color-theory-brand.png" },
  { id: "3", title: "A Guide to User Experience Design", authorName: "Jane Doe", authorId: "user-1", category: "Guides", status: "Pending Approval", publishedAt: "-", featureImage: "/user-experience-design.png" },
  { id: "4", title: "Minimalism in Web Development", authorName: "Alex Ray", authorId: "user-3", category: "Development", status: "Draft", publishedAt: "-", featureImage: "/minimalist-design-principles.png" },
];

// Add a new function to get only published posts
export const getPublishedPosts = async (): Promise<Post[]> => {
  return allPosts.filter(post => post.status === "Published");
};

// Add a new function to get a single post by its ID
export const getPostById = async (id: string): Promise<Post | undefined> => {
    return allPosts.find(post => post.id === id);
};

// ... keep the rest of the file the same