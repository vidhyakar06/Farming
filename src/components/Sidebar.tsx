import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, Sprout, FlaskConical, Cloud,
  Bug, TrendingUp, Bot, FileBarChart, Settings, X, Images,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

type NavItem = {
  to: string;
  translationKey: string;
  defaultLabel: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { to: '/dashboard', translationKey: 'nav.dashboard', defaultLabel: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', translationKey: 'nav.profile', defaultLabel: 'Profile', icon: User },
  { to: '/farm-details', translationKey: 'nav.farmDetails', defaultLabel: 'Farm Details', icon: Sprout },
  { to: '/crop-recommendation', translationKey: 'nav.cropSuggestion', defaultLabel: 'Crop Suggestion', icon: Sprout },
  { to: '/fertilizer', translationKey: 'nav.fertilizer', defaultLabel: 'Fertilizer', icon: FlaskConical },
  { to: '/weather', translationKey: 'nav.weather', defaultLabel: 'Weather', icon: Cloud },
  { to: '/diseases', translationKey: 'nav.diseases', defaultLabel: 'Diseases', icon: Bug },
  { to: '/gallery', translationKey: 'nav.gallery', defaultLabel: 'Image Gallery', icon: Images },
  { to: '/market-prices', translationKey: 'nav.marketPrices', defaultLabel: 'Market Prices', icon: TrendingUp },
  { to: '/ai-assistant', translationKey: 'nav.aiAssistant', defaultLabel: 'Smart Assistant', icon: Bot },
  { to: '/reports', translationKey: 'nav.reports', defaultLabel: 'Reports', icon: FileBarChart },
  { to: '/settings', translationKey: 'nav.settings', defaultLabel: 'Settings', icon: Settings },
];

const adminItems: NavItem[] = [
  { to: '/admin', translationKey: 'nav.adminTools', defaultLabel: 'Admin Tools', icon: LayoutDashboard, adminOnly: true },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const items = profile?.role === 'admin' ? [...navItems, ...adminItems] : navItems;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-50 lg:z-30 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full glass border-r border-white/20 dark:border-slate-700/50 flex flex-col">
          <div className="flex items-center justify-between p-6 lg:hidden">
            <span className="font-display font-bold text-lg text-slate-800 dark:text-white">Menu</span>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-sm">{t(item.translationKey)}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 p-4 text-white">
              <p className="text-sm font-semibold">{t('nav.needHelp')}</p>
              <p className="text-xs text-primary-100 mt-1">{t('nav.helpSubtitle')}</p>
              <NavLink
                to="/contact"
                onClick={onClose}
                className="mt-3 block text-center text-xs font-medium bg-white/20 hover:bg-white/30 rounded-lg py-2 transition-colors"
              >
                {t('nav.contactUs')}
              </NavLink>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
