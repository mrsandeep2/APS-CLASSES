import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FlaskConical, Palette, Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "./SectionHeading";

const courses = [
  {
    icon: BookOpen,
    title: "Nursery to 5th",
    desc: "Strong foundation in all subjects with fun and engaging teaching methods.",
    tags: ["Hindi Medium", "English Medium"],
    features: ["Activity-based learning", "Creative development focus", "Regular parent meetings"],
    baseBg: "bg-indigo-50 dark:bg-indigo-950/30",
    activeBg: "bg-indigo-100 dark:bg-indigo-900/40",
    color: "from-indigo-500 to-blue-600",
    iconBg: "bg-indigo-500/15",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    activeBorder: "border-indigo-400 dark:border-indigo-600",
  },
  {
    icon: Calculator,
    title: "6th to 10th",
    desc: "Comprehensive preparation for board exams with regular tests and doubt sessions.",
    tags: ["CBSE", "Bihar Board"],
    features: ["Weekly mock tests", "Doubt clearing sessions", "Board exam preparation"],
    baseBg: "bg-teal-50 dark:bg-teal-950/30",
    activeBg: "bg-teal-100 dark:bg-teal-900/40",
    color: "from-teal-500 to-green-600",
    iconBg: "bg-teal-500/15",
    borderColor: "border-teal-200 dark:border-teal-800",
    activeBorder: "border-teal-400 dark:border-teal-600",
  },
  {
    icon: FlaskConical,
    title: "11th & 12th Science",
    desc: "Expert coaching in Physics, Chemistry, Mathematics & Biology.",
    tags: ["PCM", "PCB"],
    features: ["Lab practical support", "JEE/NEET foundation", "Chapter-wise tests"],
    baseBg: "bg-purple-50 dark:bg-purple-950/30",
    activeBg: "bg-purple-100 dark:bg-purple-900/40",
    color: "from-purple-500 to-violet-600",
    iconBg: "bg-purple-500/15",
    borderColor: "border-purple-200 dark:border-purple-800",
    activeBorder: "border-purple-400 dark:border-purple-600",
  },
  {
    icon: Palette,
    title: "11th & 12th Arts & Commerce",
    desc: "Dedicated coaching for Commerce and Arts streams with experienced faculty.",
    tags: ["Commerce", "Arts"],
    features: ["Accounts & Economics", "Political Science & History", "Career guidance included"],
    baseBg: "bg-orange-50 dark:bg-orange-950/30",
    activeBg: "bg-orange-100 dark:bg-orange-900/40",
    color: "from-orange-500 to-amber-600",
    iconBg: "bg-orange-500/15",
    borderColor: "border-orange-200 dark:border-orange-800",
    activeBorder: "border-orange-400 dark:border-orange-600",
  },
];

const CoachingSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="coaching" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeading title="Coaching Programs" subtitle="Comprehensive coaching from Nursery to 12th with expert faculty and proven methodology." />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {courses.map(({ icon: Icon, title, desc, tags, features, baseBg, activeBg, color, iconBg, borderColor, activeBorder }, i) => {
            const isActive = activeIndex === i;
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveIndex(isActive ? null : i)}
                onTouchStart={() => setActiveIndex(isActive ? null : i)}
                className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                  isActive ? `${activeBg} ${activeBorder} shadow-xl` : `${baseBg} ${borderColor} hover:shadow-xl`
                }`}
              >
                <div className={`h-1.5 bg-gradient-to-r ${color}`} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{desc}</p>
                  <ul className="space-y-1.5 mb-4">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button asChild size="lg" className="group">
            <Link to="/contact">
              View Courses
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CoachingSection;
