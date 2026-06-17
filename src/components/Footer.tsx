import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { withProviders } from './Providers';

function Footer() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';
  const prefix = isEs ? '/es' : '';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-slate-100 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Logo and Description */}
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            {t('footer.description')}
          </p>
        </div>

        {/* Links */}
        <div className="md:ml-auto space-y-4">
          <h4 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-200 uppercase">
            {t('nav.about_us')}
          </h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>
              <a href={`${prefix}/about-us`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {t('nav.about_us')}
              </a>
            </li>
            <li>
              <a href={`${prefix}/team`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {t('nav.team')}
              </a>
            </li>
            <li>
              <a href={`${prefix}/#vision`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {t('nav.vision')}
              </a>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div className="md:ml-auto space-y-4">
          <h4 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-200 uppercase">
            Legal
          </h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>
              <a href={`${prefix}/privacy`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {t('nav.privacy')}
              </a>
            </li>
            <li>
              <a href={`${prefix}/terms`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {t('nav.terms')}
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <div>
          &copy; {currentYear} Qultre. {t('footer.rights')}
        </div>
        <div>
          {t('footer.madeBy')}
        </div>
      </div>
    </footer>
  );
}

export default withProviders(Footer);
