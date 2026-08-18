import Link from "next/link";
import { Plus, FolderPlus, UserRoundPlus, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/courses/editor">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add New Course</Button>
          </Link>
          <Link href="/dashboard/categories">
            <Button variant="outline" size="sm"><FolderPlus className="h-4 w-4 mr-1" />Add Category</Button>
          </Link>
          <Link href="/dashboard/counsellors">
            <Button variant="outline" size="sm"><UserRoundPlus className="h-4 w-4 mr-1" />Add Counsellor</Button>
          </Link>
          <Link href="/dashboard/leads">
            <Button variant="ghost" size="sm">View All Leads<ExternalLink className="h-3.5 w-3.5 ml-1" /></Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
