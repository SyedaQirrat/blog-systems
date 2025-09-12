import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { getMockUser } from "@/lib/auth";
import React from "react";
import { DashboardHeader } from "@/components/dashboard-header"; // Import the new header

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMockUser();

  return (
    <div className="flex min-h-screen w-full bg-white">
      <DashboardSidebar role={user.role} />
      <div className="flex flex-col flex-1 sm:gap-4 sm:py-4 sm:pl-14">
        {/* Add the new header here */}
        <DashboardHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}