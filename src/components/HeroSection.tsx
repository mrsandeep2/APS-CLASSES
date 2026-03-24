import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

import banner1 from "@/assets/hero-banner-1.jpg";
import banner2 from "@/assets/hero-banner-2.jpg";
import banner3 from "@/assets/hero-banner-3.jpg";
import banner4 from "@/assets/hero-banner-4.jpg";
import banner5 from "@/assets/hero-banner-5.jpg";

interface HeroBannerSlide {
  id?: string;
  image: string;
}

const defaultSlides: HeroBannerSlide[] = [
  {
    image: banner1,
  },
  {
    image: banner2,
  },
  {
    image: banner3,
  },
  {
    image: banner4,
  },
  {
    image: banner5,
  },
];

const normalizeHeroImageUrl = (url: string) => {
  if (!url) return url;

  // Convert legacy absolute local URLs to deployment-safe path URLs.
  const marker = "/hero-import/";
  const markerIndex = url.indexOf(marker);
  if (markerIndex >= 0) {
    return url.slice(markerIndex);
  }

  return url;
};

const HeroSection = () => {
  const [slides, setSlides] = useState<HeroBannerSlide[]>(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch hero banners from database
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from("hero_banners")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Failed to fetch hero banners:", error);
          setSlides(defaultSlides);
        } else if (data && data.length > 0) {
          // Convert database banners to slide format
          const dbSlides = data.map((banner) => ({
            id: banner.id,
            image: normalizeHeroImageUrl(banner.image_url),
          }));
          setSlides(dbSlides);
        } else {
          // Fallback to default slides if no active banners in database
          setSlides(defaultSlides);
        }
      } catch (err) {
        console.error("Error loading hero banners:", err);
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (loading || slides.length === 0) {
    return (
      <section className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="relative w-full aspect-[16/9] overflow-hidden">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <img
            src={slide.image}
            alt="Hero banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/55 active:scale-95 transition-all"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/55 active:scale-95 transition-all"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </section>
  );
};

export default HeroSection;
