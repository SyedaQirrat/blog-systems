import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Tags,
  Library,
  Users,
  MessageSquare,
} from "lucide-react";

type UserRole = "Admin" | "Editor" | "Author/Writer";

// Defines the navigation links available for each role
const navLinks: Record<UserRole, { href: string; label: string; icon: React.ElementType }[]> = {
  Admin: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/manage-posts", label: "Manage Posts", icon: FileText },
    { href: "/create-category", label: "Categories", icon: Tags },
    { href: "/create-series", label: "Series", icon: Library },
    { href: "/users", label: "User Management", icon: Users },
    { href: "/comments", label: "Comments", icon: MessageSquare },
  ],
  Editor: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/manage-posts", label: "Manage Posts", icon: FileText },
    { href: "/create-category", label: "Categories", icon: Tags },
    { href: "/create-series", label: "Series", icon: Library },
    { href: "/comments", label: "Comments", icon: MessageSquare },
  ],
  "Author/Writer": [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/manage-posts", label: "My Posts", icon: FileText },
  ],
};

export function DashboardSidebar({ role }: { role: UserRole }) {
  const links = navLinks[role];

  return (
    <aside className="hidden w-64 flex-col border-r bg-gray-100/40 p-4 md:flex">
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}