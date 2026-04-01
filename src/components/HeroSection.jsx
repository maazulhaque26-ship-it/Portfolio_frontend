import React, { useContext, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContext } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

/* ── Floating Particles Background ──────────────────────── */
const Particles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 4,
      opacity: Math.random() * 0.4 + 0.1,
    })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle bg-olivia-gold"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

/* ── Animated Grid Lines (Background) ───────────────────── */
const GridLines = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03]">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={`v-${i}`}
        className="absolute top-0 bottom-0 w-px bg-olivia-gold"
        style={{ left: `${(i + 1) * (100 / 7)}%` }}
      />
    ))}
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={`h-${i}`}
        className="absolute left-0 right-0 h-px bg-olivia-gold"
        style={{ top: `${(i + 1) * (100 / 5)}%` }}
      />
    ))}
  </div>
);

const HeroSection = () => {
  const { profile, loading, getImageUrl } = useContext(PortfolioContext);
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.8 }); // wait for preloader

      // Label entrance
      tl.from('.hero-label', {
        x: -80, opacity: 0, duration: 0.8, ease: 'power3.out',
      })
      // Character-by-character name reveal
      .from('.hero-name-char', {
        y: 120, opacity: 0, rotationX: -90,
        duration: 0.7, stagger: 0.04, ease: 'power3.out',
        transformOrigin: 'bottom center',
      }, '-=0.4')
      // Badge pops in
      .from('.hero-badge', {
        scale: 0, opacity: 0, rotation: -10,
        duration: 0.6, ease: 'back.out(3)',
      }, '-=0.2')
      // Headline slides up with clip
      .from('.hero-headline', {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      }, '-=0.2')
      // Bio fades in
      .from('.hero-bio', {
        y: 20, opacity: 0, duration: 0.7, ease: 'power3.out',
      }, '-=0.3')
      // CTAs stagger in
      .from('.hero-cta', {
        y: 30, opacity: 0, scale: 0.9,
        duration: 0.6, stagger: 0.15, ease: 'power3.out',
      }, '-=0.3')
      // Social indicators
      .from('.hero-scroll-indicator', {
        opacity: 0, y: 30,
        duration: 0.6, ease: 'power3.out',
      }, '-=0.2');

      // Avatar fade-in entrance (no movement)
      tl.from('.hero-avatar-wrapper', {
        opacity: 0,
        scale: 0.95,
        duration: 1.6,
        ease: 'power2.out',
      }, 1.8);

      // Subtle breathing glow pulse (no position change)
      gsap.to('.hero-avatar-glow', {
        opacity: 0.25,
        scale: 1.08,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Avatar glow ring rotation
      gsap.to('.hero-glow-ring', {
        rotation: 360,
        duration: 20,
        ease: 'none',
        repeat: -1,
      });

      gsap.to('.hero-text-content', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: -60,
        opacity: 0.2,
      });

      // Grid lines parallax
      gsap.to('.hero-grid-lines', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
        y: -50,
        opacity: 0,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  // Mouse-tracking removed — static profile picture

  if (loading) {
    return (
      <div className="min-h-screen bg-olivia-green-deep flex items-center justify-center text-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-olivia-gold/30 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-olivia-gold border-t-transparent rounded-full animate-spin absolute inset-0"></div>
        </div>
      </div>
    );
  }

  const hero = profile?.hero || {};
  const nameChars = (hero.name || 'Your Name').split('');

  return (
    <section
      id="home"
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-olivia-green-deep via-olivia-green to-[#1a5438] text-white flex items-center py-16 sm:py-20 pt-28 sm:pt-32 px-4 sm:px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background effects */}
      <Particles />
      <div className="hero-grid-lines"><GridLines /></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-olivia-gold opacity-[0.04] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-olivia-gold opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-olivia-gold/5 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-olivia-gold/5 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-olivia-gold/[0.03] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left — Text Content */}
          <div ref={textRef} className="hero-text-content w-full lg:w-1/2 space-y-6">
            <div className="hero-label flex items-center gap-3 text-olivia-gold font-bold uppercase tracking-[0.25em] text-xs">
              <span className="w-10 h-[2px] bg-gradient-to-r from-olivia-gold to-transparent inline-block"></span>
              Hello, I'm
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-black leading-none perspective-1000">
              <span className="inline-flex overflow-hidden">
                {nameChars.map((char, i) => (
                  <span key={i} className="hero-name-char inline-block" style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </h1>

            {hero.yearsExp && (
              <div className="hero-badge inline-flex items-center gap-2 bg-olivia-gold/10 border border-olivia-gold/30 text-olivia-gold px-5 py-2.5 rounded-full text-sm font-bold backdrop-blur-sm">
                <span className="w-2 h-2 bg-olivia-gold rounded-full animate-pulse"></span>
                {hero.yearsExp} Years Experience
              </div>
            )}

            {hero.headline && (
              <p className="hero-headline text-lg sm:text-xl md:text-2xl text-white/80 font-medium leading-relaxed">
                {hero.headline}
              </p>
            )}

            {hero.bio && (
              <p className="hero-bio text-white/50 leading-relaxed max-w-md text-base">
                {hero.bio}
              </p>
            )}

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4">
              {hero.cvUrl && (
                <a
                  href={getImageUrl(hero.cvUrl)}
                  className="hero-cta magnetic-btn bg-olivia-gold text-black px-8 py-4 rounded-full font-bold hover:bg-white hover:shadow-lg hover:shadow-olivia-gold/30 transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
                  download
                >
                  Download CV
                  <span className="w-6 h-6 bg-black/10 rounded-full flex items-center justify-center text-sm group-hover:bg-black/20 transition-colors">↓</span>
                </a>
              )}
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="hero-cta magnetic-btn border-2 border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 hover:border-olivia-gold/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                Contact Me
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-indicator flex items-center gap-3 pt-8">
              <div className="w-5 h-9 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
                <div className="w-1 h-2 bg-olivia-gold rounded-full animate-bounce"></div>
              </div>
              <span className="text-white/30 text-xs font-medium uppercase tracking-widest">Scroll Down</span>
            </div>
          </div>

          {/* Right — 3D Avatar */}
          <div className="w-full lg:w-1/2 flex justify-center perspective-2000">
            <div className="hero-avatar-wrapper relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px]">
              {/* Glow rings */}
              <div className="hero-avatar-glow absolute inset-[-20px] bg-olivia-gold/10 rounded-full blur-2xl"></div>
              <div className="hero-glow-ring absolute inset-[-10px] border border-olivia-gold/20 rounded-full" style={{ borderStyle: 'dashed' }}></div>
              <div className="absolute inset-[-30px] border border-olivia-gold/10 rounded-full animate-float-slow"></div>
              <div className="absolute inset-[-50px] border border-olivia-gold/5 rounded-full"></div>

              {/* Avatar */}
              <img
                src={hero.avatarUrl ? getImageUrl(hero.avatarUrl) : `https://ui-avatars.com/api/?name=${encodeURIComponent(hero.name || 'O')}&background=c9a84c&color=1a3c2b&size=420&bold=true`}
                alt={hero.name || 'Portfolio'}
                className="w-full h-full object-cover rounded-full relative z-10 border-4 border-olivia-gold/30 shadow-2xl"
              />

              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-6 h-6 bg-olivia-gold rounded-full animate-float opacity-60 z-20 glow-gold"></div>
              <div className="absolute -bottom-2 -left-6 w-4 h-4 bg-olivia-gold rounded-full animate-float-reverse opacity-40 z-20"></div>
              <div className="absolute top-1/2 -right-8 w-3 h-3 bg-white rounded-full animate-float-slow opacity-30 z-20"></div>
              <div className="absolute top-[25%] -left-10 w-2.5 h-2.5 bg-olivia-gold-light rounded-full animate-float opacity-50 z-20"></div>
              
              {/* Status badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 bg-olivia-green-deep/90 backdrop-blur-md text-olivia-gold text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full border border-olivia-gold/20 shadow-lg whitespace-nowrap">
                ● Available for Work
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Wave Divider */}
      <div className="wave-divider">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0,60 C300,0 900,60 1200,0 L1200,60 Z" fill="#f9fafb" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;