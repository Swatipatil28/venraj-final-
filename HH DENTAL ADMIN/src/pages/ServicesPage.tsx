/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Sparkles, 
  Edit, 
  Trash, 
  CheckCircle,
  X,
  Layers,
  ArrowRight,
  Upload,
  ImageIcon,
  Loader2,
  Search
} from 'lucide-react';
import { ServiceService, UploadService } from '../services/adminService';
import { ServiceDTO, ServiceCategory } from '../types';
import Modal from '../components/Modal';
import FloatingInput, { FloatingSelect, FloatingTextArea } from '../components/FloatingInput';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSearchStore } from '../store/useSearchStore';

import { useToast } from '../components/Toast';

export default function ServicesPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ServiceCategory | 'All'>('All');
  
  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDTO | null>(null);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await UploadService.uploadImage(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      showToast('Image uploaded successfully');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const [formData, setFormData] = useState<Partial<ServiceDTO>>({
    name: '',
    category: 'Dental',
    description: '',
    benefits: [''],
    processSteps: [''],
    icon: 'Sparkles',
    image: ''
  } as any);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await ServiceService.getAll();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      showToast(error instanceof Error ? error.message : 'Failed to fetch services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: ServiceDTO) => {
    if (service) {
      setSelectedService(service);
      setFormData(service);
    } else {
      setSelectedService(null);
      setFormData({
        name: '',
        category: 'Dental' as ServiceCategory,
        description: '',
        benefits: [''],
        processSteps: [''],
        icon: 'Sparkles',
        image: ''
      } as any);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clean up empty strings in arrays
      const cleanedData = {
        ...formData,
        benefits: formData.benefits?.filter(b => b.trim() !== '') || [],
        processSteps: formData.processSteps?.filter(p => p.trim() !== '') || []
      };

      if (selectedService) {
        await ServiceService.update(selectedService._id, cleanedData);
        showToast('Service updated successfully');
      } else {
        await ServiceService.create(cleanedData);
        showToast('Service deployed successfully');
      }
      setIsModalOpen(false);
      void fetchData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Service sync failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this service permanently?')) {
      try {
        await ServiceService.delete(id);
        showToast('Service removed from catalog');
        void fetchData();
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Delete failed', 'error');
      }
    }
  };

  const { globalSearchQuery, setGlobalSearchQuery } = useSearchStore();

  const filteredServices = services.filter((service) => {
    const query = globalSearchQuery.toLowerCase();
    const matchesSearch =
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query);
    const matchesCategory = activeTab === 'All' || service.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-light tracking-tight text-text-primary">
            {t('clinicalCatalog').split(' ')[0]} <span className="text-accent italic">{t('clinicalCatalog').split(' ')[1]}</span>
          </h2>
          <p className="text-text-secondary text-sm mt-1">{t('specialistProfiles')}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-accent flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus size={18} /> {t('newService')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-4">
            <div className="flex rounded-xl border border-border-subtle bg-sidebar-bg p-1 shadow-xl">
              {(['All', 'Dental', 'Aesthetic'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'bg-accent text-bg-main shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t(tab.toLowerCase()) || tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-64 rounded-xl border border-border-subtle bg-sidebar-bg py-2.5 pl-12 pr-4 text-sm text-text-secondary shadow-xl transition-all focus:border-accent/50 focus:outline-none"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
              />
            </div>
          </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1,2].map(i => (
            <div key={i} className="glass-panel h-[400px] animate-pulse bg-text-primary/5 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
                <motion.div
                key={service._id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-10 relative group bg-sidebar-bg transition-all duration-500 rounded-3xl overflow-hidden border border-border-subtle"
              >
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className={`
                    p-4 rounded-2xl border transition-all duration-500
                    ${service.category === 'Dental' 
                      ? 'bg-accent/10 text-accent border-accent/20' 
                      : 'bg-brand-accent/10 text-brand-accent border-brand-accent/20'}
                  `}>
                    <Sparkles size={32} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`
                      px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border
                      ${service.category === 'Dental' 
                        ? 'text-accent border-accent/30 bg-accent/5' 
                        : 'text-brand-accent border-brand-accent/30 bg-brand-accent/5'}
                    `}>
                      {service.category}
                    </span>
                    <button onClick={() => handleOpenModal(service)} className="p-3 text-text-muted hover:text-text-primary transition-colors bg-text-primary/5 rounded-xl border border-border-subtle">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(service._id)} className="p-3 text-text-muted hover:text-red-400 transition-colors bg-text-primary/5 rounded-xl border border-border-subtle">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">{service.name}</h3>
                    <p className="text-text-secondary leading-relaxed text-sm">{service.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-border-subtle">
                    <div className="space-y-4">
                      <h4 className="text-[10px] text-accent font-bold uppercase tracking-[0.2em]">Key Benefits</h4>
                      <ul className="space-y-3">
                        {(service.benefits || []).slice(0, 3).map((benefit, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                            <CheckCircle size={14} className="text-accent flex-shrink-0" />
                            <span className="truncate">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] text-brand-accent font-bold uppercase tracking-[0.2em]">Clinical Flow</h4>
                      <div className="flex flex-col gap-2">
                        {(service.processSteps || []).slice(0, 3).map((step, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs text-text-muted">
                            <span className="h-4 w-4 rounded-full border border-border-subtle flex items-center justify-center text-[10px]">{i + 1}</span>
                            <span className="truncate">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Visual Accent */}
                <div className={`
                  absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[100px] transition-all duration-700
                  ${service.category === 'Dental' ? 'bg-accent/10' : 'bg-brand-accent/10'}
                `} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* CRUD Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedService ? 'Refine Service Details' : 'Architect New Service'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FloatingInput 
              label={t('serviceTitle')} 
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <FloatingSelect 
              label={t('clinicalCategory')} 
              required
              value={formData.category || ''}
              onChange={(e) => setFormData({...formData, category: e.target.value as any})}
              options={[
                { label: `${t('dental')} (Clinical Care)`, value: 'Dental' },
                { label: `${t('aesthetic')} (Smile Design)`, value: 'Aesthetic' }
              ]}
            />
          </div>

          <FloatingTextArea 
            label={t('serviceDescription')} 
            required
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          <div className="space-y-4">
            <label className="text-[10px] text-accent font-bold uppercase tracking-widest ml-2">Service Visualization</label>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <FloatingInput
                  label="Image URL (External or Uploaded)"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
                <div className="relative group">
                  <input
                    type="file"
                    id="service-image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <label
                    htmlFor="service-image-upload"
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
              
              <div className="w-full md:w-48 h-32 rounded-2xl border border-border-subtle overflow-hidden bg-text-primary/[0.02] flex items-center justify-center relative group">
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
                    <span className="text-[10px] font-bold uppercase tracking-tighter">No Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Benefits Array */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-accent font-bold uppercase tracking-widest ml-2">{t('keyBenefits')}</label>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, benefits: [...(formData.benefits || []), '']})}
                  className="p-1.5 hover:bg-text-primary/5 rounded-lg text-accent transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {(formData.benefits || []).map((benefit, i) => (
                  <div key={i} className="group flex gap-3">
                    <input 
                      className="flex-1 bg-text-primary/5 border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-accent/30 transition-all font-medium"
                      placeholder={`Benefit ${i + 1}`}
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...(formData.benefits || [])];
                        newBenefits[i] = e.target.value;
                        setFormData({...formData, benefits: newBenefits});
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const newBenefits = [...(formData.benefits || [])].filter((_, index) => index !== i);
                        setFormData({...formData, benefits: newBenefits});
                      }}
                      className="p-3 h-fit rounded-xl bg-red-400/5 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Array */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-brand-accent font-bold uppercase tracking-widest ml-2">{t('clinicalFlow')}</label>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, processSteps: [...(formData.processSteps || []), '']})}
                  className="p-1.5 hover:bg-text-primary/5 rounded-lg text-brand-accent transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {(formData.processSteps || []).map((step, i) => (
                  <div key={i} className="group flex gap-3">
                    <input 
                      className="flex-1 bg-text-primary/5 border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-accent/30 transition-all font-mono"
                      placeholder={`Step ${i + 1}`}
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...(formData.processSteps || [])];
                        newSteps[i] = e.target.value;
                        setFormData({...formData, processSteps: newSteps});
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const newSteps = [...(formData.processSteps || [])].filter((_, index) => index !== i);
                        setFormData({...formData, processSteps: newSteps});
                      }}
                      className="p-3 h-fit rounded-xl bg-red-400/5 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
              className="px-10 py-3 bg-accent text-bg-main font-bold uppercase tracking-widest text-xs rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center gap-3"
            >
              {selectedService ? 'Publish Updates' : 'Deploy Service'} <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
