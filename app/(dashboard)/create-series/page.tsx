import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSeries } from "@/lib/data";
import { AddSeriesForm } from "./add-series-form";
import { SeriesTable } from "./series-table";


export default async function CreateSeriesPage() {
  const series = await getSeries();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Create Series</CardTitle>
            <CardDescription>
              Add a new series to group related blog posts together.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddSeriesForm />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
           <CardHeader>
            <CardTitle>Existing Series</CardTitle>
          </CardHeader>
          <CardContent>
            <SeriesTable series={series} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}