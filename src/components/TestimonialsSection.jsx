import { useState, useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContext } from '../context/PortfolioContext';
import { AuthContext } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTest, setNewTest] = useState({ clientName: '', role: '', text: '', rating: 5, imageUrl: '' });
  const sectionRef = useRef(null);
  const { isEditing, API, getImageUrl } = useContext(PortfolioContext);
  const { user } = useContext(AuthContext);

  const apiBase = API;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${apiBase}/api/testimonials`);
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTestimonials();
  }, [apiBase]);

  useEffect(() => {
    if (testimonials.length === 0 || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Header
      gsap.from('.testimonials-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        x: -60, opacity: 0, duration: 0.7, ease: 'power3.out',
      });
      gsap.from('.testimonials-title-word', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        y: 80, opacity: 0, rotationX: -40,
        duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });

      // Cards staggered with 3D rotation
      gsap.from('.testimonial-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 80, opacity: 0, scale: 0.9,
        rotationY: (i) => (i % 2 === 0 ? -10 : 10),
        duration: 0.9, stagger: 0.15, ease: 'power3.out',
      });

      // Star ratings cascade
      gsap.from('.star-rating', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        scale: 0, opacity: 0,
        duration: 0.4, stagger: 0.05, delay: 0.5, ease: 'back.out(3)',
      });

      // Quote marks pop
      gsap.from('.quote-mark', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        scale: 0, rotation: -30,
        duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'back.out(2)',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [testimonials]);

  // 3D tilt on cards
  const handleTilt = (e, el) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    gsap.to(el, {
      rotationY: x * 8, rotationX: -y * 8,
      scale: 1.02,
      duration: 0.4, ease: 'power2.out',
    });
  };
  const resetTilt = (el) => {
    gsap.to(el, {
      rotationY: 0, rotationX: 0, scale: 1,
      duration: 0.6, ease: 'elastic.out(1,0.4)',
    });
  };

  const removeTestimonial = async (id) => {
    if(!confirm('Delete this testimonial?')) return;
    try {
      const token = user?.token;
      const res = await fetch(`${apiBase}/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTestimonials(prev => prev.filter(t => t._id !== id));
    } catch (err) { console.error(err); }
  };

  const submitTestimonial = async (e) => {
    e.preventDefault();
    try {
      const token = user?.token;
      const res = await fetch(`${apiBase}/api/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTest)
      });
      if (res.ok) {
        const added = await res.json();
        setTestimonials([...testimonials, added]);
        setShowModal(false);
        setNewTest({ clientName: '', role: '', text: '', rating: 5, imageUrl: '' });
      }
    } catch(err) { console.error(err); }
  };

  const getTestimonialImg = (url) => {
    if (!url) return 'https://ui-avatars.com/api/?background=FBBF24&color=0d2a1e&bold=true&size=100';
    if (url.startsWith('http')) return url;
    return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <section ref={sectionRef} id="testimonials" className="py-20 sm:py-32 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-olivia-gold/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-olivia-green/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Internal Master Modal */}
      {showModal && isEditing && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold font-serif mb-6 text-olivia-text">Add Testimonial</h3>
            <form onSubmit={submitTestimonial} className="space-y-4">
              <input required type="text" placeholder="Client Name" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-olivia-gold focus:outline-none" value={newTest.clientName} onChange={e => setNewTest({...newTest, clientName: e.target.value})} />
              <input required type="text" placeholder="Client Role" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-olivia-gold focus:outline-none" value={newTest.role} onChange={e => setNewTest({...newTest, role: e.target.value})} />
              <textarea required placeholder="Testimonial Text" rows="4" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-olivia-gold focus:outline-none" value={newTest.text} onChange={e => setNewTest({...newTest, text: e.target.value})} />
              <input type="text" placeholder="Image URL (optional)" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-olivia-gold focus:outline-none" value={newTest.imageUrl} onChange={e => setNewTest({...newTest, imageUrl: e.target.value})} />
              <div className="flex gap-4 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-olivia-gold hover:bg-yellow-500 text-black font-bold rounded-xl shadow-lg transition-colors">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-20 relative">
          <div className="testimonials-label flex justify-center items-center gap-3 text-olivia-text-light mb-4 font-bold uppercase tracking-[0.25em] text-xs">
            <span className="w-8 h-[2px] bg-olivia-gold"></span>
            Client Testimonials
            <span className="w-8 h-[2px] bg-olivia-gold"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-olivia-text overflow-hidden">
            <span className="testimonials-title-word inline-block">The Impact of My Work:</span>
            <br/>
            <span className="testimonials-title-word inline-block text-gradient-gold">Client Testimonials</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 perspective-1000">
          {testimonials.map((t, index) => (
            <div
              key={t._id || index}
              className="testimonial-card bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[28px] shadow-lg border border-gray-100 flex flex-col justify-between relative group preserve-3d card-shine"
              onMouseMove={(e) => handleTilt(e, e.currentTarget)}
              onMouseLeave={(e) => resetTilt(e.currentTarget)}
            >
              {/* Quote mark */}
              <div className="quote-mark absolute top-4 right-6 text-6xl font-serif text-olivia-gold/10 leading-none select-none">"</div>
              
              {/* Admin delete */}
              {isEditing && (
                <button
                  onClick={() => removeTestimonial(t._id)}
                  className="absolute top-4 left-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-600"
                >
                  ×
                </button>
              )}

              <div>
                <div className="star-rating flex text-olivia-gold mb-6 text-xl gap-0.5">
                  {"★".repeat(t.rating)}{"☆".repeat(5-t.rating)}
                  <span className="text-olivia-text font-bold text-base ml-3">{t.rating}.0</span>
                </div>
                <p className="text-olivia-text-light italic leading-relaxed mb-8 font-serif text-lg">
                  "{t.text}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <img
                  src={getTestimonialImg(t.imageUrl)}
                  alt={t.clientName}
                  className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100 border-2 border-olivia-gold/20"
                />
                <div>
                  <h4 className="font-bold text-olivia-text text-lg">{t.clientName}</h4>
                  <p className="text-xs text-olivia-text-light font-bold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-10 border-2 border-dashed border-gray-200 rounded-3xl w-full">
              No testimonials added yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
