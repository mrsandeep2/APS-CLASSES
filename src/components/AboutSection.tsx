import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { Target, Award, Heart } from "lucide-react";

const items = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To make quality education accessible and guide every student towards a bright future.",
    features: ["Affordable fee structure", "Inclusive learning environment", "Focus on student growth"],
    baseBg: "bg-sky-50 dark:bg-sky-950/30",
    activeBg: "bg-sky-100 dark:bg-sky-900/40",
    color: "from-sky-500 to-cyan-400",
    iconBg: "bg-sky-500/15",
    borderColor: "border-sky-200 dark:border-sky-800",
    activeBorder: "border-sky-400 dark:border-sky-600",
  },
  {
    icon: Award,
    title: "Proven Results",
    desc: "Hundreds of students successfully coached and placed in prestigious universities.",
    features: ["Consistent board toppers", "100% university placement", "Award-winning teaching"],
    baseBg: "bg-emerald-50 dark:bg-emerald-950/30",
    activeBg: "bg-emerald-100 dark:bg-emerald-900/40",
    color: "from-emerald-500 to-teal-400",
    iconBg: "bg-emerald-500/15",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    activeBorder: "border-emerald-400 dark:border-emerald-600",
  },
  {
    icon: Heart,
    title: "Personal Touch",
    desc: "Small batch sizes ensuring individual attention and customized learning paths.",
    features: ["Max 25 students per batch", "Weekly parent updates", "One-on-one doubt sessions"],
    baseBg: "bg-rose-50 dark:bg-rose-950/30",
    activeBg: "bg-rose-100 dark:bg-rose-900/40",
    color: "from-rose-500 to-pink-400",
    iconBg: "bg-rose-500/15",
    borderColor: "border-rose-200 dark:border-rose-800",
    activeBorder: "border-rose-400 dark:border-rose-600",
  },
];

const AboutSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading title="About APS Classes" subtitle="Empowering students with quality education and career guidance since day one." />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground text-lg leading-relaxed text-center mb-12 max-w-4xl mx-auto"
        >
          Founded by <strong className="text-foreground">Munna Sir</strong>, APS Classes is a trusted name in education at Jagdishpur, West Champaran. We provide comprehensive coaching from Nursery to 12th standard across CBSE and Bihar Board curricula, and also assist students in securing admissions to top private universities across India.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {items.map(({ icon: Icon, title, desc, features, baseBg, activeBg, color, iconBg, borderColor, activeBorder }, i) => {
            const isActive = activeIndex === i;
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveIndex(isActive ? null : i)}
                onTouchStart={() => setActiveIndex(isActive ? null : i)}
                className={`text-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden relative group ${
                  isActive ? `${activeBg} ${activeBorder} shadow-lg` : `${baseBg} ${borderColor} hover:shadow-lg`
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${color}`} />
                <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{desc}</p>
                <ul className="text-left space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
