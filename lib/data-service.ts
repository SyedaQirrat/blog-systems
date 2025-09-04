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
// Corrected AUTH_TOKEN with standard "I"
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzlhMmRhOWFjOGQ5ZDY4MGNmMjhmZWUiLCJ0aW1lem9uZSI6IkFzaWEvS2FyYWNoaSIsImVtYWlsIjoibmFnaW5hQGk4aXMuY29tIiwibmFtZSI6Ik5hZ2luYSBBZnphbCIsInVzZXJUeXBlIjoiYWRtaW4iLCJjb21wYW55IjoiaThpcy5jb20iLCJ0aW1lem9uZU9mZnNldCI6NSwiY29tcGFueUlkIjoiNjc5YTI5ZjVjZGZiOTU2Njk3MWE2NmU4IiwiaXNTcGxhc2hTY3JlZW4iOnRydWUsImlhdCI6MTc1NTYwNjE4MSwiZXhwIjoxNzg3MTQyMTgxfQ.9sMx2WqXzeG3p26CT2SWw6LzxZez3hJUxiY5o21mmtA';

const API_HEADERS = {
  'Authorization': `Bearer ${AUTH_TOKEN}`,
};

// --- PUBLIC-FACING FUNCTIONS ---

// PUBLIC: Fetch a single blog post without authentication
export const fetchSingleBlog = async (blogId: string): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getSingleBlog/${blogId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch blog with ID ${blogId}: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
};

// PUBLIC: Load all blog data without authentication
export const loadBlogData = async (): Promise<BlogData> => {
  try {
    const blogsResponse = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getBlogs`);
    const blogsData = await blogsResponse.json();
    if (!blogsResponse.ok) throw new Error(`Failed to fetch blogs: ${blogsResponse.statusText}`);
    
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

// PUBLIC: Get blogs for a specific series without authentication
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

export const createBlog = async (postData: {
  title: string;
  content: string;
  description: string;
  tags: string;
  isPublished: boolean;
  seriesId?: string | null;
  file?: File | null;
  allowComments?: boolean;
}) => {
  try {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('description', postData.description);
    formData.append('tags', postData.tags);
    if (postData.seriesId) formData.append('seriesId', postData.seriesId);
    formData.append('isPublished', String(postData.isPublished));

    if (postData.file) formData.append('file', postData.file);
    if (postData.allowComments !== undefined) formData.append('allowComments', String(postData.allowComments));

    const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/createBlog`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
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
        ...API_HEADERS
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API call failed with status: ${response.status}, message: ${errorData.message || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating blog via API:", error);
    throw error;
  }
};

export const deleteBlog = async (blogId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/deleteBlog/${blogId}`, {
      method: 'DELETE',
      headers: API_HEADERS,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete blog: ${response.statusText}, message: ${errorData.message || response.statusText}`);
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
      headers: API_HEADERS,
      body: JSON.stringify({ isPublished }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to publish blog: ${response.statusText}, message: ${errorData.message || response.statusText}`);
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
  imageUrl?: string;
  blogsId: string[];
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
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create series: ${response.statusText}, message: ${errorText}`);
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

// PUBLIC: Fetch comments for a blog post without authentication
export const fetchCommentsForBlog = async (blogId: string): Promise<Comment[]> => {
  console.log(`Fetching comments for blog ID: ${blogId}`);
  // This is a placeholder and should be replaced with a real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { _id: "c1", blogId, authorName: "John Doe", authorEmail: "john@example.com", content: "Great post!", createdAt: new Date().toISOString() },
        { _id: "c2", blogId, authorName: "Jane Smith", authorEmail: "jane@example.com", content: "Very insightful, thanks!", createdAt: new Date(Date.now() - 3600000).toISOString() },
      ]);
    }, 500);
  });
};

// PUBLIC: Create a comment without authentication
export const createComment = async (commentData: Omit<Comment, "_id" | "createdAt">): Promise<Comment> => {
  console.log("Creating comment:", commentData);
  // This is a placeholder and should be replaced with a real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...commentData, _id: `c${Date.now()}`, createdAt: new Date().toISOString() });
    }, 500);
  });
};

