/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Award,
  Check
} from 'lucide-react';
import { DoctorService, ClinicService, UploadService } from '../services/adminService';
import { DoctorDTO, ClinicDTO, Specialization } from '../types';
import Modal from '../components/Modal';
import FloatingInput, { FloatingSelect, FloatingTextArea } from '../components/FloatingInput';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSearchStore } from '../store/useSearchStore';
import { useToast } from '../components/Toast';
import { useRealtimeCollection } from '../hooks/useRealtimeCollection';
import { useFetchGuard } from '../hooks/useFetchGuard';

const SPECIALIZATIONS: Specialization[] = [
  'Prosthodontist',
  'Implantologist',
  'Orthodontist',
  'Oral & Maxillofacial Surgeon',
  'Aesthetic Dentist',
  'Cosmetic Dentist',
  'Endodontist',
  'Periodontist',
  'Pedodontist',
  'Oral Physician',
];

export default function DoctorsPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();
  const { data: doctors, loading } = useRealtimeCollection<DoctorDTO>(DoctorService.getAll, {
    eventName: 'doctorUpdated',
    initialData: [],
  });
  const [clinics, setClinics] = useState<ClinicDTO[]>([]);
  const { globalSearchQuery, setGlobalSearchQuery } = useSearchStore();
  const [filterSpec, setFilterSpec] = useState<Specialization | 'All'>('All');
  const [filterState, setFilterState] = useState<'All' | 'Telangana' | 'Andhra Pradesh'>('All');
  
  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DoctorDTO | null>(null);

  const [formData, setFormData] = useState<Partial<DoctorDTO>>({
    name: '',
    specialization: [],
    qualifications: '',
    bio: '',
    state: 'Telangana',
  });

  const { guardedFetch } = useFetchGuard();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const cRes = await ClinicService.getAll();
        setClinics(cRes);
      } catch (error) {
        console.error('Failed to fetch clinics:', error);
        showToast(error instanceof Error ? error.message : 'Failed to fetch doctors', 'error');
      }
    };

    void guardedFetch(fetchClinics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = (doc?: DoctorDTO) => {
    if (doc) {
      setSelectedDoc(doc);
      setFormData({
        ...doc,
        specialization: Array.isArray(doc.specialization)
          ? doc.specialization
          : doc.specialization
            ? [doc.specialization as unknown as string]
            : [],
        state: doc.state || 'Telangana',
      });
    } else {
      setSelectedDoc(null);
      setFormData({
        name: '',
        specialization: [],
        qualifications: '',
        bio: '',
        state: 'Telangana',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedDoc) {
        await DoctorService.update(selectedDoc._id, formData);
        showToast('Specialist updated successfully');
      } else {
        await DoctorService.create(formData);
        showToast('Specialist registered successfully');
      }
      setIsModalOpen(false);
      // No manual fetchData needed here as socket will broadcast the change
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Action failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this medical professional?')) {
      try {
        await DoctorService.delete(id);
        showToast('Specialist removed from network');
        // No manual fetchData needed here
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Delete failed', 'error');
      }
    }
  };

  const filteredDoctors = (Array.isArray(doctors) ? doctors : []).filter((doc) => {
    const query = globalSearchQuery.toLowerCase();
    const matchesSearch =
      (doc.name || '').toLowerCase().includes(query) ||
      (doc.qualifications || '').toLowerCase().includes(query);
    const specs = Array.isArray(doc.specialization) ? doc.specialization : [doc.specialization as unknown as string];
    const matchesSpec = filterSpec === 'All' || specs.includes(filterSpec);
    const matchesState = filterState === 'All' || doc.state === filterState;
    return matchesSearch && matchesSpec && matchesState;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-light tracking-tight text-text-primary">
            {t('medicalSpecialists').split(' ')[0]} <span className="text-accent italic">{t('medicalSpecialists').split(' ')[1]}</span>
          </h2>
          <p className="text-text-secondary text-sm mt-1">{t('specialistProfiles')}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-accent flex items-center gap-2 px-6 py-3"
        >
          <Plus size={18} /> {t('registerDoctor')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or qualification..." 
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="w-full bg-sidebar-bg border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-text-primary text-sm outline-none focus:border-accent transition-all"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <select 
              value={filterSpec}
              onChange={(e) => setFilterSpec(e.target.value as any)}
              className="w-full bg-sidebar-bg border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-text-primary text-sm outline-none appearance-none cursor-pointer focus:border-accent"
            >
              <option value="All">All Specializations</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="relative min-w-[200px]">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <select 
              value={filterState}
              onChange={(e) => setFilterState(e.target.value as any)}
              className="w-full bg-sidebar-bg border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-text-primary text-sm outline-none appearance-none cursor-pointer focus:border-accent"
            >
              <option value="All">All Branches</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="glass-panel h-[400px] animate-pulse bg-text-primary/5 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((doc) => (
                <motion.div
                key={doc._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative glass-panel overflow-hidden flex flex-col h-full bg-sidebar-bg hover:shadow-2xl transition-all duration-500 rounded-2xl border border-border-subtle"
              >
                {/* Actions */}
                <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(doc)} className="p-2 bg-text-primary/5 hover:bg-accent hover:text-bg-main rounded-lg transition-all text-text-primary backdrop-blur-md border border-border-subtle">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(doc._id)} className="p-2 bg-text-primary/5 hover:bg-red-500 hover:text-white rounded-lg transition-all text-text-primary backdrop-blur-md border border-border-subtle">
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Profile Section */}
                <div className="p-8 pb-4">
                  <div className="flex items-start gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors truncate">{doc.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[8px] text-accent uppercase font-bold tracking-tighter">
                          {doc.state}
                        </span>
                      </div>
                      <p className="text-accent text-[10px] uppercase tracking-widest font-bold">
                        {Array.isArray(doc.specialization) ? doc.specialization.join(', ') : doc.specialization}
                      </p>
                      <div className="flex flex-col gap-1 mt-2">
                        <span className="text-text-muted text-[10px] font-medium truncate uppercase tracking-tighter">{doc.qualifications}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-2 overflow-hidden">
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 italic">"{doc.bio}"</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* CRUD Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedDoc ? 'Refine Specialist Profile' : 'Register New Specialist'}
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingSelect 
              label="Branch (State)" 
              required
              value={formData.state || 'Telangana'}
              onChange={(e) => setFormData({...formData, state: e.target.value as any})}
              options={[
                { label: 'Telangana', value: 'Telangana' },
                { label: 'Andhra Pradesh', value: 'Andhra Pradesh' }
              ]}
            />
            <FloatingInput 
              label={t('doctorName')} 
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {/* ── Multi-select Specialization Picker ── */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold ml-2">
                {t('specialization')} <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SPECIALIZATIONS.map((spec) => {
                  const selected = (Array.isArray(formData.specialization) ? formData.specialization : []).includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => {
                        const current = Array.isArray(formData.specialization) ? formData.specialization : [];
                        const next = selected
                          ? current.filter((s) => s !== spec)
                          : [...current, spec];
                        setFormData({ ...formData, specialization: next });
                      }}
                      className={`px-3 py-2 rounded-xl border text-left transition-all flex items-center justify-between text-xs font-bold ${
                        selected
                          ? 'bg-accent/10 border-accent text-accent shadow-[0_0_12px_rgba(212,175,55,0.1)]'
                          : 'bg-text-primary/5 border-border-subtle text-text-muted hover:border-accent/40'
                      }`}
                    >
                      <span className="truncate">{spec}</span>
                      {selected && <Check size={12} className="shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <FloatingInput 
              label={t('qualifications')} 
              required
              value={formData.qualifications || ''}
              onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
            />
          </div>

          <FloatingTextArea 
            label={t('professionalBio')} 
            required
            value={formData.bio || ''}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
          />

          <div className="flex justify-end gap-4 pt-4 border-t border-border-subtle">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl text-text-muted hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-accent text-bg-main font-bold uppercase tracking-widest text-xs rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
            >
              {selectedDoc ? 'Update Profile' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
