import { useState } from "react";
import { logs } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LogsViewer() {
  const [dateFilter, setDateFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = logs.filter((l) => {
    if (dateFilter && !l.timestamp.startsWith(dateFilter)) return false;
    if (actionFilter !== "all" && l.action !== actionFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-muted-foreground">Read-only audit trail of all system actions.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-auto" />
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Actions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="CREATE">Create</SelectItem>
            <SelectItem value="UPDATE">Update</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Object</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground whitespace-nowrap">{l.timestamp}</td>
                  <td className="px-6 py-4"><StatusBadge status={l.action as any} /></td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{l.object}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{l.user} <span className="text-xs">({l.role})</span></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
