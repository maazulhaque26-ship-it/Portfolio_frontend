import { useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContext } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const { services, loading } = useContext(PortfolioContext);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!services || services.length === 0 || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Section header — label and title split reveal
      gsap.from('.services-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        x: -60, opacity: 0, duration: 0.7, ease: 'power3.out',
      });
      gsap.from('.services-title-word', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        y: 80, opacity: 0, rotationX: -40,
        duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });
      gsap.from('.services-subtitle', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 20, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.4,
      });

      // 3D card entrance — staggered from bottom with rotation
      gsap.from('.service-card-3d', {
        scrollTrigger: { trigger: '.services-grid', start: 'top 80%' },
        y: 100,
        opacity: 0,
        rotationY: (i) => (i % 2 === 0 ? -20 : 20),
        rotationX: 10,
        scale: 0.85,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      });

      // Card index numbers
      gsap.from('.service-index', {
        scrollTrigger: { trigger: '.services-grid', start: 'top 75%' },
        scale: 0, opacity: 0,
        duration: 0.5, stagger: 0.1, delay: 0.5, ease: 'back.out(2)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  // 3D tilt effect on mouse move
  const handleMouseMove = (e, cardEl) => {
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    gsap.to(cardEl, {
      rotationY: x * 12,
      rotationX: -y * 12,
      scale: 1.03,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (cardEl) => {
    gsap.to(cardEl, {
      rotationY: 0, rotationX: 0, scale: 1,
      duration: 0.7, ease: 'elastic.out(1,0.4)',
    });
  };

  if (loading) return null;

  return (
    <section ref={sectionRef} id="services" className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-28 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-olivia-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-olivia-green/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-olivia-gold/[0.04] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="services-label flex justify-center items-center gap-3 text-olivia-text-light mb-4 font-bold uppercase tracking-[0.25em] text-xs">
            <span className="w-8 h-[2px] bg-olivia-gold"></span>
            What I Do
            <span className="w-8 h-[2px] bg-olivia-gold"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold overflow-hidden">
            <span className="services-title-word inline-block">Services</span>{' '}
            <span className="services-title-word inline-block text-gradient-gold">I Provide</span>
          </h2>
          <p className="services-subtitle text-olivia-text-light mt-4 max-w-xl mx-auto text-base">
            Crafting digital experiences that blend aesthetics with functionality
          </p>
        </div>

        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 perspective-1000">
          {services && services.length > 0 ? (
            services.map((service, index) => (
              <div
                key={service?._id || index}
                className="service-card-3d preserve-3d bg-white p-8 rounded-[28px] shadow-sm border border-gray-100 cursor-hover group relative overflow-hidden card-shine"
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-olivia-gold/0 to-olivia-gold/0 group-hover:from-olivia-gold/5 group-hover:to-transparent transition-all duration-500 rounded-[28px]"></div>
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-gradient"></div>

                <div className="relative z-10">
                  {/* Index number */}
                  <div className="service-index absolute top-0 right-0 text-7xl font-serif font-black text-olivia-gold/[0.06] leading-none select-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  <div className="text-5xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    {service?.icon || '✦'}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-olivia-green transition-colors duration-300">
                    {service?.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {service?.description}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center gap-2 text-olivia-gold font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-0 group-hover:translate-x-2">
                    Learn More <span className="text-base">→</span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-olivia-gold/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400">
              No services found in database.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;