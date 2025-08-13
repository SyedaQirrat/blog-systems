# SSTRACKBlog System

A clean, typography-driven blog application built with Next.js, featuring a minimalist design inspired by modern content-focused websites. The application emphasizes readability, simplicity, and an elegant user experience across all devices.

## Features

### Core Functionality
- **Blog Homepage**: Clean, single-column list of all blog posts with filtering capabilities
- **Single Post View**: Distraction-free reading experience with full post content
- **Category & Tag Filtering**: Filter posts by categories and tags with URL-based state management
- **Post Management**: Create and edit posts with a clean, intuitive form interface
- **Responsive Design**: Fully responsive layout optimized for all screen sizes

### Design Highlights
- **Typography-Driven**: Large, elegant typography as the primary design element
- **Minimalist Color Scheme**: Clean white background with #aab8f7 accent color and black text
- **Masonry Grid Layout**: Pinterest-style three-column grid with varying card heights
- **Interactive Elements**: Smooth hover effects and transitions throughout the interface

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Fonts**: Geist Sans and Geist Mono
- **State Management**: React hooks with local storage persistence

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx              # Root layout with font configuration
│   ├── page.tsx                # Homepage with blog posts and filtering
│   ├── post/[id]/page.tsx      # Individual post view
│   └── manage-post/[[...params]]/page.tsx  # Create/edit post form
├── components/
│   ├── navbar.tsx              # Typography-driven navigation header
│   ├── about-section.tsx       # Minimalist about section
│   ├── portfolio-grid.tsx      # Masonry grid layout for posts
│   ├── post-card.tsx          # Individual post card component
│   └── ui/                    # shadcn/ui components
├── public/
│   └── data.json              # Blog posts, categories, and authors data
└── README.md
\`\`\`

## Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd minimalist-blog-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Viewing Posts
- Browse all posts on the homepage
- Filter by categories using the navigation pills
- Click any post title to read the full content
- Use category and tag links within posts for cross-navigation

### Managing Posts
- Click "CREATE POST" in the header to add new content
- Use the "Edit" button on any post to modify existing content
- All changes are automatically saved to local storage

### Filtering & Navigation
- Filter posts by category using the header navigation
- Click tags or categories within posts to filter the homepage
- URL parameters maintain filter state for easy sharing

## Data Structure

The application uses a local JSON file (`public/data.json`) containing:

- **Posts**: id, title, content, image, authorId, categoryId, tags array
- **Categories**: categoryId, name
- **Authors**: authorId, name

## Design Philosophy

This blog system prioritizes:
- **Clarity**: Clean typography and generous whitespace
- **Performance**: Optimized loading and smooth interactions
- **Accessibility**: Semantic HTML and proper contrast ratios
- **Responsiveness**: Mobile-first design approach
- **Content Focus**: Distraction-free reading experience

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
