import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWaitlistStore } from '@store/useWaitlistStore';
import { withProviders } from './Providers';
import cardsData from '@data/cards.json';

const getCityColor = (id: string) => {
  switch (id) {
    case 'madrid': return '#f59e0b'; // Amber
    case 'tokyo': return '#06b6d4'; // Cyan
    case 'rome': return '#a855f7'; // Purple
    default: return '#6366f1';
  }
};

const getCityFlag = (id: string) => {
  switch (id) {
    case 'madrid': return '🇪🇸';
    case 'tokyo': return '🇯🇵';
    case 'rome': return '🇮🇹';
    default: return '';
  }
};

function ThreeCard() {
  const { i18n } = useTranslation();
  const selectedCity = useWaitlistStore((state) => state.selectedCity);
  const selectedCategory = useWaitlistStore((state) => state.selectedCategory);
  const setSelectedCity = useWaitlistStore((state) => state.setSelectedCity);
  const setSelectedCategory = useWaitlistStore((state) => state.setSelectedCategory);

  const [animateKey, setAnimateKey] = useState('');

  // Trigger smooth content fade-in animation on change
  useEffect(() => {
    setAnimateKey('opacity-0 translate-y-2');
    const timer = setTimeout(() => {
      setAnimateKey('opacity-100 translate-y-0 transition-all duration-300');
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedCity, selectedCategory]);

  const activeCard = cardsData.find(c => c.id === selectedCity) || cardsData[0];
  const langKey = i18n.language === 'es' ? 'es' : 'en';
  const color = getCityColor(selectedCity);

  const renderCategoryDetails = () => {
    const details = activeCard[selectedCategory] as any;
    if (!details) return null;

    if (selectedCategory === 'finance') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">💳</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Currency</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Local Unit</span>
              </div>
            </div>
            <span className="text-sm font-extrabold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm">{details.currency}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">☕</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Local Coffee</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Café / Espresso</span>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{details.coffeePrice[langKey]}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">🚇</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Transit Flat Fare</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Base ride / Metro</span>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{details.taxiRate?.[langKey] || details.coffeePrice[langKey]}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">🍽️</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Avg Lunch Menu</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Daily Lunch Set</span>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{details.mealPrice[langKey]}</span>
          </div>
        </div>
      );
    }

    if (selectedCategory === 'tourism') {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <span className="text-base">📍</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Top District</span>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-white pl-6">
              {details.topDistrict[langKey]}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <span className="text-base">💡</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Local Customs</span>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 italic pl-6 leading-relaxed">
              "{details.localCustom[langKey]}"
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <span className="text-base">🏛️</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Main Attraction</span>
            </div>
            <p className="text-sm font-extrabold text-primary-600 dark:text-primary-400 pl-6">
              {details.mainAttraction[langKey]}
            </p>
          </div>
        </div>
      );
    }

    if (selectedCategory === 'demographics') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">👥</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Density</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Population / km²</span>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{details.populationDensity}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">🗣️</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Language</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Primary Native Tongue</span>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{details.languages[langKey]}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">📈</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Average Age</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Demographic Mean</span>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{details.averageAge || '44 years'}</span>
          </div>
        </div>
      );
    }

    if (selectedCategory === 'weather') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">📅</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Best Visit</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Recommended Month</span>
              </div>
            </div>
            <span className="text-sm font-extrabold text-amber-500">{details.bestMonth[langKey]}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">☀️</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">July Peak High</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Summer Maximum</span>
              </div>
            </div>
            <span className="text-sm font-bold text-red-500">{details.tempHigh || '32°C'}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:bg-slate-500/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">❄️</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Jan Peak Low</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Winter Minimum</span>
              </div>
            </div>
            <span className="text-sm font-bold text-blue-400">{details.tempLow || '3°C'}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 select-text">
      
      {/* City Switchers Selector Tabs */}
      <div className="flex gap-3 justify-center flex-wrap">
        {cardsData.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCity(c.id)}
            className={`px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 border flex items-center gap-2 cursor-pointer active:scale-95 ${
              selectedCity === c.id
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-900 border-slate-950 dark:border-white shadow-xl shadow-black/15 scale-105'
                : 'bg-white/40 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-900/60'
            }`}
          >
            <span>{c.name[langKey]}</span>
            <span className="text-lg leading-none">{getCityFlag(c.id)}</span>
          </button>
        ))}
      </div>

      {/* Main Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Sidebar Category Toggles */}
        <div className="md:col-span-4 flex md:flex-col gap-2 flex-wrap justify-center md:justify-start">
          {(['finance', 'tourism', 'demographics', 'weather'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 md:flex-initial px-5 py-4 rounded-2xl border font-bold text-xs uppercase tracking-widest text-center md:text-left transition-all cursor-pointer active:scale-95 flex items-center justify-between gap-3 ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white border-transparent text-white dark:text-slate-900 shadow-lg'
                  : 'bg-white/40 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900/60'
              }`}
            >
              <span>{cat}</span>
              <span className="opacity-60 text-[10px]">
                {cat === 'finance' && '💰'}
                {cat === 'tourism' && '🏛️'}
                {cat === 'demographics' && '👥'}
                {cat === 'weather' && '☀️'}
              </span>
            </button>
          ))}
          <div className="hidden md:block mt-4 p-5 rounded-2xl bg-white/20 dark:bg-slate-900/10 border border-slate-200/30 dark:border-slate-800/30 text-left space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Culture Deck info</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              Toggle categories on the left to swap metrics cards instantly. Discover live cost ranges, behaviors, languages, and seasonal guides.
            </p>
          </div>
        </div>

        {/* Centerpiece HTML Glassmorphic Card (Displays everything) */}
        <div className="md:col-span-8 flex flex-col justify-center">
          <div 
            style={{
              borderColor: `${color}30`,
              boxShadow: `0 20px 50px -12px ${color}25, inset 0 0 25px ${color}10`,
            }}
            className="w-full rounded-3xl p-6 md:p-8 border bg-white/60 dark:bg-slate-900/30 backdrop-blur-xl flex flex-col justify-between text-slate-900 dark:text-white transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl relative overflow-hidden min-h-[420px]"
          >
            {/* Ambient Background Aura representing the color */}
            <div 
              style={{ backgroundColor: color }}
              className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
            ></div>
            
            {/* Animated card content wrapper */}
            <div className={`space-y-6 ${animateKey}`}>
              
              {/* Card Header Info */}
              <div className="flex justify-between items-start border-b border-slate-200/40 dark:border-slate-800/40 pb-4">
                <div>
                  <h3 className="text-4xl md:text-5xl font-black font-display tracking-tighter uppercase leading-none text-slate-900 dark:text-white flex items-center gap-2.5">
                    <span>{activeCard.name[langKey]}</span>
                    <span className="text-3xl leading-none">{getCityFlag(activeCard.id)}</span>
                  </h3>
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1 block">
                    {activeCard.country[langKey]}
                  </span>
                </div>
                
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-300 font-sans border border-slate-500/20">
                  {selectedCategory}
                </span>
              </div>

              {/* Tagline section */}
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-300 italic font-serif leading-relaxed border-l-2 pl-4" style={{ borderLeftColor: color }}>
                "{activeCard.tagline[langKey]}"
              </p>

              {/* Dynamic metrics category display */}
              <div className="mt-4">
                {renderCategoryDetails()}
              </div>

            </div>

            {/* Card Footer waitlist trigger */}
            <div className="mt-8 pt-4 border-t border-slate-200/30 dark:border-slate-800/30 flex justify-between items-center">
              <a 
                href="#waitlist" 
                className="text-xs font-black tracking-widest uppercase flex items-center gap-1.5 transition-all group hover:opacity-85 cursor-pointer"
                style={{ color }}
              >
                <span>Unlock full district layers</span> 
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                <span>QULTRE DECK v1.0</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default withProviders(ThreeCard);
