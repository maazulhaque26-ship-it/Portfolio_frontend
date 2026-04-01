import { useContext, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContext } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { footer, loading, profile } = useContext(PortfolioContext);
  const footerRef = useRef(null);

  useEffect(() => {
    if (loading || !footerRef.current) return;

    const ctx = gsap.context(() => {
      // Footer entrance
      gsap.from('.footer-content > *', {
        scrollTrigger: { trigger: footerRef.current, start: 'top 95%' },
        y: 30, opacity: 0,
        duration: 0.7, stagger: 0.1, ease: 'power3.out',
      });

      // Social links cascade
      gsap.from('.social-link', {
        scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
        y: 20, opacity: 0, scale: 0.8,
        duration: 0.4, stagger: 0.08, delay: 0.3, ease: 'back.out(2)',
      });

      // Logo spin in
      gsap.from('.footer-logo', {
        scrollTrigger: { trigger: footerRef.current, start: 'top 95%' },
        scale: 0, rotation: -180,
        duration: 0.8, ease: 'back.out(2)',
      });

      // Divider line expand
      gsap.from('.footer-divider', {
        scrollTrigger: { trigger: footerRef.current, start: 'top 95%' },
        scaleX: 0,
        duration: 0.8, delay: 0.2, ease: 'power3.out',
        transformOrigin: 'center',
      });
    }, footerRef);

    return () => ctx.revert();
  }, [loading, footer]);

  if (loading) return null;

  // Fallback defaults
  const brandName     = footer?.brandName     || profile?.hero?.name || 'Portfolio';
  const copyrightText = footer?.copyrightText || `© ${new Date().getFullYear()} ${profile?.hero?.name || 'Portfolio'}. All rights reserved.`;
  const tagline       = footer?.tagline       || '';
  const socials       = footer?.socials       || {};

  // Build array of social links that have values
  const socialLinks = [
    { label: 'LinkedIn',  url: socials.linkedin,  icon: '🔗' },
    { label: 'Twitter',   url: socials.twitter,   icon: '𝕏' },
    { label: 'Dribbble',  url: socials.dribbble,  icon: '🏀' },
    { label: 'GitHub',    url: socials.github,    icon: '⚡' },
    { label: 'Instagram', url: socials.instagram, icon: '📸' },
  ].filter((s) => s.url);

  return (
    <footer ref={footerRef} className="relative z-10 bg-olivia-green-deep pt-16 pb-10 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-olivia-gold/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-olivia-gold/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="footer-content max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-hover">
            <div className="footer-logo w-12 h-12 bg-olivia-gold rounded-full flex items-center justify-center font-bold text-[#0a1f14] text-xl shadow-lg glow-gold">
              {brandName.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-white tracking-widest text-xl block">
                {brandName}
              </span>
              {tagline && (
                <span className="text-white/30 text-xs font-medium">{tagline}</span>
              )}
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex gap-3 flex-wrap justify-center">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link group flex items-center gap-2 bg-white/[0.05] hover:bg-olivia-gold/20 border border-white/[0.08] hover:border-olivia-gold/30 px-4 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                >
                  <span className="text-sm">{social.icon}</span>
                  <span className="text-white/60 group-hover:text-olivia-gold text-xs font-bold uppercase tracking-wider transition-colors duration-300">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="footer-divider h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-white/40 text-sm gap-4">
          <p className="text-center md:text-left">{copyrightText}</p>
          <div className="flex gap-6 text-xs font-medium">
            <span className="hover:text-olivia-gold transition-colors cursor-hover">Privacy Policy</span>
            <span className="hover:text-olivia-gold transition-colors cursor-hover">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;