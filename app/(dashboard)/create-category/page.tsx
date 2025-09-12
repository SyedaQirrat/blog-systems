import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories } from "@/lib/data";
import { AddCategoryForm } from "./add-category-form";
import { CategoriesTable } from "./categories-table";

export default async function CreateCategoryPage() {
  const categories = await getCategories();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Create Category</CardTitle>
            <CardDescription>
              Add a new category to organize your blog posts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddCategoryForm />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
           <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoriesTable categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}