import { useContext, useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { PortfolioContext, PortfolioProvider } from './context/PortfolioContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Home from './pages/Home';
import SecretLogin from './pages/SecretLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── Custom Cursor ──────────────────────────────────────────── */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const moveCursor = (e) => {
      gsap.to(dot, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.1, ease: 'power2.out' });
      gsap.to(ring, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.25, ease: 'power2.out' });
    };

    const addHover = () => ring.classList.add('hovered');
    const removeHover = () => ring.classList.remove('hovered');

    window.addEventListener('mousemove', moveCursor);

    const hoverables = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .cursor-hover');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    // Re-observe for dynamic elements
    const observer = new MutationObserver(() => {
      const newHoverables = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .cursor-hover');
      newHoverables.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

/* ── Cinematic Preloader ────────────────────────────────────── */
const Preloader = ({ onComplete }) => {
  const preloaderRef = useRef(null);
  const barRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(preloaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete,
        });
      },
    });

    tl.fromTo(logoRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(2)' }
    )
    .fromTo(textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    )
    .to(barRef.current, {
      width: '100%',
      duration: 1.2,
      ease: 'power2.inOut',
    }, '-=0.2')
    .to(logoRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
  }, [onComplete]);

  return (
    <div ref={preloaderRef} className="preloader">
      <div ref={logoRef} className="preloader-logo">✦</div>
      <div className="preloader-bar-track">
        <div ref={barRef} className="preloader-bar-fill" />
      </div>
      <p ref={textRef} className="preloader-text">Loading Portfolio</p>
    </div>
  );
};

/* ── Premium Glassmorphic Navbar ─────────────────────────── */
const Navbar = () => {
  const { profile } = useContext(PortfolioContext);
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sections = ['home', 'services', 'about', 'projects', 'blogs', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Navbar entrance animation
  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      gsap.to(window, { duration: 1.2, scrollTo: { y: el, offsetY: 80 }, ease: 'power3.inOut' });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'blogs', label: 'Blogs' },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 px-4 md:px-12 glass-dark shadow-2xl'
          : 'py-6 px-4 md:px-12 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-hover" onClick={() => scrollTo('home')}>
          <div className="w-10 h-10 bg-olivia-gold rounded-full flex items-center justify-center font-bold text-black text-xl relative group-hover:scale-110 transition-transform duration-300 glow-gold">
            {(profile?.hero?.name || 'A').charAt(0)}
            <div className="absolute inset-0 bg-olivia-gold rounded-full animate-ping opacity-20"></div>
          </div>
          <span className="font-bold text-xl tracking-wide text-white">{profile?.hero?.name || 'Portfolio'}</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-1 bg-white/5 backdrop-blur-xl px-2 py-1.5 rounded-full border border-white/10">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`relative px-5 py-2 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-300 cursor-hover ${
                activeSection === link.id
                  ? 'bg-olivia-gold text-black font-bold shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo('contact')}
          className="hidden md:flex magnetic-btn bg-white text-olivia-green-deep font-bold px-6 py-2.5 rounded-full hover:bg-olivia-gold hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-olivia-gold/20 hover:scale-105 items-center gap-2"
        >
          Contact Me
          <span className="w-5 h-5 bg-olivia-green rounded-full flex items-center justify-center text-white text-[10px]">→</span>
        </button>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full glass-dark transition-all duration-500 overflow-hidden ${mobileOpen ? 'max-h-96 py-6' : 'max-h-0 py-0'}`}>
        <div className="flex flex-col items-center gap-4 px-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`w-full text-center py-3 rounded-xl text-sm uppercase tracking-wider font-medium transition-all ${
                activeSection === link.id
                  ? 'bg-olivia-gold text-black font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            className="w-full bg-olivia-gold text-black font-bold py-3 rounded-xl"
          >
            Contact Me
          </button>
        </div>
      </div>
    </nav>
  );
};

/* ── App Content ─────────────────────────────────────────── */
const AppContent = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [preloaderDone, setPreloaderDone] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-olivia-green-deep">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-olivia-gold/30 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-olivia-gold border-t-transparent rounded-full animate-spin absolute inset-0"></div>
        </div>
        <p className="mt-6 text-olivia-gold/60 text-sm font-bold uppercase tracking-[0.3em]">
          Verifying session...
        </p>
      </div>
    );
  }

  return (
    <div className="relative font-sans">
      {/* Noise Overlay for premium texture */}
      <div className="noise-overlay" />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Preloader */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      <Routes>
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route
          path="/authenticate-master"
          element={<AdminDashboard />}
        />
        <Route
          path="/authmaster"
          element={<AdminDashboard />}
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;