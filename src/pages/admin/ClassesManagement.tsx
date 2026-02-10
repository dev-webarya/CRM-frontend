import { useState } from "react";
import { classSessions } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, AlertTriangle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function ClassesManagement() {
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground">Manage and schedule class sessions.</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary border-0 text-primary-foreground"><Plus className="h-4 w-4" /> Add Class</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Schedule New Class</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Date</label><Input type="date" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Time</label><Input type="time" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Duration (hours)</label><Input type="number" placeholder="1.5" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Teacher</label><Input placeholder="Select teacher" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Student</label><Input placeholder="Select student" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label><Input placeholder="e.g., Mathematics" /></div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => { setShowDuplicateWarning(true); }}>Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Duplicate warning */}
      <AlertDialog open={showDuplicateWarning} onOpenChange={setShowDuplicateWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" /> Duplicate Class Detected
            </AlertDialogTitle>
            <AlertDialogDescription>
              A similar class is already scheduled for this teacher at the same time. Do you want to proceed anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => toast({ title: "Class scheduled!", description: "The class has been added despite the overlap." })}>
              Schedule Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suggested classes */}
      <div className="rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 p-4">
        <h3 className="font-medium text-foreground mb-2">📅 Suggested Classes (based on schedule)</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Class added!" })}>
            Math - Arjun - 9:00 AM
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Class added!" })}>
            Chemistry - Sneha - 11:00 AM
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Class added!" })}>
            Biology - Divya - 2:00 PM
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {classSessions.map((c) => (
                <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-card-foreground">{c.date}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.time}</td>
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{c.subject}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.teacherName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.studentName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.duration}h</td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
