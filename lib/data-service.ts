interface PostContent {
  type: "text" | "image";
  value: string;
}

interface Post {
  id: number
  title: string
  content: string // Changed to store HTML string
  image: string[] | string
  authorId: string
  categoryId: string
  tags: string[]
  isPublished?: boolean
  publishedDate?: string
  parentId?: number | null
}

interface Author {
  authorId: string
  name: string
}

interface Category {
  categoryId: string
  name: string
}

export interface BlogData {
  posts: Post[]
  authors: Author[]
  categories: Category[]
}

export const loadBlogData = async (): Promise<BlogData> => {
  const storedData = localStorage.getItem("blogData")
  if (storedData) {
    return JSON.parse(storedData)
  }

  const response = await fetch("/data.json")
  const data = await response.json()

  localStorage.setItem("blogData", JSON.stringify(data))
  return data
}

export const saveBlogData = (data: BlogData) => {
  localStorage.setItem("blogData", JSON.stringify(data))
}