/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Star, Check } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import FloatingInput, { FloatingTextArea, FloatingSelect } from '../components/FloatingInput';
import { useToast } from '../components/Toast';

export default function TestimonialsPage() {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    treatment: '',
    quote: '',
    rating: 5,
    isActive: true,
    displayOrder: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/testimonials');
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast('Failed to fetch testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setSelectedItem(item);
      setFormData(item);
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        treatment: '',
        quote: '',
        rating: 5,
        isActive: true,
        displayOrder: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await api.put(`/admin/testimonials/${selectedItem._id || selectedItem.id}`, formData);
        showToast('Testimonial updated');
      } else {
        await api.post('/admin/testimonials', formData);
        showToast('Testimonial added');
      }
      setIsModalOpen(false);
      void fetchData();
    } catch (error) {
      showToast('Update failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await api.delete(`/admin/testimonials/${id}`);
        showToast('Testimonial removed');
        void fetchData();
      } catch (error) {
        showToast('Delete failed', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center pb-6 border-b border-border-subtle">
        <div>
          <h2 className="text-4xl font-light text-text-primary">Patient <span className="text-accent italic">Testimonials</span></h2>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-accent flex items-center gap-2">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse h-64 bg-text-primary/5 rounded-3xl" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {testimonials.map((t) => (
              <motion.div
                key={t._id || t.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel p-6 relative group rounded-3xl border border-border-subtle"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{t.name}</h3>
                    <p className="text-xs text-accent uppercase tracking-widest mt-1">{t.treatment}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(t)} className="text-text-muted hover:text-white"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(t._id || t.id)} className="text-text-muted hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-1 text-accent">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedItem ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <FloatingInput label="Patient Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <FloatingInput label="Treatment" required value={formData.treatment} onChange={(e) => setFormData({...formData, treatment: e.target.value})} />
          <FloatingTextArea label="Quote" required value={formData.quote} onChange={(e) => setFormData({...formData, quote: e.target.value})} />
          <FloatingSelect
            label="Rating"
            value={formData.rating.toString()}
            onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
            options={[
              { label: '5 Stars', value: '5' },
              { label: '4 Stars', value: '4' },
              { label: '3 Stars', value: '3' },
              { label: '2 Stars', value: '2' },
              { label: '1 Star', value: '1' }
            ]}
          />
          <div className="flex justify-end gap-4 pt-4 border-t border-border-subtle">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-text-muted">Cancel</button>
            <button type="submit" className="btn-accent">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
