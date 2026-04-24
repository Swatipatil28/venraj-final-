/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Ban,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Users,
  X,
} from 'lucide-react';
import { AppointmentDTO, AppointmentStatus, ClinicDTO, DoctorDTO, ServiceDTO } from '../types';
import { AppointmentService, ClinicService, DoctorService, ServiceService } from '../services/adminService';
import { useToast } from '../components/Toast';
import { useLanguageStore } from '../store/useLanguageStore';
import FloatingInput, { FloatingSelect, FloatingTextArea } from '../components/FloatingInput';

const statusStyles: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
};

const emptyAppointment: Partial<AppointmentDTO> = {
  patientName: '',
  phone: '',
  age: 0,
  gender: 'Male',
  symptoms: '',
  medicalHistory: '',
  pastDentalHistory: '',
  medications: '',
  clinicId: '',
  clinicName: '',
  serviceId: '',
  serviceName: '',
  preferredDate: new Date().toISOString().split('T')[0],
  appointmentTime: '10:00',
  status: 'pending',
};

export default function AppointmentsPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [clinics, setClinics] = useState<ClinicDTO[]>([]);
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);
  const [patientHistory, setPatientHistory] = useState<AppointmentDTO[]>([]);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Today' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');
  const [formData, setFormData] = useState<Partial<AppointmentDTO>>(emptyAppointment);

  useEffect(() => {
    void fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedAppointment?.phone) {
      setPatientHistory(
        appointments.filter(
          (appointment) =>
            appointment.phone === selectedAppointment.phone && appointment._id !== selectedAppointment._id
        )
      );
      return;
    }
    setPatientHistory([]);
  }, [appointments, selectedAppointment]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, doctorsData, clinicsData, servicesData] = await Promise.all([
        AppointmentService.getAppointments(),
        DoctorService.getAll(),
        ClinicService.getAll(),
        ServiceService.getAll(),
      ]);

      setAppointments(appointmentsData);
      setDoctors(doctorsData);
      setClinics(clinicsData);
      setServices(servicesData);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.phone.includes(searchTerm);

      if (!matchesSearch) {
        return false;
      }

      const today = new Date().toISOString().split('T')[0];
      if (activeTab === 'Today') return appointment.preferredDate === today;
      if (activeTab === 'Upcoming') return appointment.preferredDate > today && !['completed', 'cancelled'].includes(appointment.status);
      if (activeTab === 'Completed') return appointment.status === 'completed';
      if (activeTab === 'Cancelled') return appointment.status === 'cancelled';
      return true;
    });
  }, [activeTab, appointments, searchTerm]);

  const isReturningPatient = (phone: string, currentId: string) =>
    appointments.some((appointment) => appointment.phone === phone && appointment._id !== currentId);

  const handleCreateAppointment = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      await AppointmentService.create(formData);
      await fetchInitialData();
      setIsNewModalOpen(false);
      setFormData(emptyAppointment);
      showToast('Appointment scheduled successfully');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to schedule appointment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mergeAppointment = (updated: AppointmentDTO) => {
    setAppointments((prev) => prev.map((appointment) => (appointment._id === updated._id ? updated : appointment)));
    setSelectedAppointment((prev) => (prev?._id === updated._id ? updated : prev));
  };

  const handleUpdateAppointment = async (id: string, updates: Partial<AppointmentDTO>) => {
    try {
      const updated = await AppointmentService.update(id, updates);
      mergeAppointment(updated);
      showToast('Appointment updated successfully');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update appointment', 'error');
    }
  };

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    const previousAppointments = appointments;
    const previousSelectedAppointment = selectedAppointment;

    setAppointments((prev) => prev.map((appointment) => (appointment._id === id ? { ...appointment, status } : appointment)));
    setSelectedAppointment((prev) => (prev?._id === id ? { ...prev, status } : prev));

    try {
      const updated = await AppointmentService.updateStatus(id, status);
      mergeAppointment(updated);
      showToast('Appointment status updated');
    } catch (error) {
      setAppointments(previousAppointments);
      setSelectedAppointment(previousSelectedAppointment);
      showToast(error instanceof Error ? error.message : 'Failed to update appointment status', 'error');
    }
  };

  const handleWhatsApp = (appointment: AppointmentDTO) => {
    const message = `Hello ${appointment.patientName}, regarding your appointment at H&H Dental Services for ${appointment.serviceName || appointment.service}. Status: ${appointment.status}.`;
    window.open(`https://wa.me/${appointment.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-light tracking-tight text-text-primary">
              {t('appointments').split(' ')[0]} <span className="text-accent italic">{t('appointments').split(' ')[1] || ''}</span>
            </h2>
            <span className="h-fit rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-blue-500">
              {t('clinicOS')}
            </span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">Real-time patient flow management for H&H DENTAL.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => setIsNewModalOpen(true)} className="btn-accent flex items-center gap-2">
            <Plus size={16} /> {t('newAppointment')}
          </button>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-64 rounded-xl border border-border-subtle bg-sidebar-bg py-2.5 pl-12 pr-4 text-sm text-text-secondary shadow-xl transition-all focus:border-accent/50 focus:outline-none"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="flex rounded-xl border border-border-subtle bg-sidebar-bg p-1 shadow-xl">
            {(['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-accent text-bg-main shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-text-primary/[0.02] text-[10px] font-bold uppercase tracking-widest text-text-muted">
              <tr className="border-b border-border-subtle">
                <th className="px-8 py-4 font-semibold">{t('patientName')}</th>
                <th className="px-8 py-4 font-semibold">{t('phone')}</th>
                <th className="px-8 py-4 font-semibold">{t('age')}</th>
                <th className="px-8 py-4 font-semibold">{t('gender')}</th>
                <th className="px-8 py-4 font-semibold">{t('clinic')}</th>
                <th className="px-8 py-4 font-semibold">{t('selectedService')}</th>
                <th className="px-8 py-4 font-semibold">{t('date')}</th>
                <th className="px-8 py-4 font-semibold">{t('status')}</th>
                <th className="px-8 py-4 text-right font-semibold">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-8 py-20 text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                    <p className="text-sm text-text-muted">Loading clinical data...</p>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-8 py-20 text-center text-sm italic text-text-muted">
                    No records found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="cursor-pointer transition-colors hover:bg-text-primary/[0.02]"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">{appointment.patientName}</span>
                        {isReturningPatient(appointment.phone, appointment._id) && (
                          <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-emerald-500">
                            {t('returningPatient')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-text-secondary">{appointment.phone}</td>
                    <td className="px-8 py-6 text-sm text-text-secondary">{appointment.age || '-'}</td>
                    <td className="px-8 py-6 text-sm text-text-secondary">{appointment.gender || 'Other'}</td>
                    <td className="px-8 py-6 text-sm text-text-secondary">{appointment.clinicName || appointment.clinic || '-'}</td>
                    <td className="px-8 py-6 text-sm text-text-secondary">{appointment.serviceName || appointment.service || '-'}</td>
                    <td className="px-8 py-6 text-sm text-text-secondary">{appointment.preferredDate}</td>
                    <td className="px-8 py-6">
                      <span className={`status-badge inline-block min-w-[90px] text-center ${statusStyles[appointment.status]}`}>{t(appointment.status)}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{t('viewDetails')}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-main/80 p-6 backdrop-blur-sm"
            onClick={() => setSelectedAppointment(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border-subtle bg-sidebar-bg shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between bg-accent px-8 py-6">
                <div>
                  <h3 className="text-2xl font-bold text-bg-main">{selectedAppointment.patientName}</h3>
                  <p className="text-sm text-bg-main/70">{selectedAppointment.phone}</p>
                </div>
                <button onClick={() => setSelectedAppointment(null)} className="rounded-full bg-bg-main/10 p-2 text-bg-main">
                  <X size={22} />
                </button>
              </div>

              <div className="grid gap-8 p-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="glass-panel p-5">
                    <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('patientDetails')}</h4>
                    <div className="space-y-3 text-sm text-text-secondary">
                      <p>Age: <span className="text-text-primary">{selectedAppointment.age || '-'}</span></p>
                      <p>Gender: <span className="text-text-primary">{selectedAppointment.gender || 'Other'}</span></p>
                      <p>Clinic: <span className="text-text-primary">{selectedAppointment.clinicName || selectedAppointment.clinic || '-'}</span></p>
                      <p>Service: <span className="text-text-primary">{selectedAppointment.serviceName || selectedAppointment.service || '-'}</span></p>
                      <p>Date: <span className="text-text-primary">{selectedAppointment.preferredDate}</span></p>
                      <p>Status: <span className="text-text-primary">{selectedAppointment.status}</span></p>
                    </div>
                  </div>

                  <div className="glass-panel p-5">
                    <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('assignmentControls')}</h4>
                    <div className="space-y-4">
                      <FloatingSelect
                        label="Assign Specialist"
                        value={selectedAppointment.doctorId || ''}
                        onChange={(event) => {
                          const doctor = doctors.find((item) => item._id === event.target.value);
                          void handleUpdateAppointment(selectedAppointment._id, { doctorId: event.target.value, doctorName: doctor?.name });
                        }}
                        options={doctors.map((doctor) => ({ label: doctor.name, value: doctor._id }))}
                      />
                      <FloatingInput type="text" label={t('facilityBranch')} value={selectedAppointment.clinicName || selectedAppointment.clinic || ''} onChange={() => undefined} disabled />
                      <FloatingInput type="text" label={t('scheduleDate')} value={selectedAppointment.preferredDate} onChange={() => undefined} disabled />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-panel p-5">
                    <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('patientHistory')}</h4>
                    {patientHistory.length === 0 ? (
                      <p className="text-sm italic text-text-muted">{t('firstTimePatient')}</p>
                    ) : (
                      <div className="space-y-3">
                        {patientHistory.map((history) => (
                          <div key={history._id} className="rounded-2xl border border-border-subtle p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-text-primary">{history.serviceName || history.service}</span>
                              <span className={`rounded px-2 py-1 text-[9px] font-bold uppercase ${statusStyles[history.status]}`}>{history.status}</span>
                            </div>
                            <p className="mt-2 text-xs text-text-secondary">{history.preferredDate} • {history.clinicName || history.clinic}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="glass-panel p-5">
                    <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('chiefComplaints')}</h4>
                    <p className="mb-4 text-sm italic text-text-secondary">"{selectedAppointment.symptoms}"</p>
                    <FloatingTextArea
                      label={t('clinicalNotes')}
                      value={selectedAppointment.notes || ''}
                      onChange={(event) => void handleUpdateAppointment(selectedAppointment._id, { notes: event.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle bg-sidebar-bg/95 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => void handleUpdateStatus(selectedAppointment._id, 'confirmed')}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-bold uppercase transition-all ${
                      selectedAppointment.status === 'confirmed' ? 'border-blue-500 bg-blue-500/20 text-blue-500' : 'border-border-subtle text-text-muted'
                    }`}
                  >
                    <CheckCircle2 size={14} /> {t('confirmed')}
                  </button>
                  <button
                    onClick={() => void handleUpdateStatus(selectedAppointment._id, 'completed')}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-bold uppercase transition-all ${
                      selectedAppointment.status === 'completed' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-border-subtle text-text-muted'
                    }`}
                  >
                    <CheckCircle2 size={14} /> {t('completed')}
                  </button>
                  <button
                    onClick={() => void handleUpdateStatus(selectedAppointment._id, 'cancelled')}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-bold uppercase transition-all ${
                      selectedAppointment.status === 'cancelled' ? 'border-rose-500 bg-rose-500/20 text-rose-500' : 'border-border-subtle text-text-muted'
                    }`}
                  >
                    <Ban size={14} /> {t('cancelled')}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a href={`tel:${selectedAppointment.phone}`} className="btn-accent flex items-center gap-2">
                    <Phone size={16} /> {t('callPatient')}
                  </a>
                  <button onClick={() => handleWhatsApp(selectedAppointment)} className="rounded-xl bg-[#25D366] px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white">
                    <span className="flex items-center gap-2">
                      <MessageCircle size={16} /> WhatsApp
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-main/80 p-6 backdrop-blur-sm"
            onClick={() => setIsNewModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border-subtle bg-sidebar-bg shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border-subtle p-8">
                <h3 className="text-xl font-bold uppercase tracking-widest text-text-primary">{t('newAppointment')}</h3>
                <button onClick={() => setIsNewModalOpen(false)} className="text-text-muted hover:text-text-primary">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateAppointment} className="max-h-[70vh] space-y-6 overflow-y-auto p-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FloatingInput label={t('patientName')} required value={formData.patientName || ''} onChange={(event) => setFormData({ ...formData, patientName: event.target.value })} />
                  <FloatingInput label={t('phone')} required value={formData.phone || ''} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} />
                  <FloatingInput label={t('age')} type="number" required value={formData.age || ''} onChange={(event) => setFormData({ ...formData, age: Number(event.target.value) })} />
                  <FloatingSelect
                    label={t('gender')}
                    required
                    value={formData.gender || 'Male'}
                    onChange={(event) => setFormData({ ...formData, gender: event.target.value as AppointmentDTO['gender'] })}
                    options={[
                      { label: t('male'), value: 'Male' },
                      { label: t('female'), value: 'Female' },
                      { label: t('other'), value: 'Other' },
                    ]}
                  />
                  <FloatingSelect
                    label={t('facilityBranch')}
                    required
                    value={formData.clinicId || ''}
                    onChange={(event) => {
                      const clinic = clinics.find((item) => item._id === event.target.value);
                      setFormData({ ...formData, clinicId: event.target.value, clinicName: clinic?.name, clinic: clinic?.name });
                    }}
                    options={clinics.map((clinic) => ({ label: clinic.name, value: clinic._id }))}
                  />
                  <FloatingSelect
                    label={t('selectedService')}
                    required
                    value={formData.serviceId || ''}
                    onChange={(event) => {
                      const service = services.find((item) => item._id === event.target.value);
                      setFormData({ ...formData, serviceId: event.target.value, serviceName: service?.name, service: service?.name });
                    }}
                    options={services.map((service) => ({ label: service.name, value: service._id }))}
                  />
                  <FloatingInput label={t('scheduleDate')} type="date" required value={formData.preferredDate || ''} onChange={(event) => setFormData({ ...formData, preferredDate: event.target.value })} />
                  <FloatingInput label={t('slotTime')} type="time" required value={formData.appointmentTime || ''} onChange={(event) => setFormData({ ...formData, appointmentTime: event.target.value })} />
                </div>

                <FloatingTextArea label={t('symptoms')} required value={formData.symptoms || ''} onChange={(event) => setFormData({ ...formData, symptoms: event.target.value })} />
                <FloatingTextArea label={t('pastMedicalHistory')} value={formData.medicalHistory || ''} onChange={(event) => setFormData({ ...formData, medicalHistory: event.target.value })} />
                <FloatingTextArea label={t('pastDentalHistory')} value={formData.pastDentalHistory || ''} onChange={(event) => setFormData({ ...formData, pastDentalHistory: event.target.value })} />
                <FloatingTextArea label={t('currentMedications')} value={formData.medications || ''} onChange={(event) => setFormData({ ...formData, medications: event.target.value })} />

                <div className="flex justify-end gap-4 border-t border-border-subtle pt-6">
                  <button type="button" onClick={() => setIsNewModalOpen(false)} className="px-6 py-3 text-text-muted">
                    Cancel
                  </button>
                  <button type="submit" className="btn-accent">
                    Confirm & Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
