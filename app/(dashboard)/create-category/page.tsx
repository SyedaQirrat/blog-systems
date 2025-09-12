import { getCategories } from "@/lib/data";
import { CategoriesTable } from "./categories-table";
import { AddCategoryDialog } from "./add-category-dialog";

export default async function CreateCategoryPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
        {/* The form is now in a pop-up dialog */}
        <AddCategoryDialog />
      </div>
      <div className="rounded-lg border shadow-sm">
        <CategoriesTable categories={categories} />
      </div>
    </div>
  );
}