import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SSTRACK BLOGS - The Latest in Tech and Design",
  description: "Explore in-depth articles on technology, design, and web development. Stay up-to-date with our comprehensive guides and insights.",
  keywords: ["sstrack", "blog", "tech", "web development", "design", "guides"],
  authors: [{ name: "SSTRACK" }],
  openGraph: {
    title: "SSTRACK BLOGS",
    description: "Explore in-depth articles on technology, design, and web development.",
    url: "https://yourblogdomain.com",
    siteName: "SSTRACK BLOGS",
    images: [
      {
        url: 'https://yourblogdomain.com/path/to/og-image.jpg', // Replace with your image
        width: 1200,
        height: 630,
        alt: 'SSTRACK BLOGS',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSTRACK BLOGS',
    description: 'Explore in-depth articles on technology, design, and web development.',
    creator: '@yourhandle', // Replace with your Twitter handle
    images: ['https://yourblogdomain.com/path/to/twitter-image.jpg'], // Replace with your image
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
}