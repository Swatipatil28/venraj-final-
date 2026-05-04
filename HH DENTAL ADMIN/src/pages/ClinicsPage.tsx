/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Trash2, 
  Edit2, 
  Navigation,
  Globe,
  ChevronRight,
  Check
} from 'lucide-react';
import { ClinicService } from '../services/adminService';
import { ClinicDTO } from '../types';
import Modal from '../components/Modal';
import FloatingInput, { FloatingSelect, FloatingTextArea } from '../components/FloatingInput';
import { useLanguageStore } from '../store/useLanguageStore';

import { useToast } from '../components/Toast';
import { socket } from '../utils/socket';

export default function ClinicsPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();
  const [clinics, setClinics] = useState<ClinicDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<ClinicDTO | null>(null);
  const [formData, setFormData] = useState<Partial<ClinicDTO>>({
    name: '',
    phone: '',
    state: 'Telangana',
  });

  useEffect(() => {
    fetchData();

    // Socket.io for real-time updates
    socket.on('locationUpdated', (data: ClinicDTO[]) => {
      setClinics(data);
    });

    return () => {
      socket.off('locationUpdated');
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await ClinicService.getAll();
      setClinics(data);
    } catch (error) {
      console.error('Failed to fetch clinics:', error);
      showToast(error instanceof Error ? error.message : 'Failed to fetch clinics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (clinic?: ClinicDTO) => {
    if (clinic) {
      setSelectedClinic(clinic);
      setFormData(clinic);
    } else {
      setSelectedClinic(null);
      setFormData({
        name: '',
        phone: '',
        state: 'Telangana',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedClinic) {
        await ClinicService.update(selectedClinic._id, formData);
        showToast('Facility updated successfully');
      } else {
        await ClinicService.create(formData);
        showToast('Facility registered successfully');
      }
      setIsModalOpen(false);
      // No manual fetchData needed here as socket handles it
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Facility update failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Decommission this clinical facility?')) {
      try {
        await ClinicService.delete(id);
        showToast('Facility removed from network');
        // No manual fetchData needed here
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Delete failed', 'error');
      }
    }
  };

  const groups = {
    'Telangana': clinics.filter(c => c.state === 'Telangana'),
    'Andhra Pradesh': clinics.filter(c => c.state === 'Andhra Pradesh'),
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-light tracking-tight text-text-primary">
            {t('expansionNetwork').split(' ')[0]} <span className="text-accent italic">{t('expansionNetwork').split(' ')[1]}</span>
          </h2>
          <p className="text-text-secondary text-sm mt-1">{t('latestPatientRequests')}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-accent flex items-center gap-2 px-8 py-4"
        >
          <Plus size={18} /> {t('addFacility')}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2].map(i => (
            <div key={i} className="glass-panel h-64 animate-pulse bg-text-primary/5 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-16">
          {(Object.entries(groups) as [keyof typeof groups, ClinicDTO[]][]).map(([state, stateClinics]) => stateClinics.length > 0 && (
            <div key={state} className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-border-subtle" />
                <h3 className="text-[10px] text-accent font-bold uppercase tracking-[0.4em] bg-text-primary/[0.02] px-6 py-2 rounded-full border border-border-subtle">
                  {state}
                </h3>
                <span className="h-px flex-1 bg-border-subtle" />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {stateClinics.map((clinic) => (
                    <motion.div
                      key={clinic._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass-panel group relative overflow-hidden bg-sidebar-bg transition-all duration-500 rounded-3xl border border-border-subtle"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-1 p-8">
                          <div className="flex items-start justify-between mb-8">
                            <div>
                              <h3 className="text-2xl font-bold text-text-primary group-hover:text-accent transition-colors">{clinic.name || 'Unnamed Clinic'}</h3>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleOpenModal(clinic)} className="p-2.5 text-text-muted hover:text-text-primary transition-colors bg-text-primary/5 rounded-xl border border-border-subtle">
                                <Edit2 size={18} />
                              </button>
                              <button onClick={() => handleDelete(clinic._id)} className="p-2.5 text-text-muted hover:text-red-400 transition-colors bg-text-primary/5 rounded-xl border border-border-subtle">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex items-start gap-4">
                                <Phone size={18} className="text-accent mt-1 flex-shrink-0" />
                                <div>
                                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest block mb-1">{t('inquiry')}</span>
                                  <p className="text-xs text-text-secondary font-mono tracking-tight">{clinic.phone}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedClinic ? 'Refine Facility Details' : 'Register New Hub'}
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              label="Clinic Name (Area based)" 
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <FloatingInput 
            label={t('phone')} 
            required
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />

          <div className="flex justify-end gap-4 pt-8 border-t border-border-subtle">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 rounded-xl text-text-muted hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-10 py-4 bg-accent text-bg-main font-bold uppercase tracking-widest text-xs rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center gap-3"
            >
              {selectedClinic ? 'Update Facility' : 'Register Location'} <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
