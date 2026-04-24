/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, Search, User, Languages, Sun, Moon, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useThemeStore } from '../store/useThemeStore';

export default function Topbar({ toggleMobileMenu }: { toggleMobileMenu?: () => void }) {
  const user = useAuthStore((state) => state.user);
  const { language, setLanguage, t } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-16 md:h-20 bg-bg-main/80 backdrop-blur-md border-b border-border-subtle sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button onClick={toggleMobileMenu} className="md:hidden text-text-primary p-2 -ml-2 rounded-lg hover:bg-text-primary/5">
          <Menu className="w-6 h-6" />
        </button>
        {/* Search */}
        <div className="relative w-full max-w-sm hidden md:block">
          <div className="w-full bg-text-primary/5 border border-border-subtle rounded-full px-4 py-2 flex items-center gap-2 transition-colors">
          <Search className="w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="bg-transparent border-none text-xs outline-none w-full text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-border-subtle">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-secondary hover:text-accent transition-all hover:bg-text-primary/5 active:scale-95 overflow-hidden"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: 20, rotate: 45, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: -20, rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </AnimatePresence>
          </button>
          <div className="w-[1px] h-4 bg-border-subtle mx-1" />
          <Languages size={16} className="text-accent/50" />
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
            <button 
              onClick={() => setLanguage('en')}
              className={`transition-colors ${language === 'en' ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
            >
              EN
            </button>
            <span className="text-text-muted">|</span>
            <button 
              onClick={() => setLanguage('te')}
              className={`transition-colors ${language === 'te' ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
            >
              TE
            </button>
          </div>
        </div>
        <button className="relative w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-secondary hover:text-accent transition-colors hover:bg-text-primary/5">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
