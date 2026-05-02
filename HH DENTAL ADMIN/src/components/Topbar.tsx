/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, Search, User, Languages, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSearchStore } from '../store/useSearchStore';

export default function Topbar({ toggleMobileMenu }: { toggleMobileMenu?: () => void }) {
  const user = useAuthStore((state) => state.user);
  const { language, setLanguage, t } = useLanguageStore();
  const { globalSearchQuery, setGlobalSearchQuery, isSearchOpen, setIsSearchOpen } = useSearchStore();

  return (
    <header className="h-16 md:h-20 bg-bg-main/80 backdrop-blur-md border-b border-border-subtle sticky top-0 z-30 px-4 md:px-8 flex items-center transition-colors duration-300">
      <div className="flex items-center gap-4 min-w-[200px]">
        <button onClick={toggleMobileMenu} className="md:hidden text-text-primary p-2 -ml-2 rounded-lg hover:bg-text-primary/5">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tighter text-text-primary">H&H <span className="text-accent italic">DENTAL</span></h1>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Admin Prestige</span>
        </div>
      </div>

      {/* Global Search - Desktop Centered */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-xl hidden md:block group">
          <div className="w-full bg-text-primary/[0.03] border border-border-subtle rounded-2xl px-6 py-2.5 flex items-center gap-4 transition-all duration-300 group-focus-within:border-accent/40 group-focus-within:bg-bg-main group-focus-within:shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
            <Search className={`w-4 h-4 transition-colors duration-300 ${globalSearchQuery ? 'text-accent' : 'text-text-muted'}`} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm outline-none w-full text-text-primary placeholder:text-text-muted/50"
            />
            {globalSearchQuery && (
              <button 
                onClick={() => setGlobalSearchQuery('')}
                className="text-text-muted hover:text-accent transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md bg-text-primary/[0.05] border border-border-subtle">
               <span className="text-[9px] font-bold text-text-muted">⌘ K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-0 h-16 bg-bg-main z-50 flex items-center px-4 gap-4 md:hidden border-b border-border-subtle"
          >
            <div className="flex-1 bg-text-primary/5 border border-border-subtle rounded-xl px-4 py-2 flex items-center gap-2">
              <Search size={18} className="text-accent" />
              <input
                autoFocus
                type="text"
                placeholder="Search anything..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="bg-transparent border-none text-sm outline-none w-full text-text-primary"
              />
            </div>
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setGlobalSearchQuery('');
              }} 
              className="p-2 text-text-muted hover:text-accent"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-6 min-w-[200px] justify-end">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 text-text-secondary hover:text-accent transition-colors"
        >
          <Search size={20} />
        </button>

        <div className="flex items-center gap-2 md:gap-3 pr-2 md:pr-6 border-r border-border-subtle">
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
        
        <div className="flex items-center gap-4">
          <button className="relative w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-secondary hover:text-accent transition-colors hover:bg-text-primary/5">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-bg-main"></span>
          </button>
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs font-bold text-text-primary leading-none">{user?.name || 'Admin'}</span>
            <span className="text-[9px] text-text-muted uppercase tracking-tighter mt-1">{user?.role || 'Super Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
