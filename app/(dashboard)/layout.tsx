import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { getMockUser } from "@/lib/auth";
import React from "react";

// This layout will be applied to all pages inside the (dashboard) group
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMockUser();

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar role={user.role} />
      <div className="flex-1">
        {/* We can add a dashboard-specific header here later */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}