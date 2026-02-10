import { BookOpen, Microscope, Code, PenTool, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: BookOpen,
    title: "JEE Coaching",
    desc: "Comprehensive preparation for JEE Main & Advanced with expert faculty and regular mock tests.",
    features: ["Physics, Chemistry, Mathematics", "Weekly mock tests", "Doubt clearing sessions", "Study material included"],
    price: "₹15,000/month",
  },
  {
    icon: Microscope,
    title: "NEET Preparation",
    desc: "Biology-focused NEET coaching with practical lab sessions and in-depth concept building.",
    features: ["Biology, Chemistry, Physics", "NCERT focused approach", "Previous year analysis", "Monthly assessments"],
    price: "₹12,000/month",
  },
  {
    icon: PenTool,
    title: "Board Exam Prep",
    desc: "Targeted preparation for CBSE and state board exams with focus on scoring techniques.",
    features: ["All subjects covered", "Sample paper practice", "Answer writing skills", "Flexible timings"],
    price: "₹8,000/month",
  },
  {
    icon: Code,
    title: "CS & Coding",
    desc: "Programming and computer science courses from basics to competitive coding.",
    features: ["Python, Java, C++", "Data structures & algorithms", "Project-based learning", "Portfolio building"],
    price: "₹10,000/month",
  },
];

export default function Services() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Our <span className="text-gradient">Services</span></h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive coaching programs designed to help you achieve academic excellence.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="group rounded-xl bg-card p-6 shadow-soft border border-border/50 transition-all hover:shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <ul className="mt-4 space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{s.price}</span>
                <Link to="/contact">
                  <Button size="sm" variant="outline" className="gap-1">Enquire <ArrowRight className="h-3.5 w-3.5" /></Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
