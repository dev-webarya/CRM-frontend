import { BookOpen, Microscope, Code, PenTool, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: BookOpen,
    title: "Course 1",
    desc: "Comprehensive preparation for advanced levels with expert faculty and regular mock tests.",
    features: ["Subject 1, Subject 2, Subject 3", "Weekly mock tests", "Doubt clearing sessions", "Study material included"],
    price: "₹15,000/month",
  },
  {
    icon: Microscope,
    title: "Course 2",
    desc: "Specialized coaching with practical sessions and in-depth concept building.",
    features: ["Subject 4, Subject 5, Subject 6", "Goal focused approach", "Previous year analysis", "Monthly assessments"],
    price: "₹12,000/month",
  },
  {
    icon: PenTool,
    title: "Course 3",
    desc: "Targeted preparation for board exams with focus on scoring techniques.",
    features: ["All subjects 1-10 covered", "Sample paper practice", "Answer writing skills", "Flexible timings"],
    price: "₹8,000/month",
  },
  {
    icon: Code,
    title: "Course 4",
    desc: "Advanced professional courses from basics to competitive levels.",
    features: ["Subject 7, Subject 8, Subject 9", "Skill-based learning", "Project-based learning", "Portfolio building"],
    price: "₹10,000/month",
  },
];

import { motion } from "framer-motion";

export default function Services() {
  return (
    <div className="py-24 bg-background">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive coaching programs designed to help you achieve academic excellence through personalized mentorship.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {services.map((s, i) => (
            <motion.div 
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-3xl bg-card p-8 shadow-card border border-border/50 transition-all hover:border-primary/30 hover:shadow-xl hover:translate-y-[-4px]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-inner">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground">{s.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
              
              <div className="mt-8 space-y-3">
                {s.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                    <span className="text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 pt-8 border-t border-border/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Starting from</p>
                  <span className="text-2xl font-black text-foreground">{s.price}</span>
                </div>
                <Link to="/contact">
                  <Button size="lg" className="gradient-primary border-0 text-primary-foreground font-bold shadow-md hover:shadow-primary/20">
                    Enquire Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
