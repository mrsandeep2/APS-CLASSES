import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notice {
  id: string;
  text: string;
}

const NoticeBar = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data } = await (supabase as any)
        .from("notices")
        .select("id, text")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setNotices(data as Notice[]);
    };
    fetchNotices();
  }, []);

  const displayTexts = notices.length > 0
    ? notices.map((n) => n.text)
    : [
        "📢 Admissions Open for 2025-26 Session — Nursery to 12th — Contact: 7070422574",
        "🎓 Get Admission in LPU, Galgotias, Parul, TMU & More Top Universities",
        "📚 APS Classes — Quality Education by Munna Sir — Jagdishpur, West Champaran",
      ];

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-gray-900 py-1.5 overflow-hidden z-[110]">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-3 flex items-center gap-1.5 border-r border-white/20">
          <Megaphone className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold uppercase tracking-wider hidden sm:inline">Notice</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
            {displayTexts.map((t, i) => (
              <span key={i} className="text-xs sm:text-sm font-medium">{t}</span>
            ))}
            {/* Duplicate for seamless loop */}
            {displayTexts.map((t, i) => (
              <span key={`dup-${i}`} className="text-xs sm:text-sm font-medium">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBar;
