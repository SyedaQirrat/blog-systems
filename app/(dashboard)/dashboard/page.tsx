import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>
              Here's a quick overview of your blog's performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Analytics and recent activity will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}