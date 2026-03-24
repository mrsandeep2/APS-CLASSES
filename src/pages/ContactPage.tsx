import NoticeBar from "@/components/NoticeBar";
import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const ContactPage = () => (
  <div className="min-h-screen pt-[30px]">
    <NoticeBar />
    <Header />
    <div className="pt-[56px]">
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary via-primary/95 to-primary/80 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/4 right-[18%] w-20 h-20 rounded-full bg-secondary/25 blur-md" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-secondary font-medium text-sm tracking-widest uppercase mb-2">Reach Out</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold text-primary-foreground font-heading">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-primary-foreground/60 mt-3 max-w-lg mx-auto">We'd love to hear from you. Get in touch today!</motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full"><path d="M0 30L120 25C240 20 480 10 720 15C960 20 1200 40 1320 45L1440 50V60H0V30Z" fill="hsl(210 33% 98%)" /></svg>
        </div>
      </section>
      <ContactSection />
      <Footer />
    </div>
  </div>
);

export default ContactPage;
