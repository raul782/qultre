import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { withProviders } from './Providers';

function Header() {
  const { t, i18n } = useTranslation();
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeroPage, setIsHeroPage] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY >= 10);
    };
    
    const checkHeroPage = () => {
      const path = window.location.pathname;
      const heroPaths = [
        '/', '/es', '/es/', 
        '/about-us', '/es/about-us', 
        '/privacy', '/es/privacy', 
        '/terms', '/es/terms',
        '/about-us/', '/es/about-us/', 
        '/privacy/', '/es/privacy/', 
        '/terms/', '/es/terms/'
      ];
      setIsHeroPage(heroPaths.includes(path));
    };

    checkHeroPage();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isEn = i18n.language === 'en';
  const prefix = isEn ? '' : '/es';

  const toggleLanguage = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentPath = window.location.pathname;
    let cleanPath = currentPath;
    
    if (currentPath.startsWith('/es/') || currentPath === '/es') {
      cleanPath = currentPath === '/es' ? '/' : currentPath.substring(3);
    }

    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

    const newPath = isEn ? (cleanPath === '/' ? '/es' : `/es${cleanPath}`) : cleanPath;
    window.location.href = newPath;
  };

  const showSolidHeader = isScrolling || !isHeroPage;

  const logoColorClass = showSolidHeader 
    ? "text-slate-900 dark:text-white" 
    : "text-slate-900 dark:text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        showSolidHeader
          ? "bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 py-3"
          : "bg-transparent py-5"
      }`}
      id="header"
    >
      <div className="px-4 mx-auto w-full md:flex md:justify-between max-w-7xl md:px-6">
        <div className="flex justify-between items-center w-full md:w-auto">
          <a className="flex items-center" href={prefix || '/'}>
            <Logo colorClass={logoColorClass} />
          </a>
          
          <div className="flex items-center md:hidden gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        <div className={`md:self-center flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto ${isMenuOpen ? 'block mt-4 md:mt-0' : 'hidden md:flex'}`}>
          <nav
            className="text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Main navigation"
          >
            <ul className="flex flex-col md:flex-row gap-1 md:gap-8 text-base">
              <li>
                <a
                  href={`${prefix}/#vision`}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-2 py-2 flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition duration-150"
                >
                  {t('nav.vision')}
                </a>
              </li>
              <li>
                <a
                  href={`${prefix}/#explorer`}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-2 py-2 flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition duration-150"
                >
                  {t('nav.explorer')}
                </a>
              </li>
              <li>
                <a
                  href={`${prefix}/#faq`}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-2 py-2 flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition duration-150"
                >
                  {t('nav.faq')}
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0 md:ml-8 pt-4 md:pt-0 border-t border-slate-200 dark:border-slate-800 md:border-none">
            <a
              href="#"
              onClick={toggleLanguage}
              className="text-sm font-semibold tracking-wider uppercase text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition duration-150"
            >
              {isEn ? '🇪🇸 ES' : '🇬🇧 EN'}
            </a>

            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <a
              href={`${prefix}/#waitlist`}
              onClick={() => setIsMenuOpen(false)}
              className="w-full md:w-auto relative group overflow-hidden px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-primary-500/20"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">{t('hero.cta')}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default withProviders(Header);
