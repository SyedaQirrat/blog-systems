// lib/data-service.ts

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
  category: string; // Changed from categoryId
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

// --- API Configuration ---
const BASE_URL = 'https://myuniversallanguages.com:9093';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzlhMmRhOWFjOGQ5ZDY4MGNmMjhmZWUiLCJ0aW1lem9uZSI6IkFzaWEvS2FyYWNoaSIsImVtYWlsIjoibmFnaW5hQGk4aXMuY29tIiwibmFtZSI6Ik5hZ2luYSBBZnphbCIsInVzZXJUeXBlIjoiYWRtaW4iLCJjb21wYW55IjoiaThpcy5jb20iLCJ0aW1lem9uZU9mZnNldCI6NSwiY29tcGFueUlkIjoiNjc5YTI5ZjVjZGZiOTU2Njk3MWE2NmU4IiwiaXNTcGxhc2hTY3JlZW4iOnRydWUsImlhdCI6MTc1NTYwNjE4MSwiZXhwIjoxNzg3MTQyMTgxfQ.9sMx2WqXzeG3p26CT2SWw6LzxZez3hJUxiY5o21mmtA';

const API_HEADERS = {
  'Authorization': `Bearer ${AUTH_TOKEN}`,
};

// --- API Functions ---

// Fetches a single blog by ID
export const fetchSingleBlog = async (blogId: string): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getSingleBlog/${blogId}`, {
    headers: API_HEADERS,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch blog with ID ${blogId}: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
};

// Fetches all blogs, authors, categories, and series
export const loadBlogData = async (): Promise<BlogData> => {
  try {
    const blogsResponse = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getBlogs`, {
      headers: API_HEADERS,
    });
    const blogsData = await blogsResponse.json();
    if (!blogsResponse.ok) throw new Error(`Failed to fetch blogs: ${blogsResponse.statusText}`);
    
    console.log("Fetched blogs:", blogsData);

    const seriesResponse = await fetch(`${BASE_URL}/api/v1/superAdmin/series/getAllSeries`, {
      headers: API_HEADERS,
    });
    if (!seriesResponse.ok) throw new Error(`Failed to fetch series: ${seriesResponse.statusText}`);
    const seriesData = await seriesResponse.json();
    console.log("Fetched series:", seriesData);

    // For authors and categories, we'll keep them as static mock data
    const authors = [
      { "authorId": "1", "name": "Alice Smith" },
      { "authorId": "2", "name": "Bob Johnson" }
    ];
    const categories = [
      { "categoryId": "tech", "name": "Technology" },
      { "categoryId": "productivity", "name": "Producitivity" }
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

// Creates a new blog post via API using FormData
export const createBlog = async (postData: {
  title: string;
  content: string;
  description: string;
  tags: string;
  isPublished: boolean;
  seriesId?: string | null;
}) => {
  try {
    const payload = {
      title: postData.title,
      content: postData.content,
      description: postData.description,
      tags: postData.tags,
      seriesId: postData.seriesId || null,
      isPublished: String(postData.isPublished), // must be "true"/"false"
    };

    const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/createBlog`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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


// Updates an existing blog post via API using JSON
export const updateBlog = async (postData: Partial<Post>) => {
  try {
    const url = `${BASE_URL}/api/v1/superAdmin/blogs/updateBlog/${postData._id}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API call failed with status: ${response.status}, message: ${errorData.message || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating blog via API:", error);
    throw error;
  }
};


// Deletes a blog post via API
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

// Publishes a blog via API
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

// Creates a new series via API
export const createSeries = async (seriesData: { title: string; description: string; imageUrl: string; blogsId: string[] }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/superAdmin/series/createSeries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(seriesData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create series: ${response.statusText}, message: ${errorData.message || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating series via API:", error);
    throw error;
  }
};

// Gets blogs by series ID via API
export const getBlogsBySeries = async (seriesId: string): Promise<Post[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getBlogsBySeries/${seriesId}`, {
      headers: API_HEADERS,
    });
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