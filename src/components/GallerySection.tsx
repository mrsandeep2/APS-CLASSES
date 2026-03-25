import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

const categories = ["All", "Test", "Cultural", "Academics", "Events"];

interface GalleryImage {
  id: string;
  image_url: string;
  category: string;
  title: string | null;
}

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await (supabase as any)
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12);
      if (data) setImages(data as GalleryImage[]);
    };
    fetchImages();
  }, []);

  const filtered = activeCategory === "All"
    ? images
    : images.filter((img) => img.category === activeCategory);

  // Placeholder images when DB is empty
  const placeholders: GalleryImage[] = [
    { id: "p1", image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=400&fit=crop", category: "Academics", title: "Classroom Session" },
    { id: "p2", image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop", category: "Cultural", title: "Annual Function" },
    { id: "p3", image_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop", category: "Academics", title: "Science Lab" },
    { id: "p4", image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop", category: "Events", title: "Prize Distribution" },
    { id: "p5", image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", category: "Test", title: "Examination Hall" },
    { id: "p6", image_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop", category: "Cultural", title: "Holi Celebration" },
  ];

  const displayImages = images.length > 0 ? filtered : (
    activeCategory === "All" ? placeholders : placeholders.filter((p) => p.category === activeCategory)
  );

  return (
    <section id="gallery" className="py-16 md:py-24 bg-muted/30 scroll-mt-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-3 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5">
            ✨ Gallery
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-foreground mt-3" style={{ lineHeight: 1.15 }}>
            Life at Our Institute
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Capturing moments of excellence, creativity, and celebration
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex justify-center flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {displayImages.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setLightbox(img.image_url)}
                className={`relative rounded-xl overflow-hidden cursor-pointer group ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img
                  src={img.image_url}
                  alt={img.title || "Gallery"}
                  className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {img.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{img.title}</p>
                    <p className="text-white/60 text-xs">{img.category}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {displayImages.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No images in this category yet.</p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
              onClick={() => setLightbox(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={lightbox}
              alt="Gallery"
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
