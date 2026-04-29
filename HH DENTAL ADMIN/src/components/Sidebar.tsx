/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Stethoscope, 
  MapPin, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen?: boolean, setMobileMenuOpen?: (open: boolean) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/appointments', label: t('appointments'), icon: CalendarCheck },
    { path: '/doctors', label: t('doctors'), icon: Stethoscope },
    { path: '/services', label: t('services'), icon: Sparkles },
    { path: '/clinics', label: t('clinics'), icon: MapPin },
    { path: '/testimonials', label: 'Testimonials', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen?.(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className={cn(
          "h-screen bg-sidebar-bg border-r border-border-subtle flex flex-col transition-all duration-300 z-50",
          "fixed md:relative top-0 left-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
      {/* Brand */}
      <div className="p-8 border-b border-border-subtle">
        {!isCollapsed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-2xl font-bold tracking-tighter text-accent">H&H <span className="text-text-primary font-light">DENTAL</span></h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1 font-semibold">Admin Prestige</p>
          </motion.div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mx-auto">
            <span className="text-bg-main font-bold text-xl">H</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 p-4 rounded-r-lg transition-all duration-200 border-l-[3px]",
              isActive 
                ? "bg-accent/10 border-accent text-accent" 
                : "text-text-secondary hover:text-text-primary border-transparent hover:bg-text-primary/5"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-medium"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile/Logout Section per Theme */}
      <div className="p-6 border-t border-border-subtle space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-gold to-accent flex-shrink-0" />
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm font-bold text-text-primary truncate max-w-[120px]">{useAuthStore.getState().user?.email.split('@')[0] || 'Admin'}</p>
              <p className="text-[10px] text-text-muted uppercase font-semibold">Senior Admin</p>
            </motion.div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={handleLogout}
            className="mt-6 w-full flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </button>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-accent text-bg-main border border-sidebar-bg flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
    </>
  );
}
