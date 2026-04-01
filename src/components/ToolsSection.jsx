import { useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContext } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

/* ── SVG Progress Ring ──────────────────────────────────── */
const ProgressRing = ({ percentage, size = 90 }) => {
  const ringRef = useRef(null);
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = parseInt(percentage) || 0;
  const offset = circumference - (pct / 100) * circumference;

  useEffect(() => {
    if (!ringRef.current) return;
    gsap.fromTo(ringRef.current, {
      strokeDashoffset: circumference,
    }, {
      scrollTrigger: { trigger: ringRef.current, start: 'top 85%' },
      strokeDashoffset: offset,
      duration: 1.5,
      ease: 'power3.out',
    });
  }, [circumference, offset]);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(251,191,36,0.1)" strokeWidth="4"
      />
      <circle
        ref={ringRef}
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#FBBF24" strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
      />
    </svg>
  );
};

const ToolsSection = () => {
  const { tools, loading, getImageUrl } = useContext(PortfolioContext);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!tools || tools.length === 0 || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header
      gsap.from('.tools-header > *', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      });

      // Tool cards with 3D rotation entrance
      gsap.from('.tool-item-3d', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        scale: 0, opacity: 0,
        rotationY: (i) => (i % 2 === 0 ? 90 : -90),
        duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [tools]);

  if (loading) return null;

  const defaultTools = [
    { name: 'Figma', percentage: '98%', icon: 'F' },
    { name: 'Sketch', percentage: '92%', icon: 'S' },
    { name: 'Photoshop', percentage: '90%', icon: 'P' },
    { name: 'Illustrator', percentage: '88%', icon: 'Ai' },
    { name: 'InDesign', percentage: '90%', icon: 'Id' },
    { name: 'InVision', percentage: '95%', icon: 'In' },
  ];

  const displayTools = tools && tools.length > 0 ? tools : defaultTools;

  return (
    <section ref={sectionRef} id="tools" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-olivia-gold/[0.03] rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center">
        <div className="tools-header mb-16">
          <div className="flex justify-center items-center gap-3 text-olivia-text-light mb-3 font-bold uppercase tracking-[0.2em] text-xs">
            <span className="w-8 h-[2px] bg-olivia-gold" />
            My Favorite Tools
            <span className="w-8 h-[2px] bg-olivia-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-olivia-text">
            <span className="text-gradient-gold">Exploring</span> the Tools
            <br />
            Behind My Designs
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-10 md:gap-14 perspective-1000">
          {displayTools.map((tool, index) => {
            const iconSrc = tool.imageUrl ? getImageUrl(tool.imageUrl) : null;
            const pct = parseInt(tool.percentage) || 0;

            return (
              <div
                key={tool._id || index}
                className="tool-item-3d flex flex-col items-center group cursor-pointer preserve-3d"
              >
                {/* Ring + Icon container */}
                <div className="relative w-[100px] h-[100px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <ProgressRing percentage={tool.percentage} size={100} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-xl text-olivia-green border border-gray-100 overflow-hidden group-hover:shadow-olivia-gold/20 group-hover:shadow-xl transition-shadow duration-300">
                      {iconSrc ? (
                        <img src={iconSrc} alt={tool.name} className="w-8 h-8 object-contain" />
                      ) : (
                        tool.icon || '✦'
                      )}
                    </div>
                  </div>
                </div>

                {/* Percentage */}
                <h4 className="font-bold text-2xl text-olivia-text mt-3 group-hover:text-olivia-gold transition-colors duration-300">
                  {tool.percentage}
                </h4>
                <p className="mt-1 text-olivia-text-light font-medium text-sm">
                  {tool.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;