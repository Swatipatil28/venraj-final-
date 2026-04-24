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
import { DoctorService, ClinicService } from '../services/adminService';
import { DoctorDTO, ClinicDTO, Specialization } from '../types';
import Modal from '../components/Modal';
import FloatingInput, { FloatingSelect, FloatingTextArea } from '../components/FloatingInput';
import { useLanguageStore } from '../store/useLanguageStore';
import { useToast } from '../components/Toast';

const SPECIALIZATIONS: Specialization[] = ['Prosthodontist', 'Implantologist', 'Orthodontist', 'Surgeon', 'Aesthetic Dentist'];

export default function DoctorsPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [clinics, setClinics] = useState<ClinicDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState<Specialization | 'All'>('All');
  
  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DoctorDTO | null>(null);
  const [formData, setFormData] = useState<Partial<DoctorDTO>>({
    name: '',
    specialization: 'Orthodontist',
    experience: 0,
    qualifications: '',
    assignedClinicIds: [],
    bio: '',
    image: ''
  } as any);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dRes, cRes] = await Promise.all([
        DoctorService.getAll(),
        ClinicService.getAll()
      ]);
      setDoctors(dRes);
      setClinics(cRes);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showToast(error instanceof Error ? error.message : 'Failed to fetch doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (doc?: DoctorDTO) => {
    if (doc) {
      setSelectedDoc(doc);
      setFormData(doc);
    } else {
      setSelectedDoc(null);
      setFormData({
        name: '',
        specialization: 'Orthodontist' as Specialization,
        experience: 0,
        qualifications: '',
        assignedClinicIds: [],
        bio: '',
        image: ''
      } as any);
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
      void fetchData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Action failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this medical professional?')) {
      try {
        await DoctorService.delete(id);
        showToast('Specialist removed from network');
        void fetchData();
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Delete failed', 'error');
      }
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                         doc.qualifications.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = filterSpec === 'All' || doc.specialization === filterSpec;
    return matchesSearch && matchesSpec;
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
          className="btn-accent flex items-center gap-2"
        >
          <Plus size={18} /> {t('registerDoctor')}
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or qualification..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sidebar-bg border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-text-primary text-sm outline-none focus:border-accent transition-all"
          />
        </div>
        <div className="relative">
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
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-accent/20 flex-shrink-0 group-hover:border-accent transition-all duration-700">
                      <img 
                        src={doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200'} 
                        alt={doc.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors truncate">{doc.name}</h3>
                      <p className="text-accent text-[10px] uppercase tracking-widest font-bold mt-1">
                        {doc.specialization}
                      </p>
                      <div className="flex flex-col gap-1 mt-2">
                        <span className="text-text-muted text-[10px] font-medium truncate uppercase tracking-tighter">{doc.qualifications}</span>
                        <div className="flex items-center gap-2 text-text-muted text-xs">
                          <Award size={14} className="text-accent" />
                          <span>{doc.experience} {t('experienceYears')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-2 overflow-hidden">
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 italic">"{doc.bio}"</p>
                </div>

                <div className="mt-auto p-8 pt-4 border-t border-border-subtle bg-text-primary/[0.01]">
                  <div className="flex flex-wrap gap-2">
                    {doc.assignedClinicIds.map(cid => {
                      const clinic = clinics.find(c => c._id === cid);
                      if (!clinic) return null;
                      return (
                        <span key={cid} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-text-primary/5 border border-border-subtle text-[10px] text-text-secondary uppercase tracking-widest font-medium group-hover:border-accent/40 transition-all">
                          <MapPin size={10} className="text-accent" />
                          {clinic.name}
                        </span>
                      );
                    })}
                  </div>
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
            <FloatingInput 
              label={t('doctorName')} 
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <FloatingSelect 
              label={t('specialization')}
              required
              value={formData.specialization || ''}
              onChange={(e) => setFormData({...formData, specialization: e.target.value as any})}
              options={SPECIALIZATIONS.map(s => ({ label: s, value: s }))}
            />
            <FloatingInput 
              label={t('experienceYearsLabel')} 
              type="number"
              required
              value={formData.experience || 0}
              onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
            />
            <FloatingInput 
              label={t('qualifications')} 
              required
              value={formData.qualifications || ''}
              onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
            />
          </div>

          <FloatingInput 
            label="Image URL" 
            value={formData.image || ''}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
          />
          {formData.image ? (
            <img
              src={formData.image}
              alt="Doctor preview"
              className="h-24 w-24 rounded-lg object-cover border border-border-subtle"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image";
              }}
            />
          ) : null}

          <div className="space-y-3">
            <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold ml-2">{t('assignedToClinics')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {clinics.map(clinic => (
                <button
                  key={clinic._id}
                  type="button"
                  onClick={() => {
                    const ids = formData.assignedClinicIds || [];
                    const newIds = ids.includes(clinic._id) 
                      ? ids.filter(id => id !== clinic._id)
                      : [...ids, clinic._id];
                    setFormData({...formData, assignedClinicIds: newIds});
                  }}
                  className={`
                    px-4 py-3 rounded-xl border text-left transition-all flex items-center justify-between
                    ${formData.assignedClinicIds?.includes(clinic._id) 
                      ? 'bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                      : 'bg-text-primary/5 border-border-subtle text-text-muted hover:border-accent/40'}
                  `}
                >
                  <span className="text-xs font-bold truncate">{clinic.name}</span>
                  {formData.assignedClinicIds?.includes(clinic._id) && <Check size={14} />}
                </button>
              ))}
            </div>
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
