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
  Check,
  Upload,
  ImageIcon,
  Loader2
} from 'lucide-react';
import { DoctorService, ClinicService, UploadService } from '../services/adminService';
import { DoctorDTO, ClinicDTO, Specialization } from '../types';
import Modal from '../components/Modal';
import FloatingInput, { FloatingSelect, FloatingTextArea } from '../components/FloatingInput';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSearchStore } from '../store/useSearchStore';
import { useToast } from '../components/Toast';

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
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [clinics, setClinics] = useState<ClinicDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { globalSearchQuery, setGlobalSearchQuery } = useSearchStore();
  const [filterSpec, setFilterSpec] = useState<Specialization | 'All'>('All');
  
  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DoctorDTO | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await UploadService.uploadImage(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      showToast('Profile image updated');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };
  const [formData, setFormData] = useState<Partial<DoctorDTO>>({
    name: '',
    specialization: [],
    experience: 0,
    qualifications: '',
    assignedClinicIds: [],
    bio: '',
    image: '',
  });

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
      // Ensure specialization is always an array when opening modal
      setFormData({
        ...doc,
        specialization: Array.isArray(doc.specialization)
          ? doc.specialization
          : doc.specialization
            ? [doc.specialization as unknown as string]
            : [],
      });
    } else {
      setSelectedDoc(null);
      setFormData({
        name: '',
        specialization: [],
        experience: 0,
        qualifications: '',
        assignedClinicIds: [],
        bio: '',
        image: '',
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

  const filteredDoctors = doctors.filter((doc) => {
    const query = globalSearchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(query) ||
      doc.qualifications.toLowerCase().includes(query);
    const specs = Array.isArray(doc.specialization) ? doc.specialization : [doc.specialization as unknown as string];
    const matchesSpec = filterSpec === 'All' || specs.includes(filterSpec);
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
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
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

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors truncate">{doc.name}</h3>
                      <p className="text-accent text-[10px] uppercase tracking-widest font-bold mt-1">
                        {Array.isArray(doc.specialization) ? doc.specialization.join(', ') : doc.specialization}
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
              {/* Comma-separated fallback input */}
              <p className="text-[10px] text-text-muted mt-1 ml-2">
                Or type comma-separated:&nbsp;
                <input
                  type="text"
                  placeholder="e.g. Orthodontist, Surgeon"
                  className="bg-transparent border-b border-border-subtle text-text-secondary text-[10px] outline-none w-48 px-1"
                  value={Array.isArray(formData.specialization) ? formData.specialization.join(', ') : ''}
                  onChange={(e) => {
                    const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    setFormData({ ...formData, specialization: arr });
                  }}
                />
              </p>
            </div>
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

          {/* ── Image Upload ── */}
          <div className="space-y-4">
            <label className="text-[10px] text-text-muted uppercase tracking-widest font-bold ml-2">Professional Visualization</label>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <FloatingInput
                  label="Profile Image URL"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
                <div className="relative group">
                  <input
                    type="file"
                    id="doctor-image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <label
                    htmlFor="doctor-image-upload"
                    className={`
                      flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed border-border-subtle 
                      bg-text-primary/[0.02] text-text-muted hover:text-accent hover:border-accent/40 cursor-pointer transition-all
                      ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Uploading from Device...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        <span>Upload from Local Device</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
              
              <div className="w-full md:w-32 h-32 rounded-2xl border border-border-subtle overflow-hidden bg-text-primary/[0.02] flex items-center justify-center relative group">
                {formData.image ? (
                  <>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=Invalid+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-bg-main/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon size={24} className="text-accent" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <ImageIcon size={32} strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">No Photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>



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
