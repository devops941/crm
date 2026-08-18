"use client";

import { useState } from "react";
import { Plus, Search, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CrudActions } from "@/components/dashboard/crud-actions";
import { users } from "@/lib/dummy-data";

const roleColors: Record<string, string> = {
  "Super Admin": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Admin: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Branch Admin": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Counsellor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "View Only": "bg-muted text-muted-foreground",
};

export default function UsersPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Users & RBAC</h1>
          <Badge variant="secondary">{users.length} users</Badge>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add User</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3"><Shield className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-semibold">Roles</span></div>
          <div className="flex flex-wrap gap-2">{Object.entries(roleColors).map(([role, color]) => (<Badge key={role} variant="outline" className={`text-xs ${color}`}>{role}</Badge>))}</div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Select><SelectTrigger className="w-[160px]"><SelectValue placeholder="All Roles" /></SelectTrigger><SelectContent><SelectItem value="all">All Roles</SelectItem><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="branch_admin">Branch Admin</SelectItem><SelectItem value="counsellor">Counsellor</SelectItem><SelectItem value="view_only">View Only</SelectItem></SelectContent></Select>
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." className="pl-9" /></div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead>
                <TableHead>Branch</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-semibold">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{u.email}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${roleColors[u.role]}`}>{u.role}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{u.branch}</TableCell>
                  <TableCell><Badge variant={u.active ? "default" : "secondary"}>{u.active ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell><CrudActions data={u} label="user" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Name" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Role</Label><Select><SelectTrigger><SelectValue placeholder="Select role..." /></SelectTrigger><SelectContent><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="branch_admin">Branch Admin</SelectItem><SelectItem value="counsellor">Counsellor</SelectItem><SelectItem value="view_only">View Only</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Branch</Label><Select><SelectTrigger><SelectValue placeholder="Select branch..." /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="chennai">Chennai Main</SelectItem><SelectItem value="bangalore">Bangalore</SelectItem><SelectItem value="mumbai">Mumbai</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="Set password" /></div>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Create User</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
