import { Target, Heart, Lightbulb, Users } from "lucide-react";

const values = [
  { icon: Target, title: "Excellence", desc: "We strive for the highest standards in education and mentorship." },
  { icon: Heart, title: "Student-First", desc: "Every decision we make puts our students' success at the center." },
  { icon: Lightbulb, title: "Innovation", desc: "We embrace modern teaching methods and technology-driven learning." },
  { icon: Users, title: "Community", desc: "We build a supportive ecosystem for students, parents, and teachers." },
];

export default function About() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">About <span className="text-gradient">EduCoach</span></h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Founded in 2018, EduCoach has been a beacon of academic excellence, helping students achieve their dreams through personalized coaching and expert mentorship.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Our Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl bg-card p-6 shadow-soft border border-border/50">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-muted p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                To democratize quality education by providing personalized, affordable, and accessible coaching that empowers every student to realize their full potential, regardless of their background.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-card p-4 shadow-soft">
                <p className="text-2xl font-bold text-primary">7+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div className="rounded-lg bg-card p-4 shadow-soft">
                <p className="text-2xl font-bold text-primary">30+</p>
                <p className="text-sm text-muted-foreground">Expert Teachers</p>
              </div>
              <div className="rounded-lg bg-card p-4 shadow-soft">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Happy Students</p>
              </div>
              <div className="rounded-lg bg-card p-4 shadow-soft">
                <p className="text-2xl font-bold text-primary">95%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
