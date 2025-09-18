import { BlogData, Post, Author, Category, Series } from "./types";

const BASE_URL = 'https://myuniversallanguages.com:9093';

// Helper to get headers with a dynamic token
const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
});

// Helper to create standardized post objects
const standardizePost = (post: any, authors: Author[]): Post => {
  const author = authors.find(a => a.authorId === post.authorId);
  return {
    ...post,
    id: post._id,
    authorName: author ? author.name : 'Unknown Author',
    status: post.isPublished ? 'Published' : 'Draft',
    // Ensure imageUrl is consistent
    imageUrl: post.image && post.image.length > 0 ? post.image[0] : '/placeholder.jpg',
    publishedAt: post.publishedAt || new Date().toISOString(),
  };
};

// --- PUBLIC-FACING FUNCTIONS ---

export const fetchSingleBlog = async (blogId: string): Promise<Post | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getSingleBlog/${blogId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch blog with ID ${blogId}: ${response.statusText}`);
    }
    const data = await response.json();
    const { authors } = await loadBlogData(); // Fetch authors to standardize post
    return standardizePost(data.data, authors);
  } catch (error) {
    console.error("Error fetching single blog:", error);
    return undefined;
  }
};

export const loadBlogData = async (): Promise<BlogData> => {
  try {
    // Mock data for authors and categories as it's not in the API response
    const authors: Author[] = [
        { "authorId": "1", "name": "Alice Smith" },
        { "authorId": "2", "name": "Bob Johnson" }
    ];
    const categories: Category[] = [
        { "categoryId": "tech", "name": "Technology" },
        { "categoryId": "productivity", "name": "Productivity" }
    ];
    
    const blogsResponse = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getBlogs`);
    if (!blogsResponse.ok) throw new Error(`Failed to fetch blogs: ${blogsResponse.statusText}`);
    const blogsData = await blogsResponse.json();

    // Standardize all posts by mapping _id to id and adding missing fields
    const standardizedPosts = blogsData.data.map((post: any) => standardizePost(post, authors));

    const seriesResponse = await fetch(`${BASE_URL}/api/v1/superAdmin/series/getAllSeries`);
    if (!seriesResponse.ok) throw new Error(`Failed to fetch series: ${seriesResponse.statusText}`);
    const seriesData = await seriesResponse.json();

    return {
      posts: standardizedPosts,
      series: seriesData.data,
      authors: authors,
      categories: categories,
    };
  } catch (error) {
    console.error("Error fetching data from live API:", error);
    throw error;
  }
};

export const getBlogsBySeries = async (seriesId: string): Promise<Post[]> => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getBlogsBySeries/${seriesId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to get blogs by series: ${response.statusText}, message: ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        const { authors } = await loadBlogData(); // Fetch authors to standardize post
        return data.data.map((post: any) => standardizePost(post, authors)); // Standardize posts in the series
    } catch (error) {
        console.error("Error fetching blogs by series from API:", error);
        return [];
    }
};

// --- ADMIN-ONLY (CRUD) OPERATIONS ---

export const createBlog = async (postData: any, token: string) => {
    try {
        const formData = new FormData();
        Object.keys(postData).forEach(key => {
            if (postData[key] !== null && postData[key] !== undefined) {
                formData.append(key, postData[key]);
            }
        });

        const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/createBlog`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed with status: ${response.status}, message: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating blog via API:", error);
        throw error;
    }
};

export const updateBlog = async (postData: Partial<Post>, token: string) => {
    try {
        const url = `${BASE_URL}/api/v1/superAdmin/blogs/updateBlogs/${postData._id}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token),
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API call failed: ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating blog via API:", error);
        throw error;
    }
};

export const deleteblogs = async (blogId: string, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/deleteBlog/${blogId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to delete blog: ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error deleting blog via API:", error);
        throw error;
    }
};

export const publishBlog = async (blogId: string, isPublished: boolean, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/publishBlog/${blogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token),
            },
            body: JSON.stringify({ isPublished }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to publish blog: ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error publishing blog via API:", error);
        throw error;
    }
};

export const createSeries = async (seriesData: {
    title: string;
    description: string;
    file?: File | null;
}, token: string) => {
    try {
        const formData = new FormData();
        formData.append('title', seriesData.title);
        formData.append('description', seriesData.description);
        if (seriesData.file) {
            formData.append('file', seriesData.file);
        }
        const response = await fetch(`${BASE_URL}/api/v1/superAdmin/series/createSeries`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create series: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating series via API:", error);
        throw error;
    }
};

// --- COMMENT-RELATED FUNCTIONS (PUBLIC) ---

export interface Comment {
  _id: string;
  blogId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

export const fetchCommentsForBlog = async (blogId: string): Promise<Comment[]> => {
  // This is a placeholder
  console.warn("fetchCommentsForBlog is not implemented.");
  return [];
};

export const createComment = async (commentData: Omit<Comment, "_id" | "createdAt">): Promise<Comment> => {
  // This is a placeholder
  console.warn("createComment is not implemented.");
  return { ...commentData, _id: `c${Date.now()}`, createdAt: new Date().toISOString() };
};