import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, Award, ArrowRight, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  { icon: Users, value: "500+", label: "Students Enrolled" },
  { icon: BookOpen, value: "50+", label: "Expert Courses" },
  { icon: Award, value: "95%", label: "Success Rate" },
  { icon: Star, value: "4.9", label: "Average Rating" },
];

const features = [
  "Personalized one-on-one coaching sessions",
  "Expert faculty with 10+ years experience",
  "Comprehensive study materials included",
  "Regular progress tracking and assessments",
  "Flexible scheduling for working students",
  "Affordable pricing with EMI options",
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(230_70%_55%_/_0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(174_60%_42%_/_0.1),_transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/80">
              <GraduationCap className="h-4 w-4" />
              Trusted by 500+ students
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Unlock Your
              <span className="text-gradient"> Academic Potential</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/70">
              Expert coaching for JEE, NEET, and Board exams. Personalized learning paths, dedicated mentors, and proven results.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="lg" className="gap-2 gradient-primary border-0 text-primary-foreground shadow-lg">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-12 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl bg-card p-6 text-center shadow-card border border-border/50"
              >
                <h.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-2xl font-bold text-card-foreground">{h.value}</p>
                <p className="text-sm text-muted-foreground">{h.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Why Choose <span className="text-gradient">EduCoach?</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We combine expert mentorship with technology to deliver results that speak for themselves.
              </p>
              <ul className="mt-8 space-y-4">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/services" className="mt-8 inline-block">
                <Button variant="outline" className="gap-2">
                  View Our Services <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl gradient-primary p-8 text-primary-foreground">
              <h3 className="text-2xl font-bold">Start Your Journey Today</h3>
              <p className="mt-3 text-primary-foreground/80">
                Join hundreds of successful students who achieved their dream scores with our guidance.
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-lg bg-primary-foreground/10 p-4">
                  <p className="font-semibold">JEE Advanced 2025</p>
                  <p className="text-sm text-primary-foreground/70">12 students in Top 500 AIR</p>
                </div>
                <div className="rounded-lg bg-primary-foreground/10 p-4">
                  <p className="font-semibold">NEET 2025</p>
                  <p className="text-sm text-primary-foreground/70">98% students scored 600+</p>
                </div>
                <div className="rounded-lg bg-primary-foreground/10 p-4">
                  <p className="font-semibold">Board Results</p>
                  <p className="text-sm text-primary-foreground/70">Average score improvement: 35%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
