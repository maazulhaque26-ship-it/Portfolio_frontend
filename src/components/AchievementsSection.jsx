import { useContext, useRef } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';

const AchievementsSection = () => {
  const { profile, loading } = useContext(PortfolioContext);
  const data = profile?.achievements;
  const sectionRef = useRef(null);

  if (loading) return null;

  const defaultAchievements = [
    { category: 'Achievement', period: '2023', title: 'Best Designer Award', subtitle: 'Awwwards' },
    { category: 'Achievement', period: '2022', title: 'Top 10 Portfolios', subtitle: 'CSS Design Awards' },
    { category: 'Participation', period: '2023', title: 'Web Summit', subtitle: 'Speaker on UI/UX trends' },
    { category: 'Participation', period: '2021', title: 'Design Sprint Workshop', subtitle: 'Google Design' },
  ];
  const achievementsData = (data && data.length > 0) ? data : defaultAchievements;
  const achievements = achievementsData.filter(t => t.category === 'Achievement');
  const participation = achievementsData.filter(t => t.category === 'Participation');

  return (
    <section ref={sectionRef} id="achievements" className="py-20 sm:py-32 bg-olivia-gray relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-olivia-gold/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-olivia-green/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        
        <div className="text-center mb-14 sm:mb-20">
          <div className="flex justify-center items-center gap-3 text-olivia-text-light mb-4 font-bold uppercase tracking-[0.25em] text-xs">
            <span className="w-8 h-[2px] bg-olivia-gold"></span>
            Recognitions & Events
            <span className="w-8 h-[2px] bg-olivia-gold"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-olivia-text overflow-hidden">
            <span className="inline-block">My </span>
            <span className="inline-block text-gradient-gold">Achievements and</span><br/>
            <span className="inline-block text-gradient-gold">Participation</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Achievements Column */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 pb-8 sm:pb-10 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500">
            <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-olivia-gold rounded-2xl flex items-center justify-center text-olivia-green font-bold text-xl sm:text-2xl shadow-lg">
                🏆
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-olivia-text">Achievements</h3>
                <p className="text-xs text-olivia-text-light font-medium">Awards & Recognitions</p>
              </div>
            </div>
            
            <div className="space-y-8 sm:space-y-10 relative">
              <div className="absolute inset-y-0 left-2 w-0.5 bg-gradient-to-b from-olivia-gold via-olivia-gold/50 to-transparent"></div>
              {achievements.map((item, index) => (
                <div key={`ach-${index}`} className="relative pl-8 pb-2">
                  <div className="absolute left-[3px] top-1.5 w-3 h-3 bg-olivia-gold rounded-full shadow-[0_0_0_4px_#fff,0_0_0_5px_rgba(251,191,36,0.2)]"></div>
                  <span className="text-[11px] font-bold text-olivia-gold mb-1 block uppercase tracking-wider">
                    {item.period}
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold text-olivia-text mb-1">
                    {item.title}
                  </h4>
                  <p className="text-olivia-text-light text-sm">
                    {item.subtitle}
                  </p>
                </div>
              ))}
              {achievements.length === 0 && (
                <p className="text-gray-400 text-sm pl-8 italic">No achievements yet.</p>
              )}
            </div>
          </div>

          {/* Participation Column */}
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 pb-8 sm:pb-10 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500">
            <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-olivia-gold rounded-2xl flex items-center justify-center text-olivia-green font-bold text-xl sm:text-2xl shadow-lg">
                🚀
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-olivia-text">Participation</h3>
                <p className="text-xs text-olivia-text-light font-medium">Events & Workshops</p>
              </div>
            </div>
            
            <div className="space-y-8 sm:space-y-10 relative">
              <div className="absolute inset-y-0 left-2 w-0.5 bg-gradient-to-b from-olivia-gold via-olivia-gold/50 to-transparent"></div>
              {participation.map((item, index) => (
                <div key={`work-${index}`} className="relative pl-8 pb-2">
                  <div className="absolute left-[3px] top-1.5 w-3 h-3 bg-olivia-gold rounded-full shadow-[0_0_0_4px_#fff,0_0_0_5px_rgba(251,191,36,0.2)]"></div>
                  <span className="text-[11px] font-bold text-olivia-gold mb-1 block uppercase tracking-wider">
                    {item.period}
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold text-olivia-text mb-1">
                     {item.title}
                  </h4>
                  <p className="text-olivia-text-light text-sm">
                     {item.subtitle}
                  </p>
                </div>
              ))}
              {participation.length === 0 && (
                <p className="text-gray-400 text-sm pl-8 italic">No participations yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
