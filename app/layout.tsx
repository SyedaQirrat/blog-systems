import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSTRACK BLOGS",
  description: "A blog platform for SSTRACK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}