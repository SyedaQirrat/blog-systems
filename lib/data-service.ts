export interface Post {
  _id: string;
  title: string;
  content: string;
  description: string;
  tags: string;
  seriesId: string | null;
  isPublished?: boolean;
  publishedDate?: string;
  image: string[];
  category: string;
  file?: File | null;
  allowComments?: boolean;
  authorId?: string;
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

const BASE_URL = 'https://myuniversallanguages.com:9093';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGFjOGNjYTVjNDlmMjM5ODJkZjAyY2EiLCJ0aW1lem9uZSI6IkFzaWEvS2FyYWNoaSIsImVtYWlsIjoic3llZGFxaXJyYXRmYXRpbWFAZ21haWwuY29tIiwibmFtZSI6IlN5ZWRhIFFpcnJhdCBGYXRpbWEgWmFpZGkiLCJ1c2VyVHlwZSI6ImFkbWluIiwiY29tcGFueSI6Imk4aXMuY29tIiwidGltZXpvbmVPZmZzZXQiOiI1IiwiY29tcGFueUlkIjoiNjc5YTI5ZjVjZGZiOTU2Njk3MWE2NmU4IiwicGFzc3dvcmQiOiIkMmEkMTIkUC5LUWlPdHNrZEYwSlNQMFVuRWZZdWVuemIuNW5rVGlEd3JET1l2NnhsclYySUd2N2RLdy4iLCJpczJGQUVuYWJsZWQiOmZhbHNlLCJpYXQiOjE3NTY5ODU3NjUsImV4cCI6MTc1NzAxNDU2NX0.Hr3wQzvOihT4eUIuMfj2Yl664_KHs4jw5TrDAZiskM8';

const API_HEADERS = {
  'Authorization': `Bearer ${AUTH_TOKEN}`,
};


// --- PUBLIC-FACING FUNCTIONS ---

export const fetchSingleBlog = async (blogId: string): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getSingleBlog/${blogId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch blog with ID ${blogId}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
};

export const loadBlogData = async (): Promise<BlogData> => {
    try {
        const blogsResponse = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getBlogs`);
        if (!blogsResponse.ok) throw new Error(`Failed to fetch blogs: ${blogsResponse.statusText}`);
        const blogsData = await blogsResponse.json();

        const seriesResponse = await fetch(`${BASE_URL}/api/v1/superAdmin/series/getAllSeries`);
        if (!seriesResponse.ok) throw new Error(`Failed to fetch series: ${seriesResponse.statusText}`);
        const seriesData = await seriesResponse.json();

        const authors = [
            { "authorId": "1", "name": "Alice Smith" },
            { "authorId": "2", "name": "Bob Johnson" }
        ];
        const categories = [
            { "categoryId": "tech", "name": "Technology" },
            { "categoryId": "productivity", "name": "Productivity" }
        ];

        return {
            posts: blogsData.data,
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
        return data.data;
    } catch (error) {
        console.error("Error fetching blogs by series from API:", error);
        return [];
    }
};

// --- ADMIN-ONLY (CRUD) OPERATIONS ---

export const createBlog = async (postData: any) => {
    try {
        const formData = new FormData();
        Object.keys(postData).forEach(key => {
            if (postData[key] !== null && postData[key] !== undefined) {
                 formData.append(key, postData[key]);
            }
        });

        const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/createBlog`, {
            method: 'POST',
            headers: API_HEADERS,
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

export const updateBlog = async (postData: Partial<Post>) => {
    try {
        const url = `${BASE_URL}/api/v1/superAdmin/blogs/updateBlogs/${postData._id}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...API_HEADERS,
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

export const deleteblogs = async (blogId: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/deleteBlog/${blogId}`, {
            method: 'DELETE',
            headers: API_HEADERS,
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

export const publishBlog = async (blogId: string, isPublished: boolean) => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/publishBlog/${blogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                 ...API_HEADERS,
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
}) => {
    try {
        const formData = new FormData();
        formData.append('title', seriesData.title);
        formData.append('description', seriesData.description);
        if (seriesData.file) {
            formData.append('file', seriesData.file);
        }
        const response = await fetch(`${BASE_URL}/api/v1/superAdmin/series/createSeries`, {
            method: 'POST',
            headers: API_HEADERS,
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
    return [];
};

export const createComment = async (commentData: Omit<Comment, "_id" | "createdAt">): Promise<Comment> => {
    // This is a placeholder
    return { ...commentData, _id: `c${Date.now()}`, createdAt: new Date().toISOString() };
};