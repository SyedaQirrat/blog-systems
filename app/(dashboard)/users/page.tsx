import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getUsers } from "@/lib/data";
import { UsersTable } from "./users-table";
import { InviteUserDialog } from "./invite-user-dialog";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <InviteUserDialog />
      </div>
      <div className="rounded-lg border shadow-sm">
        <UsersTable users={users} />
      </div>
    </div>
  );
}