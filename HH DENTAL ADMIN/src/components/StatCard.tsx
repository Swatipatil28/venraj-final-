/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: 'gold' | 'copper' | 'blue' | 'green';
}

const colorMap = {
  gold: 'text-accent bg-accent/10 border-accent/20',
  copper: 'text-brand-gold bg-brand-gold/10 border-brand-gold/20',
  blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  green: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
};

export default function StatCard({ title, value, icon: Icon, trend, color = 'gold' }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`glass-panel p-6 flex flex-col justify-between h-40 relative overflow-hidden group border-l-2 ${color === 'gold' ? 'border-accent' : color === 'copper' ? 'border-brand-gold/50' : 'border-border-subtle'}`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-[10px] text-text-muted uppercase tracking-widest font-bold">{title}</h3>
        <p className="text-4xl font-light text-text-primary tracking-tighter mt-2">{value}</p>
      </div>

      {trend ? (
        <div className={`text-[10px] font-bold mt-1 ${trend.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}% <span className="text-text-muted/60 font-normal">vs last month</span>
        </div>
      ) : (
        <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-wider">Performance Stable</p>
      )}

      {/* Subtle Icon Background */}
      <div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={40} className={colorMap[color].split(' ')[0]} />
      </div>
      {/* Background Glow */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
