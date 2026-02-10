import { useState } from "react";
import { students, teachers } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function StudentsManagement() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.regNumber.toLowerCase().includes(search.toLowerCase())
  );

  const getTeacherName = (id: string) => teachers.find((t) => t.id === id)?.name || "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage student enrollments.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary border-0 text-primary-foreground"><Plus className="h-4 w-4" /> Add Student</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label><Input placeholder="Student name" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Email</label><Input type="email" placeholder="student@email.com" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label><Input placeholder="+91 XXXXX XXXXX" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Grade</label><Input placeholder="e.g., 12th" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-foreground">Course</label><Input placeholder="e.g., JEE Advanced" /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => toast({ title: "Student added!" })}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or reg number..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Reg No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-card-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{s.regNumber}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{s.grade}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{s.course}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{getTeacherName(s.assignedTeacher)}</td>
                  <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
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
