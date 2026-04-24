/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { AppointmentService } from '../services/adminService';
import { AppointmentDTO } from '../types';
import { useLanguageStore } from '../store/useLanguageStore';
import { useToast } from '../components/Toast';

export default function DashboardPage() {
  const { t, language } = useLanguageStore();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await AppointmentService.getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Dashboard data fetch failed:', error);
        showToast(error instanceof Error ? error.message : 'Failed to load appointments', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.preferredDate === today);
  const upcomingAppointments = appointments.filter(a => new Date(a.preferredDate) > new Date());
  
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const totalRelevant = pendingCount + confirmedCount;
  const conversionRate = totalRelevant > 0 ? ((confirmedCount / totalRelevant) * 100).toFixed(1) : '0';

  // Find most booked service
  const serviceCounts = appointments.reduce((acc: any, curr) => {
    acc[curr.serviceName || 'General'] = (acc[curr.serviceName || 'General'] || 0) + 1;
    return acc;
  }, {});
  const mostBookedService = Object.entries(serviceCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A';

  const statusColors = {
    pending: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    confirmed: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    completed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    cancelled: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
  };

  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-light tracking-tight text-text-primary">{t('managementOverview').split(' ')[0]} <span className="text-accent italic">{t('managementOverview').split(' ')[1]}</span></h2>
          </div>
          <p className="text-text-muted text-sm mt-1">{t('performanceTracking')} {new Date().toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
        </div>
        <button className="btn-accent font-bold">{t('exportCsv')}</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('todaysRequests')} 
          value={loading ? '...' : todayAppointments.length.toLocaleString()} 
          icon={CalendarCheck} 
          trend={{ value: 4.2, isUp: true }}
          color="gold"
        />
        <StatCard 
          title={t('upcomingSchedule')} 
          value={loading ? '...' : upcomingAppointments.length} 
          icon={Clock} 
          color="copper"
        />
        <StatCard 
          title={t('conversionRate')} 
          value={loading ? '...' : `${conversionRate}%`} 
          icon={TrendingUp} 
          trend={{ value: 1.5, isUp: true }}
          color="blue"
        />
        <StatCard 
          title={t('mostDemanded')} 
          value={loading ? '...' : mostBookedService} 
          icon={Users} 
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="xl:col-span-2 glass-panel overflow-hidden">
          <div className="px-8 py-6 border-b border-border-subtle flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{t('recentAppointments')}</h2>
              <p className="text-sm text-text-secondary mt-1">{t('latestPatientRequests')}</p>
            </div>
            <button className="btn-slate flex items-center gap-2 text-sm">
              {t('viewAll')} <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-text-primary/[0.02] text-[10px] text-text-muted uppercase tracking-widest font-bold">
                <tr className="border-b border-border-subtle">
                  <th className="px-8 py-4 font-semibold">{t('patient')}</th>
                  <th className="px-8 py-4 font-semibold">{t('clinic')}</th>
                  <th className="px-8 py-4 font-semibold">{t('selectedService')}</th>
                  <th className="px-8 py-4 font-semibold">{t('date')}</th>
                  <th className="px-8 py-4 font-semibold">{t('status')}</th>
                  <th className="px-8 py-4 font-semibold text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-text-muted text-sm">
                      Syncing data with H&H servers...
                    </td>
                  </tr>
                ) : recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-text-muted text-sm italic">
                      No recent clinical activities found.
                    </td>
                  </tr>
                ) : recentAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-text-primary/[0.02] transition-colors cursor-pointer group" onClick={() => setSelectedAppointment(apt)}>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{apt.patientName}</span>
                        <span className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">{apt.phone} • {apt.age || '-'} • {apt.gender || 'Other'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-text-secondary">{apt.clinicName || apt.clinic || '-'}</td>
                    <td className="px-8 py-5 text-sm text-text-secondary">{apt.serviceName || apt.service || '-'}</td>
                    <td className="px-8 py-5 text-sm text-text-secondary">{apt.preferredDate}</td>
                    <td className="px-8 py-5">
                      <span className={`status-badge min-w-[80px] text-center inline-block ${statusColors[apt.status as keyof typeof statusColors]}`}>
                        {t(apt.status)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-accent font-bold text-[10px] uppercase tracking-widest group-hover:underline">{t('viewDetails')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights / Small Chart Placeholder */}
        <div className="space-y-6">
          <div className="glass-panel p-8">
            <h2 className="text-xl font-bold text-text-primary mb-6">{t('serviceInsights')}</h2>
            <div className="space-y-6">
              {[
                { name: 'Teeth Whitening', value: 45, trend: 12, color: 'bg-accent' },
                { name: 'Dental Implants', value: 32, trend: 8, color: 'bg-accent/80' },
                { name: 'Root Canal', value: 24, trend: -5, color: 'bg-blue-500' },
                { name: 'Orthodontics', value: 18, trend: 15, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{item.name}</span>
                    <span className="text-text-primary font-bold">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-text-primary/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full ${item.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-accent/5 rounded-2xl border border-accent/10">
              <div className="flex items-center gap-3 text-accent mb-2">
                <TrendingUp size={20} />
                <span className="font-bold">{t('growthTip')}</span>
              </div>
              <p className="text-xs text-accent leading-relaxed font-bold">
                {language === 'te' 
                  ? "ఆర్థోడాంటిక్స్ కోసం అపాయింట్‌మెంట్ అభ్యర్థనలు ఈ వారం 15% పెరిగాయి. డాక్టర్ శర్మ కోసం మరిన్ని సమయాలను కేటాయించడాన్ని పరిగణించండి."
                  : "Appointment requests for Orthodontics have increased by 15% this week. Consider adding more time slots for Dr. Sharma."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedAppointment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-main/80 p-6" onClick={() => setSelectedAppointment(null)}>
          <div className="w-full max-w-2xl rounded-3xl border border-border-subtle bg-sidebar-bg p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{selectedAppointment.patientName}</h3>
                <p className="text-sm text-text-secondary">{selectedAppointment.phone}</p>
              </div>
              <button className="btn-slate" onClick={() => setSelectedAppointment(null)}>Close</button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="glass-panel p-4 text-sm text-text-secondary">Age: <span className="text-text-primary">{selectedAppointment.age || '-'}</span></div>
              <div className="glass-panel p-4 text-sm text-text-secondary">Gender: <span className="text-text-primary">{selectedAppointment.gender || 'Other'}</span></div>
              <div className="glass-panel p-4 text-sm text-text-secondary">Clinic: <span className="text-text-primary">{selectedAppointment.clinicName || selectedAppointment.clinic || '-'}</span></div>
              <div className="glass-panel p-4 text-sm text-text-secondary">Service: <span className="text-text-primary">{selectedAppointment.serviceName || selectedAppointment.service || '-'}</span></div>
              <div className="glass-panel p-4 text-sm text-text-secondary">Preferred Date: <span className="text-text-primary">{selectedAppointment.preferredDate}</span></div>
              <div className="glass-panel p-4 text-sm text-text-secondary">Status: <span className="text-text-primary">{selectedAppointment.status}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
