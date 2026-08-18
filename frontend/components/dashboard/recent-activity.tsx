import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rows = [
  { action: "Created", item: "—", by: "Admin", date: "—", color: "text-emerald-500" },
  { action: "Updated", item: "—", by: "Admin", date: "—", color: "text-yellow-500" },
  { action: "Registered", item: "—", by: "System", date: "—", color: "text-cyan-500" },
  { action: "Status Changed", item: "—", by: "Counsellor", date: "—", color: "text-orange-500" },
  { action: "Completed", item: "—", by: "Counsellor", date: "—", color: "text-emerald-500" },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
        <Badge variant="secondary" className="text-[10px]">LIVE</Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Action</TableHead>
              <TableHead className="text-xs">Item</TableHead>
              <TableHead className="text-xs">By</TableHead>
              <TableHead className="text-xs">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell className={`text-xs font-medium ${r.color}`}>{r.action}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.item}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.by}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></div>
      </CardContent>
    </Card>
  );
}
