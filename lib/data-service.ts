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

// --- API Functions ---

// Fetches a single blog by ID
export const fetchSingleBlog = async (blogId: string): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getSingleBlog/${blogId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch blog with ID ${blogId}: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data; // Assuming the API returns the blog data in a 'data' field
};

// Fetches all blogs, authors, categories, and series
export const loadBlogData = async (): Promise<BlogData> => {
  try {
    // Fetch all blogs
    const blogsResponse = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getBlogs`);
    if (!blogsResponse.ok) throw new Error(`Failed to fetch blogs: ${blogsResponse.statusText}`);
    const blogsData = await blogsResponse.json();

    // Fetch all series
    const seriesResponse = await fetch(`${BASE_URL}/api/v1/superAdmin/series/getAllSeries`);
    if (!seriesResponse.ok) throw new Error(`Failed to fetch series: ${seriesResponse.statusText}`);
    const seriesData = await seriesResponse.json();

    // For authors and categories, we'll keep them as static mock data as per original file
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
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${BASE_URL}/api/v1/superAdmin/blogs/getBlogsBySeries/${seriesId}`);
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