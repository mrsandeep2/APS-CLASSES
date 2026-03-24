import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Users, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualification: string | null;
  point_one: string | null;
  point_two: string | null;
  mobile_number: string | null;
  image_url: string | null;
}

const DirectorSection = () => {
  const [member, setMember] = useState<TeamMember | null>(null);

  const fetchTeamMember = useCallback(async () => {
    const { data } = await (supabase as any).from("team_members").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle();
    if (data) setMember(data as TeamMember);
  }, []);

  useEffect(() => {
    fetchTeamMember();

    const channel = supabase
      .channel("team-members-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "team_members" },
        () => {
          fetchTeamMember();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTeamMember]);

  const displayName = member?.name || "Munna Sir";
  const displayRole = member?.role || "Director & Founder";
  const displayQualification = member?.qualification || "APS Classes, Jagdishpur";
  const displayPointOne = member?.point_one || "10+ Years Teaching Experience";
  const displayPointTwo = member?.point_two || "Expert in Board Exam Preparation";
  const displayMobile = member?.mobile_number || "7070422574";

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50/50 to-background dark:from-slate-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-emerald-600 text-xs font-bold tracking-[0.2em] uppercase mb-3 px-4 py-1.5 rounded-full border border-emerald-300/40 bg-emerald-100/60">
            Our Team
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mt-3">
            <span className="text-foreground">Meet Our </span>
            <span className="text-emerald-600">Director</span>
          </h2>
          <div className="flex justify-center gap-1 mt-3">
            <div className="w-10 h-1 rounded-full bg-amber-500" />
            <div className="w-5 h-1 rounded-full bg-emerald-500" />
          </div>
        </motion.div>

        {/* Single centered card */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              y: -12,
              scale: 1.04,
              boxShadow: "0 30px 60px -15px rgba(16, 185, 129, 0.25), 0 0 0 2px rgba(16, 185, 129, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-sm bg-gradient-to-b from-emerald-50/80 via-white to-teal-50/40 dark:from-emerald-950/40 dark:via-card dark:to-teal-950/20 border-2 border-emerald-200/60 dark:border-emerald-800/40 rounded-3xl overflow-hidden cursor-pointer group transition-all duration-500 hover:border-emerald-400"
          >
            {/* Top gradient strip */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

            {/* Photo */}
            <div className="pt-8 pb-3 flex justify-center relative">
              <div className="w-32 h-32 rounded-full border-4 border-emerald-300/60 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center group-hover:border-emerald-400 transition-all duration-500 group-hover:scale-110 shadow-xl group-hover:shadow-emerald-300/30">
                {member?.image_url ? (
                  <img src={member.image_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-14 h-14 text-emerald-600" />
                )}
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                className="absolute top-6 right-1/4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg"
              >
                Founder
              </motion.div>
            </div>

            {/* Name & Role */}
            <div className="text-center px-6 pb-4">
              <h3 className="font-heading font-bold text-xl text-foreground">{displayName}</h3>
              <p className="text-emerald-600 text-sm font-medium mt-1">{displayRole}</p>
              <p className="text-muted-foreground text-xs mt-1">{displayQualification}</p>
            </div>

            {/* Highlights */}
            <div className="px-6 pb-4 space-y-2.5">
              {[
                { icon: BookOpen, text: displayPointOne, color: "text-blue-500" },
                { icon: Award, text: displayPointTwo, color: "text-amber-500" },
                { icon: Users, text: "500+ Students Mentored", color: "text-emerald-500" },
              ].map(({ icon: Icon, text, color }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-emerald-100 dark:border-emerald-800/30"
                >
                  <Icon className={`w-4 h-4 ${color} shrink-0`} />
                  <span className="text-sm text-foreground">{text}</span>
                </motion.div>
              ))}
            </div>

            {/* Contact strip */}
            <div className="mx-6 mb-6 mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/40 dark:border-emerald-700/30 flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <a href={`tel:${displayMobile}`} className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {displayMobile}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DirectorSection;
