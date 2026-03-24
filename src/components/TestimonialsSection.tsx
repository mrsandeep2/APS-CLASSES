import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Kumar",
    role: "Class 12 Student",
    text: "APS Classes transformed my preparation. Munna Sir's teaching style is amazing. I scored 92% in my board exams thanks to the guidance here.",
    accent: "from-blue-500 to-cyan-400",
  },
  {
    name: "Sunita Devi",
    role: "Parent",
    text: "My son got admitted to LPU through APS Classes. The admission support was seamless and the counseling really helped us make the right choice.",
    accent: "from-emerald-500 to-teal-400",
  },
  {
    name: "Amit Sharma",
    role: "B.Tech Student, Galgotias",
    text: "The career counseling at APS Classes helped me choose the right engineering branch. Now I'm studying at Galgotias and loving it!",
    accent: "from-violet-500 to-purple-400",
  },
  {
    name: "Priya Singh",
    role: "Class 10 Student",
    text: "The teachers at APS Classes are very supportive. They explain everything clearly and the regular tests helped me improve my scores significantly.",
    accent: "from-amber-500 to-orange-400",
  },
];

const TestimonialsSection = () => (
  <section className="py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <SectionHeading title="What Our Students Say" subtitle="Real stories from students and parents who trusted APS Classes." />

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {testimonials.map(({ name, role, text, accent }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
          >
            <div className={`h-1 bg-gradient-to-r ${accent}`} />
            <div className="p-6">
              <Quote className="w-8 h-8 text-secondary/30 mb-3" />
              <p className="text-muted-foreground leading-relaxed mb-4">{text}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${accent} flex items-center justify-center text-white font-heading font-bold text-sm`}>
                  {name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{name}</p>
                  <p className="text-muted-foreground text-xs">{role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
