import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";
import { GraduationCap } from "lucide-react";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">EduCoach</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 EduCoach Institute. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
