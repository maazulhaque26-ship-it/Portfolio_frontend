import { useState, useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContext } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

const NewsSection = () => {
  const sectionRef = useRef(null);
  const { API } = useContext(PortfolioContext);
  const [news,    setNews]    = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBase = API;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res  = await fetch(`${apiBase}/api/blogs`);
        const data = await res.json();
        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('[NewsSection]', err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [apiBase]);

  useEffect(() => {
    if (!news.length || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Header
      gsap.from('.news-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        x: -60, opacity: 0, duration: 0.7, ease: 'power3.out',
      });
      gsap.from('.news-title-word', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        y: 80, opacity: 0, rotationX: -40,
        duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });

      // Cards staggered entrance with scale + blur
      gsap.from('.news-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 80, opacity: 0, scale: 0.9,
        duration: 0.9, stagger: 0.15, ease: 'power3.out',
      });

      // Image overlays wipe
      gsap.to('.news-img-overlay', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        scaleX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.inOut',
        transformOrigin: 'right center',
      });

      // Category tags pop in
      gsap.from('.news-tag', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        scale: 0, opacity: 0,
        duration: 0.4, stagger: 0.05, delay: 0.5, ease: 'back.out(2)',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [news]);

  const getImgSrc = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <section ref={sectionRef} id="blogs" className="py-20 sm:py-32 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-olivia-gold/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-olivia-green/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-12 sm:mb-20">
          <div>
            <div className="news-label flex items-center gap-3 text-olivia-text-light mb-4 font-bold uppercase tracking-[0.25em] text-xs">
              <span className="w-10 h-[2px] bg-gradient-to-r from-olivia-gold to-transparent" />
              News & Blogs
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-olivia-text overflow-hidden">
              <span className="news-title-word inline-block">Our Latest</span>{' '}
              <span className="news-title-word inline-block text-gradient-gold">News & Blogs</span>
            </h2>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-olivia-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Cards */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {news.map((item, index) => {
              const imgSrc = getImgSrc(item.imageUrl);
              return (
                <div key={item._id || index} className="news-card group cursor-hover">
                  <div className="w-full h-[200px] sm:h-[250px] rounded-[20px] sm:rounded-[28px] overflow-hidden mb-6 shadow-md border border-gray-100 bg-gray-100 relative img-reveal">
                    <div className="news-img-overlay absolute inset-0 bg-olivia-gold z-20"></div>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mb-4">
                    <span className="news-tag bg-olivia-gold text-black font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {item.category || 'General'}
                    </span>
                    <span className="news-tag bg-olivia-gold/10 text-olivia-text-light font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-serif text-olivia-text group-hover:text-olivia-gold transition-colors duration-300 mb-3 line-clamp-2 leading-relaxed">
                    {item.title}
                  </h3>
                  <p className="text-olivia-text-light text-sm line-clamp-2 mb-5">
                    {item.content}
                  </p>
                  <span className="text-olivia-text font-bold text-xs uppercase tracking-widest group-hover:text-olivia-gold transition-colors hover-underline inline-block">
                    Read More →
                  </span>
                </div>
              );
            })}

            {news.length === 0 && (
              <div className="col-span-3 text-center text-gray-400 py-10 border-2 border-dashed border-gray-200 rounded-3xl">
                No articles published yet.
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

export default NewsSection;