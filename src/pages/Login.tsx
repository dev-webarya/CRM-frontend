import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ShieldCheck, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const roles = [
  { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Full system access", color: "bg-primary/10 text-primary border-primary/20" },
  { id: "teacher", label: "Teacher", icon: BookOpen, desc: "Manage classes & students", color: "bg-accent/10 text-accent border-accent/20" },
  { id: "student", label: "Student", icon: User, desc: "View schedule & progress", color: "bg-info/10 text-info border-info/20" },
] as const;

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduCoach</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-1 text-muted-foreground">Select your role and sign in to continue.</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                  selectedRole === r.id
                    ? "border-primary bg-primary/5 shadow-soft"
                    : "border-border hover:border-primary/30"
                )}
              >
                <r.icon className={cn("h-5 w-5", selectedRole === r.id ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium", selectedRole === r.id ? "text-foreground" : "text-muted-foreground")}>{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <Input type="email" placeholder="you@institute.com" defaultValue="admin@educoach.in" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <Input type="password" placeholder="••••••••" defaultValue="password123" />
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">
              Sign In as {roles.find((r) => r.id === selectedRole)?.label}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Demo credentials are pre-filled. Just click Sign In.
          </p>
        </div>
      </div>

      {/* Right - decorative */}
      <div className="hidden lg:flex lg:flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground">Manage Your Institute</h2>
          <p className="mt-4 text-primary-foreground/70">
            Streamline student management, track classes, handle billing, and more — all in one platform.
          </p>
        </div>
      </div>
    </div>
  );
}
