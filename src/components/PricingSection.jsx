import { useContext, useRef } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';

const PricingSection = () => {
  const { profile, loading } = useContext(PortfolioContext);
  const data = profile?.pricing;
  const sectionRef = useRef(null);

  if (loading) return null;

  const defaultPricing = [
    { planName: 'Hourly', price: '$80', period: '/Hour', features: ['Quick turnaround projects', 'Priority support', 'Revision rounds included'] },
    { planName: 'Monthly', price: '$9600', period: '/Month', features: ['Dedicated designer', 'Unlimited revisions', 'Priority support', 'Weekly reports'] },
    { planName: 'Quarterly', price: '$28,800', period: '/Quarter', features: ['Full project lifecycle', 'Team collaboration', 'Priority support', 'Strategy sessions'] },
  ];
  const pricing = (data && data.length > 0) ? data : defaultPricing;

  return (
    <section ref={sectionRef} id="pricing" className="bg-gradient-to-br from-olivia-green-deep via-olivia-green to-[#1a5438] text-white py-20 sm:py-28 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-olivia-gold/[0.03] rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 text-olivia-gold mb-3 font-bold uppercase tracking-[0.2em] text-sm">
            <span className="w-8 h-[2px] bg-olivia-gold"></span>
            Pricing Table
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold">
            My <span className="text-gradient-gold">Pricing Model</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {pricing.map((plan, index) => {
            const isFeatured = index === 1;

            return (
              <div
                key={index}
                className={`rounded-[28px] p-6 sm:p-8 transition-all duration-500 relative group cursor-pointer hover:-translate-y-2 ${
                  isFeatured
                    ? 'bg-olivia-gold text-olivia-green-deep shadow-2xl sm:scale-[1.03] z-10'
                    : 'bg-white/[0.05] text-white border border-white/10 backdrop-blur-sm hover:bg-white/[0.08]'
                }`}
              >
                {/* Featured badge */}
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-olivia-green-deep text-olivia-gold text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="flex justify-between items-center mb-6 border-b border-black/10 pb-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif mb-3">{plan.planName}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{plan.price}</span>
                      <span className="text-sm font-medium opacity-70">{plan.period}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md group-hover:scale-110 transition-transform duration-300 ${
                    isFeatured ? 'bg-olivia-green-deep text-olivia-gold' : 'bg-olivia-gold text-olivia-green-deep'
                  }`}>
                    ↗
                  </div>
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-6">
                  {plan.features?.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        isFeatured ? 'bg-olivia-green-deep/20 text-olivia-green-deep' : 'bg-olivia-gold/20 text-olivia-gold'
                      }`}>✓</span>
                      <span className="opacity-85 font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                  {(!plan.features || plan.features.length === 0) && (
                    <li className="italic opacity-50 text-sm">No features listed</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
