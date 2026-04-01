import { useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContext } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection = () => {
  const { projects, loading, getImageUrl } = useContext(PortfolioContext);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (loading || !projects || projects.length === 0 || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header label
      gsap.from('.projects-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        x: -60, opacity: 0, duration: 0.7, ease: 'power3.out',
      });

      // Title words stagger
      gsap.from('.projects-title-word', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        y: 80, opacity: 0, rotationX: -40,
        duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });

      // Cards: image reveal with overlay wipe + staggered entrance
      gsap.from('.project-card-3d', {
        scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' },
        y: 100, opacity: 0, scale: 0.9,
        duration: 1, stagger: 0.2, ease: 'power3.out',
      });

      // Image overlay wipes
      gsap.to('.project-img-overlay', {
        scrollTrigger: { trigger: '.projects-grid', start: 'top 75%' },
        scaleX: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.inOut',
        transformOrigin: 'right center',
      });

      // Tech tags cascade
      gsap.from('.project-tag', {
        scrollTrigger: { trigger: '.projects-grid', start: 'top 70%' },
        scale: 0, opacity: 0,
        duration: 0.4, stagger: 0.05, delay: 0.5, ease: 'back.out(2)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects, loading]);

  // 3D tilt on mouse
  const handleTilt = (e, el) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    gsap.to(el, {
      rotationY: x * 10, rotationX: -y * 10,
      scale: 1.02,
      boxShadow: `${-x * 25}px ${y * 25}px 50px rgba(0,0,0,0.12)`,
      duration: 0.4, ease: 'power2.out',
    });
  };
  const resetTilt = (el) => {
    gsap.to(el, {
      rotationY: 0, rotationX: 0, scale: 1,
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      duration: 0.7, ease: 'elastic.out(1,0.4)',
    });
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gray-50 flex justify-center items-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-olivia-gold/30 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-olivia-gold border-t-transparent rounded-full animate-spin absolute inset-0"></div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="projects" className="py-20 sm:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-80 h-80 bg-olivia-green/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-olivia-gold/[0.04] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-20">
          <div className="projects-label flex items-center gap-3 text-olivia-text-light mb-4 font-bold uppercase tracking-[0.25em] text-xs">
            <span className="w-10 h-[2px] bg-gradient-to-r from-olivia-gold to-transparent"></span>
            Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 overflow-hidden">
            <span className="projects-title-word inline-block">My Latest</span>{' '}
            <span className="projects-title-word inline-block text-gradient-gold">Projects</span>
          </h2>
        </div>

        {!projects || projects.length === 0 ? (
          <div className="text-center text-gray-400 py-16 border-2 border-dashed border-gray-200 rounded-3xl">
            <p className="text-lg">No projects found.</p>
          </div>
        ) : (
          <div className="projects-grid grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 perspective-1000">
            {projects.map((project, index) => (
              <div
                key={project._id || index}
                className="project-card-3d bg-white rounded-[28px] p-6 shadow-md border border-gray-100 preserve-3d cursor-hover group card-shine"
                onMouseMove={(e) => handleTilt(e, e.currentTarget)}
                onMouseLeave={(e) => resetTilt(e.currentTarget)}
              >
                {/* Image with reveal overlay */}
                <div className="w-full h-[200px] sm:h-[260px] bg-gray-100 rounded-2xl overflow-hidden mb-6 relative img-reveal">
                  <div className="project-img-overlay absolute inset-0 bg-olivia-gold z-20"></div>
                  <img
                    src={getImageUrl(project.imageUrl)}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  
                  {/* Project number */}
                  <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm text-olivia-green-deep font-bold text-xs px-3 py-1.5 rounded-full">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-2 group-hover:text-olivia-green transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm mb-5 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag, ti) => (
                      <span key={ti} className="project-tag text-[10px] font-bold uppercase tracking-wider bg-olivia-gray text-olivia-text-light px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  {project.liveViewUrl && (
                    <a
                      href={project.liveViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase py-2.5 px-5 bg-olivia-green text-white rounded-full hover:bg-olivia-gold hover:text-black transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                      Live Preview
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase py-2.5 px-5 border border-gray-200 rounded-full hover:border-olivia-gold hover:text-olivia-gold transition-all duration-300 hover:scale-105"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;