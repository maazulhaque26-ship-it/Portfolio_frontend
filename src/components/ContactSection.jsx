import { useState, useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContext } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const { profile, API } = useContext(PortfolioContext);
  const data = profile?.contact;
  const sectionRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', interestedIn: '', message: '',
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [sending, setSending]           = useState(false);

  useEffect(() => {
    if (!data || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Header
      gsap.from('.contact-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        x: -60, opacity: 0, duration: 0.7, ease: 'power3.out',
      });
      gsap.from('.contact-title-word', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        y: 80, opacity: 0, rotationX: -40,
        duration: 0.9, stagger: 0.12, ease: 'power3.out',
      });

      // Info cards stagger
      gsap.from('.contact-info-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        x: -50, opacity: 0, scale: 0.9,
        duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });

      // Contact info container
      gsap.from('.contact-info-container', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40, opacity: 0,
        duration: 0.8, ease: 'power3.out',
      });

      // Form entrance with depth
      gsap.from('.contact-form', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 60, opacity: 0, scale: 0.95,
        duration: 0.9, ease: 'power3.out', delay: 0.2,
      });

      // Form fields stagger
      gsap.from('.form-field', {
        scrollTrigger: { trigger: '.contact-form', start: 'top 80%' },
        y: 30, opacity: 0,
        duration: 0.6, stagger: 0.08, delay: 0.3, ease: 'power3.out',
      });

      // Submit button
      gsap.from('.submit-btn', {
        scrollTrigger: { trigger: '.contact-form', start: 'top 70%' },
        y: 20, opacity: 0, scale: 0.9,
        duration: 0.6, delay: 0.6, ease: 'back.out(2)',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [data]);

  if (!data) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSubmitStatus('Sending...');
    try {
      const apiBase = API;
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitStatus('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', interestedIn: '', message: '' });
        // Success animation
        gsap.fromTo('.submit-btn', { scale: 1 }, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
      } else {
        setSubmitStatus('Failed to send. Please try again.');
      }
    } catch {
      setSubmitStatus('An error occurred. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const contactItems = [
    { icon: '📞', value: data.phone || 'Not set', label: 'Phone' },
    { icon: '✉️', value: data.email || 'Not set', label: 'Email' },
    { icon: '📍', value: data.address || 'Not set', label: 'Location' },
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-20 sm:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-olivia-gold/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-olivia-green/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row gap-10 lg:gap-16 pb-12 sm:pb-20">

        {/* Left Info */}
        <div className="w-full lg:w-1/3">
          <div className="contact-label flex items-center gap-3 text-olivia-text-light mb-4 font-bold uppercase tracking-[0.25em] text-xs">
            <span className="w-10 h-[2px] bg-gradient-to-r from-olivia-gold to-transparent" />
            Contact Us
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-olivia-text mb-6 overflow-hidden">
            <span className="contact-title-word inline-block">Let's Talk for</span>{' '}
            <span className="contact-title-word inline-block text-gradient-gold">Your Next Projects</span>
          </h2>
          <p className="text-olivia-text-light mb-10 leading-relaxed font-sans">
            Have a project in mind? Let's discuss how we can bring your vision to life with exceptional design and development.
          </p>

          <div className="contact-info-container space-y-4 sm:space-y-6 bg-white p-5 sm:p-8 rounded-[28px] shadow-lg border border-gray-100">
            {contactItems.map((item, i) => (
              <div key={i} className="contact-info-card flex items-center gap-5 group hover:translate-x-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-olivia-gold/10 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50 group-hover:bg-olivia-gold/20 group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] text-olivia-text-light font-bold uppercase tracking-wider mb-0.5">{item.label}</p>
                  <div className="font-bold text-olivia-text text-base">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-2/3 contact-form pt-4 sm:pt-8">
          <div className="bg-white p-6 sm:p-10 rounded-[28px] shadow-2xl border border-gray-100 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-olivia-gold rounded-full -z-10 blur-xl opacity-30" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-olivia-green rounded-full -z-10 blur-xl opacity-20" />
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-field">
                <label className="block text-xs font-bold uppercase tracking-wider text-olivia-text-light mb-2">
                  Your Name *
                </label>
                <input required type="text"
                  className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-olivia-gold focus:bg-white font-medium transition-all duration-300"
                  placeholder="Ex. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label className="block text-xs font-bold uppercase tracking-wider text-olivia-text-light mb-2">
                  Email *
                </label>
                <input required type="email"
                  className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-olivia-gold focus:bg-white font-medium transition-all duration-300"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label className="block text-xs font-bold uppercase tracking-wider text-olivia-text-light mb-2">
                  Phone *
                </label>
                <input required type="text"
                  className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-olivia-gold focus:bg-white font-medium transition-all duration-300"
                  placeholder="Enter Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label className="block text-xs font-bold uppercase tracking-wider text-olivia-text-light mb-2">
                  Interested In *
                </label>
                <input required type="text"
                  className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-olivia-gold focus:bg-white font-medium transition-all duration-300"
                  placeholder="e.g. Web Development, App Design, Branding..."
                  value={formData.interestedIn}
                  onChange={(e) => setFormData({ ...formData, interestedIn: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 form-field">
                <label className="block text-xs font-bold uppercase tracking-wider text-olivia-text-light mb-2">
                  Your Message *
                </label>
                <textarea required rows="5"
                  className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-olivia-gold focus:bg-white font-medium transition-all duration-300"
                  placeholder="Enter here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex flex-col md:flex-row justify-between mt-2 items-center gap-4">
                <span className={`font-bold text-sm ${submitStatus.includes('success') ? 'text-olivia-green' : 'text-olivia-gold'}`}>
                  {submitStatus}
                </span>
                <button
                  type="submit"
                  disabled={sending}
                  className="submit-btn magnetic-btn bg-olivia-green text-white px-10 py-5 rounded-full font-bold hover:bg-olivia-gold hover:text-black transition-all duration-300 flex items-center gap-3 shadow-xl disabled:opacity-60 hover:shadow-2xl hover:scale-105"
                >
                  {sending ? 'Sending...' : 'Submit'}
                  <span className="bg-white text-olivia-green w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-inner">
                    →
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;