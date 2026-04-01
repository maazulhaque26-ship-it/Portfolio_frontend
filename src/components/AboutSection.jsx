import { useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContext } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const { isEditing, draft, profile, getImageUrl } = useContext(PortfolioContext);
  const data = isEditing ? draft?.about : profile?.about;
  const name = isEditing ? draft?.hero?.name : profile?.hero?.name;
  const avatarUrl = isEditing ? draft?.hero?.avatarUrl : profile?.hero?.avatarUrl;
  const cvUrl = isEditing ? draft?.hero?.cvUrl : profile?.hero?.cvUrl;
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!data || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Image reveal — golden overlay wipe
      gsap.from('.about-image-3d', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        scale: 0.6, opacity: 0, rotationY: -25, rotationX: 10,
        duration: 1.4, ease: 'power3.out',
      });

      // Image overlay wipe
      gsap.to('.about-img-overlay', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        scaleX: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.inOut',
        transformOrigin: 'right center',
      });

      // Floating tags stagger with depth
      gsap.from('.about-float-tag', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        scale: 0, opacity: 0, rotation: -25, y: 30,
        duration: 0.7, stagger: 0.12, ease: 'back.out(2.5)',
      });

      // Section label
      gsap.from('.about-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        x: -60, opacity: 0, duration: 0.7, ease: 'power3.out',
      });

      // Title words reveal
      gsap.from('.about-title-word', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        y: 60, opacity: 0, rotationX: -30,
        duration: 0.8, stagger: 0.1, ease: 'power3.out',
      });

      // Text content slide in with sequence
      gsap.from('.about-text', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        x: 60, opacity: 0,
        duration: 0.8, ease: 'power3.out',
      });

      // Counter animation with more drama
      sectionRef.current.querySelectorAll('.counter-value').forEach((el) => {
        const target = el.getAttribute('data-target');
        const num = parseInt(target);
        if (isNaN(num)) return;

        gsap.fromTo(el, { innerText: 0 }, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          innerText: num,
          duration: 2.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function() {
            el.innerText = Math.round(gsap.getProperty(el, 'innerText'));
            if (target.includes('+')) el.innerText += '+';
          }
        });
      });

      // Stats cards stagger
      gsap.from('.stat-card', {
        scrollTrigger: { trigger: '.stats-container', start: 'top 80%' },
        y: 40, opacity: 0, scale: 0.9,
        duration: 0.6, stagger: 0.15, ease: 'power3.out',
      });

      // CTA button
      gsap.from('.about-cta', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 50%' },
        y: 30, opacity: 0,
        duration: 0.7, ease: 'power3.out',
      });

      // Parallax on scroll for tags
      gsap.to('.about-float-tag', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
        y: (i) => (i % 2 === 0 ? -30 : 30),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (!data) return null;

  const imgSrc = avatarUrl
    ? (avatarUrl.startsWith('http') ? avatarUrl : getImageUrl(avatarUrl))
    : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2';

  return (
    <section ref={sectionRef} id="about" className="bg-gradient-to-br from-olivia-green-deep via-olivia-green to-[#1a5438] text-white py-20 sm:py-32 px-4 sm:px-6 md:px-12 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-olivia-gold/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-olivia-gold/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] border border-olivia-gold/[0.04] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

        {/* Left — 3D Image with Floating Tags */}
        <div className="about-image-3d w-full lg:w-1/2 relative flex justify-center perspective-1500">
          <div className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[440px] lg:h-[440px] relative preserve-3d">
            {/* Glow backdrop */}
            <div className="absolute inset-[-10px] bg-olivia-gold/15 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 bg-olivia-gold rounded-full transform -rotate-3 scale-[1.02]"></div>
            
            {/* Image with reveal overlay */}
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <div className="about-img-overlay absolute inset-0 bg-olivia-gold z-20 rounded-full"></div>
              <img
                src={imgSrc}
                alt="About"
                className="w-full h-full object-cover relative z-10 border-4 border-olivia-gold/20 shadow-2xl rounded-full"
              />
            </div>

            {/* Floating Tags */}
            <div className="about-float-tag absolute top-[15%] -left-4 sm:-left-8 bg-olivia-gold text-olivia-green-deep text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full rotate-[-12deg] z-20 shadow-xl glow-gold animate-float">
              UI/UX Design
            </div>
            <div className="about-float-tag absolute top-[45%] -right-4 sm:-right-10 bg-olivia-gold text-olivia-green-deep text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full rotate-[10deg] z-20 shadow-xl glow-gold animate-float-reverse">
              Website Design
            </div>
            <div className="about-float-tag hidden sm:block absolute bottom-[25%] -left-6 bg-olivia-gold text-olivia-green-deep text-xs font-bold px-4 py-2.5 rounded-full rotate-[5deg] z-20 shadow-xl glow-gold animate-float-slow">
              App Design
            </div>
            <div className="about-float-tag hidden sm:block absolute bottom-[5%] right-5 bg-olivia-gold text-olivia-green-deep text-xs font-bold px-4 py-2.5 rounded-full rotate-[-5deg] z-20 shadow-xl glow-gold animate-float">
              Branding
            </div>
          </div>
        </div>

        {/* Right — Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="about-label flex items-center gap-3 text-olivia-gold mb-2 font-bold uppercase tracking-[0.25em] text-xs">
            <span className="w-10 h-[2px] bg-gradient-to-r from-olivia-gold to-transparent"></span>
            About Me
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight overflow-hidden">
            <span className="about-title-word inline-block">Who is </span>
            <span className="about-title-word inline-block text-gradient-gold">{name || 'Your Name'}</span>
            <span className="about-title-word inline-block">?</span>
          </h2>

          <div className="about-text text-gray-300 leading-relaxed max-w-prose text-base">
            <p dangerouslySetInnerHTML={{ __html: data.bioText?.replace(/\n/g, '<br/>') || '' }} />
          </div>

          {/* Stats with counter animation */}
          <div className="stats-container grid grid-cols-3 gap-3 sm:gap-6 py-6 sm:py-8">
            <div className="stat-card text-center bg-white/[0.04] backdrop-blur-sm p-5 rounded-2xl border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-300">
              <h4 className="text-4xl font-bold text-olivia-gold mb-2">
                <span className="counter-value" data-target={String(data.projectsCompleted || '0').replace('+', '')}>0</span>
                {String(data.projectsCompleted || '').includes('+') ? '' : ''}
              </h4>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Projects</p>
            </div>
            <div className="stat-card text-center bg-white/[0.04] backdrop-blur-sm p-5 rounded-2xl border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-300">
              <h4 className="text-4xl font-bold text-olivia-gold mb-2">
                <span className="counter-value" data-target={String(data.industriesCovered || '0').replace('+', '')}>0</span>
              </h4>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Industries</p>
            </div>
            <div className="stat-card text-center bg-white/[0.04] backdrop-blur-sm p-5 rounded-2xl border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-300">
              <h4 className="text-4xl font-bold text-olivia-gold mb-2">
                <span className="counter-value" data-target={String(data.yearsExperience || '0').replace('+', '')}>0</span>
              </h4>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Years Exp.</p>
            </div>
          </div>

          <div className="about-cta flex items-center gap-6 pt-2">
            {cvUrl && (
              <a
                href={getImageUrl(cvUrl)}
                download
                className="magnetic-btn bg-transparent border-2 border-olivia-gold/50 text-white px-8 py-3.5 rounded-full hover:bg-olivia-gold hover:text-olivia-green-deep transition-all duration-300 font-semibold flex items-center gap-3 hover:scale-105 hover:shadow-lg hover:shadow-olivia-gold/20"
              >
                Download CV
                <span className="bg-white/10 w-7 h-7 rounded-full flex items-center justify-center text-xs">↓</span>
              </a>
            )}
            <div className="font-serif text-olivia-gold/30 text-3xl italic hidden md:block">
              {name || ''}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
