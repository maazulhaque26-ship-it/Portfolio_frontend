// ============================================================
// frontend/src/pages/Home.jsx
// ============================================================
// UPDATED: Added GSAP preloader animation for the loading state
//          and smooth entry transition when content loads.
// ============================================================

import React, { useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PortfolioContext } from '../context/PortfolioContext';
import HeroSection         from '../components/HeroSection';
import BannerSection       from '../components/BannerSection';
import ServicesSection     from '../components/ServicesSection';
import AboutSection        from '../components/AboutSection';
import ToolsSection        from '../components/ToolsSection';
import ProjectsSection     from '../components/ProjectsSection';
import PricingSection      from '../components/PricingSection';
import TimelineSection     from '../components/TimelineSection';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsSection         from '../components/NewsSection';
import ContactSection      from '../components/ContactSection';
import AchievementsSection from '../components/AchievementsSection';
import Footer              from '../components/Footer';

const Home = () => {
  const context = useContext(PortfolioContext);
  const loaderRef = useRef(null);
  const contentRef = useRef(null);

  // Guard check to prevent destructuring crash
  if (!context) return null;

  const { loading, profile } = context;

  // ── Preloader animation ────────────────────────────────────
  useEffect(() => {
    if (loading && loaderRef.current) {
      const ctx = gsap.context(() => {
        // Logo entrance
        gsap.fromTo('.preloader-logo', 
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(2)' }
        );

        // Text fade in
        gsap.fromTo('.preloader-text',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: 'power3.out' }
        );

        // Continuous ring pulse
        gsap.to('.preloader-ring', {
          scale: 1.1, opacity: 0.5,
          duration: 1.2, ease: 'sine.inOut',
          yoyo: true, repeat: -1,
        });

        // Floating dots
        gsap.to('.preloader-dot', {
          y: -8, duration: 0.6, ease: 'sine.inOut',
          yoyo: true, repeat: -1, stagger: 0.15,
        });
      }, loaderRef);

      return () => ctx.revert();
    }
  }, [loading]);

  // ── Content entrance after load ────────────────────────────
  useEffect(() => {
    if (!loading && contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <div ref={loaderRef} className="min-h-screen flex flex-col items-center justify-center bg-olivia-green-deep relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-olivia-gold/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-olivia-gold/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative">
          <div className="preloader-ring absolute inset-[-15px] border-2 border-olivia-gold/20 rounded-full" />
          <div className="preloader-logo w-20 h-20 bg-olivia-gold rounded-full flex items-center justify-center font-bold text-[#0a1f14] text-3xl shadow-[0_0_40px_rgba(251,191,36,0.2)]">
            {(profile?.hero?.name || 'P').charAt(0)}
          </div>
        </div>
        <p className="preloader-text mt-6 text-white/60 font-serif font-bold text-lg tracking-wider">
          Loading Portfolio
        </p>
        <div className="flex gap-1.5 mt-3">
          <span className="preloader-dot w-1.5 h-1.5 bg-olivia-gold rounded-full" />
          <span className="preloader-dot w-1.5 h-1.5 bg-olivia-gold rounded-full" />
          <span className="preloader-dot w-1.5 h-1.5 bg-olivia-gold rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div ref={contentRef} className="relative bg-white overflow-x-hidden">
      <HeroSection />
      <BannerSection />
      <ServicesSection />
      <AboutSection />
      <ToolsSection />
      <ProjectsSection />
      <PricingSection />
      <TimelineSection />
      <TestimonialsSection />
      <NewsSection />
      <ContactSection />
      <AchievementsSection />
      <Footer />
    </div>
  );
};

export default Home;