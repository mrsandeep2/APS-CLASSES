import NoticeBar from "@/components/NoticeBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import ResultsSection from "@/components/ResultsSection";
import CoachingSection from "@/components/CoachingSection";
import AdmissionSection from "@/components/AdmissionSection";
import DirectorSection from "@/components/DirectorSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollSection from "@/components/ScrollSection";

const Index = () => (
  <div className="min-h-screen pt-[30px]">
    <NoticeBar />
    <Header />
    <div className="pt-[76px]">
      <HeroSection />
      <ScrollSection direction="up">
        <StatsSection />
      </ScrollSection>
      <ScrollSection direction="left">
        <AboutSection />
      </ScrollSection>
      <ScrollSection direction="zoom">
        <GallerySection />
      </ScrollSection>
      <ScrollSection direction="right">
        <ResultsSection />
      </ScrollSection>
      <ScrollSection direction="rotate">
        <CoachingSection />
      </ScrollSection>
      <ScrollSection direction="left">
        <AdmissionSection />
      </ScrollSection>
      <ScrollSection direction="zoom">
        <DirectorSection />
      </ScrollSection>
      <ScrollSection direction="up">
        <TestimonialsSection />
      </ScrollSection>
      <ScrollSection direction="right">
        <ContactSection />
      </ScrollSection>
      <Footer />
    </div>
  </div>
);

export default Index;
