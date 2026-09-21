import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { PortfolioSection } from '@/components/PortfolioSection';
import { FeedbackSection } from '@/components/FeedbackSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { ProjectModal } from '@/components/ProjectModal';
import { AuthModal } from '@/components/AuthModal';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-[#0f2b48] selection:text-white">
      {/* Sticky Classic Top Navigation */}
      <Navbar />

      {/* 1. Hero / Home Section */}
      <HeroSection />

      {/* 2. About Me Section */}
      <AboutSection />

      {/* 3. Portfolio Section (Curated Preview with CTA to /portfolio) */}
      <PortfolioSection previewMode={true} />

      {/* 5. Login + Feedback Feature */}
      <FeedbackSection />

      {/* 4. Contact Section */}
      <ContactSection />

      {/* Minimal Timeless Footer */}
      <Footer />

      {/* Modals */}
      <ProjectModal />
      <AuthModal />
    </main>
  );
}
