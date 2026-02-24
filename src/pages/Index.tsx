import { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import DashboardSection from "@/components/DashboardSection";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ParticleBackground />
      <CursorGlow />
      <Navbar onAuthOpen={() => setAuthOpen(true)} />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <DashboardSection />

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border">
        <div className="container max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold gradient-text">QuizMaster AI</span>
          <p className="text-xs text-muted-foreground">© 2026 QuizMaster AI. All rights reserved.</p>
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Index;
