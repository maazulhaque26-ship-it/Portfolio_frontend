import { useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContext } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

const BannerSection = () => {
  const marqueeRef1 = useRef(null);
  const marqueeRef2 = useRef(null);
  const sectionRef = useRef(null);
  const { marqueeItems } = useContext(PortfolioContext);

  // Use context data or fallback
  const items = marqueeItems && marqueeItems.length > 0
    ? marqueeItems
    : ['App Design', 'Website Design', 'Dashboard', 'Wireframe', 'UI/UX Design'];

  // Double items for seamless loop
  const doubledItems = [...items, ...items];

  useEffect(() => {
    if (!marqueeRef1.current || !marqueeRef2.current) return;

    const ctx = gsap.context(() => {
      // Forward marquee
      gsap.to(marqueeRef1.current.querySelector('.marquee-track'), {
        xPercent: -50,
        ease: 'none',
        duration: 20,
        repeat: -1,
      });

      // Reverse marquee
      gsap.fromTo(marqueeRef2.current.querySelector('.marquee-track'), {
        xPercent: -50,
      }, {
        xPercent: 0,
        ease: 'none',
        duration: 25,
        repeat: -1,
      });

      // 3D skew on scroll
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        rotationZ: 0.5,
        ease: 'none',
      });
    });

    return () => ctx.revert();
  }, [marqueeItems]);

  return (
    <div ref={sectionRef} className="relative z-20 py-4 bg-white overflow-hidden">
      {/* Primary Strip — Gold */}
      <div
        ref={marqueeRef1}
        className="bg-gradient-to-r from-olivia-gold via-yellow-400 to-olivia-gold py-3 sm:py-5 overflow-hidden whitespace-nowrap transform -skew-y-[1.5deg] w-[110%] -ml-[5%] shadow-xl border-y-2 border-yellow-500/30 relative group"
      >
        <div className="marquee-track flex items-center gap-6 sm:gap-10 text-base sm:text-2xl font-bold text-olivia-green-deep px-4 will-change-transform">
          {doubledItems.map((item, index) => (
            <span
              key={`fwd-${index}`}
              className="flex items-center gap-6 sm:gap-10 uppercase tracking-wider hover:text-olivia-green transition-colors duration-300 cursor-default shrink-0"
            >
              <span className="hover:scale-110 transition-transform duration-300">{item}</span>
              <span className="text-olivia-green/40 text-3xl">✺</span>
            </span>
          ))}
        </div>
      </div>

      {/* Secondary Strip — Dark Green (reverse direction) */}
      <div
        ref={marqueeRef2}
        className="bg-olivia-green-deep py-3 sm:py-4 overflow-hidden whitespace-nowrap transform skew-y-[1.5deg] w-[110%] -ml-[5%] shadow-xl border-y border-olivia-gold/10 -mt-2 relative"
      >
        <div className="marquee-track flex items-center gap-6 sm:gap-10 text-sm sm:text-lg font-semibold text-olivia-gold/70 px-4 will-change-transform">
          {doubledItems.map((item, index) => (
            <span
              key={`rev-${index}`}
              className="flex items-center gap-10 uppercase tracking-[0.2em] shrink-0"
            >
              <span className="text-olivia-gold/50">{item}</span>
              <span className="text-olivia-gold/20 text-xl">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
