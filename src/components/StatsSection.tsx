import { Users, GraduationCap, BookOpen, UserCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Students Taught", color: "from-blue-600 to-sky-400", iconBg: "bg-blue-500/15", border: "border-blue-500/30" },
  { icon: GraduationCap, value: 100, suffix: "+", label: "Successful Admissions", color: "from-emerald-600 to-teal-400", iconBg: "bg-emerald-500/15", border: "border-emerald-500/30" },
  { icon: BookOpen, value: 10, suffix: "+", label: "Years Experience", color: "from-amber-500 to-orange-400", iconBg: "bg-amber-500/15", border: "border-amber-500/30" },
  { icon: UserCheck, value: 100, suffix: "%", label: "Personalized Guidance", color: "from-violet-600 to-purple-400", iconBg: "bg-violet-500/15", border: "border-violet-500/30" },
];

function AnimatedNumber({ target, trigger }: { target: number; trigger: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (trigger === 0) return;
    setCount(0);
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target]);

  return <>{count}</>;
}

const StatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasBeenOutOfView = useRef(true);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [clickTriggers, setClickTriggers] = useState([0, 0, 0, 0]);

  // Restart counting each time this section enters viewport again.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (hasBeenOutOfView.current) {
            setScrollTrigger((p) => p + 1);
            hasBeenOutOfView.current = false;
          }
        } else {
          hasBeenOutOfView.current = true;
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleClick = (i: number) => {
    setClickTriggers((prev) => {
      const next = [...prev];
      next[i] += 1;
      return next;
    });
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-primary relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map(({ icon: Icon, value, suffix, label, color, iconBg, border }, i) => {
            const trigger = scrollTrigger + clickTriggers[i];
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleClick(i)}
                className={`relative text-center cursor-pointer select-none rounded-2xl p-5 md:p-7 border ${border} bg-primary-foreground/[0.04] backdrop-blur-sm hover:bg-primary-foreground/[0.08] transition-all duration-500 group overflow-hidden`}
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 rounded-2xl`} />

                {/* Top accent line */}
                <div className={`absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r ${color} rounded-full`} />

                <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${iconBg} group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-secondary" />
                </div>
                <div className={`relative text-3xl md:text-4xl font-bold font-heading text-primary-foreground bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                  <AnimatedNumber target={value} trigger={trigger} />
                  {suffix}
                </div>
                <p className="relative text-xs md:text-sm mt-2 text-primary-foreground/60 font-medium">{label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
