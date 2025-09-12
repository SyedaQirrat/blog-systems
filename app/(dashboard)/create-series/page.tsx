import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSeries } from "@/lib/data";
import { SeriesTable } from "./series-table";
import { AddSeriesDialog } from "./add-series-dialog";

export default async function CreateSeriesPage() {
  const series = await getSeries();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Manage Series</h1>
        <AddSeriesDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Existing Series</CardTitle>
        </CardHeader>
        <CardContent>
          <SeriesTable series={series} />
        </CardContent>
      </Card>
    </div>
  );
}