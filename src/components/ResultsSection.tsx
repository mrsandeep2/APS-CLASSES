import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, GraduationCap } from "lucide-react";

interface StudentResult {
  id: string;
  student_name: string;
  student_class: string;
  percentage: number;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  year: string;
  photo_url: string | null;
}

const placeholders: StudentResult[] = [
  { id: "p1", student_name: "Rahul Kumar", student_class: "Class 10th", percentage: 92, marks_obtained: 460, total_marks: 500, grade: "A+", year: "2024-25", photo_url: null },
  { id: "p2", student_name: "Priya Sharma", student_class: "Class 12th", percentage: 88, marks_obtained: 440, total_marks: 500, grade: "A+", year: "2024-25", photo_url: null },
  { id: "p3", student_name: "Amit Singh", student_class: "Class 10th", percentage: 85, marks_obtained: 425, total_marks: 500, grade: "A", year: "2024-25", photo_url: null },
];

const years = ["All", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26", "2026-27"];
const classFilters = ["Class 10th", "Class 12th"] as const;

const getYearStart = (year: string) => {
  const [start] = year.split("-");
  const parsed = Number.parseInt(start, 10);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
};

const sortResultsByYear = (data: StudentResult[]) => {
  return [...data].sort((a, b) => {
    const yearDiff = getYearStart(a.year) - getYearStart(b.year);
    if (yearDiff !== 0) return yearDiff;

    const marksDiff = b.marks_obtained - a.marks_obtained;
    if (marksDiff !== 0) return marksDiff;

    const percentageDiff = b.percentage - a.percentage;
    if (percentageDiff !== 0) return percentageDiff;

    return a.student_name.localeCompare(b.student_name);
  });
};

const ResultsSection = () => {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedClass, setSelectedClass] = useState<(typeof classFilters)[number]>("Class 10th");

  const fetchResults = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("student_results")
      .select("*")
      .order("year", { ascending: true })
      .order("marks_obtained", { ascending: false })
      .order("percentage", { ascending: false });

    if (data) {
      setResults(sortResultsByYear(data as StudentResult[]));
    }
  }, []);

  useEffect(() => {
    fetchResults();

    const channel = supabase
      .channel("student-results-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_results" },
        () => {
          fetchResults();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchResults]);

  const sourceData = results.length > 0 ? results : placeholders;
  const display = sourceData.filter((r) => {
    const matchesYear = selectedYear === "All" || r.year === selectedYear;
    const matchesClass = r.student_class === selectedClass;
    return matchesYear && matchesClass;
  });

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-amber-600 text-xs font-bold tracking-[0.2em] uppercase mb-3 px-4 py-1.5 rounded-full border border-amber-300/40 bg-amber-100/60">
            🏆 Our Results
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mt-3">
            <span className="text-foreground">Student </span>
            <span className="text-emerald-600">Achievements</span>
          </h2>
          <div className="flex justify-center gap-1 mt-3">
            <div className="w-10 h-1 rounded-full bg-amber-500" />
            <div className="w-5 h-1 rounded-full bg-emerald-500" />
          </div>
        </motion.div>

        {/* Class selector */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {classFilters.map((className) => (
            <button
              key={className}
              onClick={() => setSelectedClass(className)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedClass === className
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {className.replace("Class ", "")}
            </button>
          ))}
        </div>

        {/* Year selector */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedYear === y
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Student cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 max-w-6xl mx-auto">
          {display.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-b from-amber-50/80 to-white dark:from-amber-950/30 dark:to-card border-2 border-amber-200/60 dark:border-amber-800/40 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:border-amber-400 relative"
            >
              {/* Grade badge */}
              <div className="absolute top-2 right-2 z-10">
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] sm:text-xs font-bold shadow-lg">
                  {s.grade}
                </span>
              </div>

              {/* Photo area */}
              <div className="pt-4 pb-1.5 flex justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-300/60 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 flex items-center justify-center group-hover:border-amber-400 transition-all duration-300 group-hover:scale-105">
                  {s.photo_url ? (
                    <img src={s.photo_url} alt={s.student_name} className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="text-center px-3 sm:px-4 pb-1.5">
                <h3 className="font-heading font-bold text-foreground text-sm sm:text-base leading-tight">{s.student_name}</h3>
                <p className="text-amber-600 text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1 mt-1">
                  <Trophy className="w-3 h-3" /> {s.student_class}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Academic Year: <span className="font-semibold text-foreground">{s.year}</span>
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-2 sm:gap-3 px-2 sm:px-4 pb-2">
                <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-amber-100/80 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 text-center">
                  <p className="text-xs sm:text-sm font-bold text-foreground">{s.percentage}%</p>
                  <p className="text-[10px] text-muted-foreground">Percentage</p>
                </div>
                <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-amber-100/80 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 text-center">
                  <p className="text-xs sm:text-sm font-bold text-foreground">{s.marks_obtained}</p>
                  <p className="text-[10px] text-muted-foreground">out of {s.total_marks}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-3 sm:px-4 pb-3">
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {display.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            {selectedYear === "All"
              ? `No ${selectedClass} results available yet.`
              : `No ${selectedClass} results for ${selectedYear} yet.`}
          </p>
        )}
      </div>
    </section>
  );
};

export default ResultsSection;
