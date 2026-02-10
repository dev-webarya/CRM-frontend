import { useState } from "react";
import { teachers } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function TeachersManagement() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">Manage your teaching staff.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary border-0 text-primary-foreground"><Plus className="h-4 w-4" /> Add Teacher</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Teacher</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label><Input placeholder="Dr. John Smith" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Email</label><Input type="email" placeholder="john@institute.com" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label><Input placeholder="+91 XXXXX XXXXX" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Subjects (comma-separated)</label><Input placeholder="Mathematics, Physics" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Hourly Rate (₹)</label><Input type="number" placeholder="800" /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => toast({ title: "Teacher added!", description: "New teacher has been added successfully." })}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or subject..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Hours/Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-card-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{t.subjects.join(", ")}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">₹{t.rate}/hr</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{t.monthlyHours}h</td>
                  <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
