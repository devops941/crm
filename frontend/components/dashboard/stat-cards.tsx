import { BookOpen, GraduationCap, MessageCircle, UserPlus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { title: "Total Courses", value: "0", change: "+0 this month", icon: BookOpen, color: "text-blue-500", border: "border-t-blue-500", changeBg: "text-emerald-500" },
  { title: "Total Students", value: "0", change: "+0 this month", icon: GraduationCap, color: "text-emerald-500", border: "border-t-emerald-500", changeBg: "text-emerald-500" },
  { title: "Active Sessions", value: "0", change: "Currently ongoing", icon: MessageCircle, color: "text-cyan-500", border: "border-t-cyan-500", changeBg: "text-cyan-500" },
  { title: "Pending Leads", value: "0", change: "0 follow-ups due", icon: UserPlus, color: "text-orange-500", border: "border-t-orange-500", changeBg: "text-orange-500" },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((s) => (
        <Card key={s.title} className={`border-t-4 ${s.border}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
            <s.icon className={`h-5 w-5 ${s.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{s.value}</div>
            <p className={`text-xs mt-1 flex items-center gap-1 ${s.changeBg}`}>
              <TrendingUp className="h-3 w-3" />{s.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
