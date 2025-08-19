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
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzlhMjljY2NkZmI5NTY2OTcxYTY2ZTMiLCJ0aW1lem9uZSI6IkFzaWEvS2FyYWNoaSIsImVtYWlsIjoiY29udGFjdEBpOGlzLmNvbSIsIm5hbWUiOiJLYW1yYW4gVGFyaXEiLCJ1c2VyVHlwZSI6Im93bmVyIiwiY29tcGFueSI6Imk4aXMuY29tIiwidGltZXpvbmVPZmZzZXQiOiI1IiwiY29tcGFueUlkIjoiNjc5YTI5ZjVjZGZiOTU2Njk3MWE2NmU4IiwiaXNTcGxhc2hTY3JlZW4iOnRydWUsImlhdCI6MTc1NDkyNDgxMCwiZXhwIjoxNzg2NDYwODEwfQ.Yk3-xh_4JxH2UFEH-A46ScLaSSkaM-0P02qX0gh7Dcs'; 

const API_HEADERS = {
  'Content-Type': 'application/json',
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
    if (!blogsResponse.ok) throw new Error(`Failed to fetch blogs: ${blogsResponse.statusText}`);
    const blogsData = await blogsResponse.json();

    const seriesResponse = await fetch(`${BASE_URL}/api/v1/superAdmin/series/getAllSeries`, {
      headers: API_HEADERS,
    });
    if (!seriesResponse.ok) throw new Error(`Failed to fetch series: ${seriesResponse.statusText}`);
    const seriesData = await seriesResponse.json();

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

// Creates or updates a blog post via API
export const saveBlogData = async (postData: Partial<Post>) => {
  try {
    const isNewPost = !postData._id;
    const url = isNewPost
      ? `${BASE_URL}/api/v1/superAdmin/blogs/createBlog`
      : `${BASE_URL}/api/v1/superAdmin/blogs/updateBlog/${postData._id}`;

    const method = isNewPost ? 'POST' : 'PATCH';

    const response = await fetch(url, {
      method: method,
      headers: API_HEADERS,
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error saving data to API:", error);
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
      throw new Error(`Failed to delete blog: ${response.statusText}`);
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
      throw new Error(`Failed to publish blog: ${response.statusText}`);
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
      headers: API_HEADERS,
      body: JSON.stringify(seriesData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create series: ${response.statusText}`);
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
      throw new Error(`Failed to get blogs by series: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching blogs by series from API:", error);
    return [];
  }
};