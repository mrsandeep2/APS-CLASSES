import { useState } from "react";
import { motion } from "framer-motion";
import { University, Compass, HeartHandshake, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "./SectionHeading";

const universities = [
  {
    name: "Lovely Professional University", short: "LPU", location: "Punjab",
    features: ["200+ courses available", "Top placements in India", "Scholarship options"],
    baseBg: "bg-amber-50 dark:bg-amber-950/30", activeBg: "bg-amber-100 dark:bg-amber-900/40",
    color: "from-amber-500 to-orange-500", iconBg: "bg-amber-500/15",
    borderColor: "border-amber-200 dark:border-amber-800", activeBorder: "border-amber-400 dark:border-amber-600",
  },
  {
    name: "Galgotias University", short: "GU", location: "Greater Noida",
    features: ["NAAC A+ accredited", "Industry partnerships", "Modern campus facilities"],
    baseBg: "bg-cyan-50 dark:bg-cyan-950/30", activeBg: "bg-cyan-100 dark:bg-cyan-900/40",
    color: "from-cyan-500 to-blue-500", iconBg: "bg-cyan-500/15",
    borderColor: "border-cyan-200 dark:border-cyan-800", activeBorder: "border-cyan-400 dark:border-cyan-600",
  },
  {
    name: "Parul University", short: "PU", location: "Gujarat",
    features: ["150+ programs", "International collaborations", "Affordable education"],
    baseBg: "bg-lime-50 dark:bg-lime-950/30", activeBg: "bg-lime-100 dark:bg-lime-900/40",
    color: "from-lime-500 to-green-500", iconBg: "bg-lime-500/15",
    borderColor: "border-lime-200 dark:border-lime-800", activeBorder: "border-lime-400 dark:border-lime-600",
  },
  {
    name: "Teerthanker Mahaveer University", short: "TMU", location: "Moradabad",
    features: ["Medical & Engineering", "Strong alumni network", "Campus placements"],
    baseBg: "bg-fuchsia-50 dark:bg-fuchsia-950/30", activeBg: "bg-fuchsia-100 dark:bg-fuchsia-900/40",
    color: "from-fuchsia-500 to-purple-500", iconBg: "bg-fuchsia-500/15",
    borderColor: "border-fuchsia-200 dark:border-fuchsia-800", activeBorder: "border-fuchsia-400 dark:border-fuchsia-600",
  },
];

const services = [
  {
    icon: Compass, title: "Course Guidance",
    desc: "Help choosing the right course based on your interests and career goals.",
    features: ["Stream analysis", "Aptitude assessment", "Course comparison"],
    baseBg: "bg-blue-50 dark:bg-blue-950/30", activeBg: "bg-blue-100 dark:bg-blue-900/40",
    color: "from-blue-500 to-indigo-500", iconBg: "bg-blue-500/15",
    borderColor: "border-blue-200 dark:border-blue-800", activeBorder: "border-blue-400 dark:border-blue-600",
  },
  {
    icon: HeartHandshake, title: "Admission Support",
    desc: "End-to-end support from application to enrollment in your dream university.",
    features: ["Application filing", "Document verification", "Seat confirmation"],
    baseBg: "bg-emerald-50 dark:bg-emerald-950/30", activeBg: "bg-emerald-100 dark:bg-emerald-900/40",
    color: "from-emerald-500 to-teal-500", iconBg: "bg-emerald-500/15",
    borderColor: "border-emerald-200 dark:border-emerald-800", activeBorder: "border-emerald-400 dark:border-emerald-600",
  },
  {
    icon: Lightbulb, title: "Career Counseling",
    desc: "Expert advice on career paths, industry trends, and future opportunities.",
    features: ["Industry insights", "Salary projections", "Growth roadmap"],
    baseBg: "bg-yellow-50 dark:bg-yellow-950/30", activeBg: "bg-yellow-100 dark:bg-yellow-900/40",
    color: "from-yellow-500 to-amber-500", iconBg: "bg-yellow-500/15",
    borderColor: "border-yellow-200 dark:border-yellow-800", activeBorder: "border-yellow-400 dark:border-yellow-600",
  },
];

const AdmissionSection = () => {
  const [activeUni, setActiveUni] = useState<number | null>(null);
  const [activeService, setActiveService] = useState<number | null>(null);

  return (
    <section id="admission" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading title="College Admission Assistance" subtitle="Get admitted to India's top private universities with our expert guidance." />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-14">
          {universities.map((uni, i) => {
            const isActive = activeUni === i;
            return (
              <motion.div
                key={uni.short}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveUni(isActive ? null : i)}
                onTouchStart={() => setActiveUni(isActive ? null : i)}
                className={`rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group border-2 ${
                  isActive ? `${uni.activeBg} ${uni.activeBorder} shadow-xl` : `${uni.baseBg} ${uni.borderColor} hover:shadow-xl`
                }`}
              >
                <div className={`h-1.5 bg-gradient-to-r ${uni.color}`} />
                <div className="p-5 text-center">
                  <div className={`w-14 h-14 rounded-2xl ${uni.iconBg} flex items-center justify-center mx-auto mb-3 group-hover:rotate-6 transition-all duration-300`}>
                    <University className="w-7 h-7 text-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-sm mb-1">{uni.name}</h3>
                  <p className="text-muted-foreground text-xs mb-3">{uni.location}</p>
                  <ul className="text-left space-y-1">
                    {uni.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className={`w-1 h-1 rounded-full bg-gradient-to-r ${uni.color} shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {services.map(({ icon: Icon, title, desc, features, baseBg, activeBg, color, iconBg, borderColor, activeBorder }, i) => {
            const isActive = activeService === i;
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveService(isActive ? null : i)}
                onTouchStart={() => setActiveService(isActive ? null : i)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                  isActive ? `${activeBg} ${activeBorder} shadow-lg` : `${baseBg} ${borderColor} hover:shadow-lg`
                }`}
              >
                <div className="flex gap-4 items-start mb-3">
                  <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-1">{title}</h4>
                    <p className="text-muted-foreground text-sm">{desc}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 pl-15">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>
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
              Apply for Admission
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AdmissionSection;
