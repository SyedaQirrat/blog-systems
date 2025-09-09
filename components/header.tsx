"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { loadBlogData, Series, Category } from "@/lib/data-service";

export function Header() {
  const [series, setSeries] = useState<Series[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch series and categories to populate the header links
    const fetchData = async () => {
      try {
        const data = await loadBlogData();
        setSeries(data.series);
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to load data for header:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="SSTRACK BLOGS Logo"
                width={40}
                height={40}
                className="h-auto"
              />
            </Link>
          </div>

          {/* Center section: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Series Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-600 hover:text-primary-dark transition-colors outline-none">
                Series <ChevronDown className="h-4 w-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {series.map((s) => (
                  <Link key={s._id} href={`/blog?series=${s._id}`} passHref>
                    <DropdownMenuItem>{s.title}</DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-primary-dark transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-primary-dark transition-colors">
              Contact Us
            </Link>
            
            {/* Display first two categories as links */}
            {categories.slice(0, 2).map((cat) => (
              <Link key={cat.categoryId} href={`/blog?category=${cat.name}`} className="text-sm font-medium text-gray-600 hover:text-primary-dark transition-colors">
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Right section: Profile etc. */}
          <div className="flex items-center space-x-4">
             <Link href="/manage-posts" className="text-sm font-medium text-gray-600 hover:text-primary-dark transition-colors">
                Manage Posts
            </Link>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary-accent ring-2 ring-white" />
            </Button>
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <p className="text-sm font-medium text-gray-800 hidden lg:block">Syeda Qirrat</p>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}