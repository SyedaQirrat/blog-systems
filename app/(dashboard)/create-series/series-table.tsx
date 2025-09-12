import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Series } from "@/lib/data";

interface SeriesTableProps {
  series: Series[];
}

export function SeriesTable({ series }: SeriesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Posts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {series.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell className="text-right">{item.postCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}