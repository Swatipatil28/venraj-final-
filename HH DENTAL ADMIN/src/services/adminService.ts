/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import api from './api';
import { AppointmentDTO, AppointmentStatus, ClinicDTO, DoctorDTO, ServiceDTO, User } from '../types';

type BackendAppointment = {
  _id: string;
  patientName: string;
  phone: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  symptoms: string;
  medications?: string;
  medicalHistory?: string;
  notes?: string;
  status?: string;
  preferredDate?: string;
  createdAt: string;
  clinicId?: { _id?: string; name?: string; city?: string };
  doctorId?: { _id?: string; name?: string; specialization?: string };
  serviceId?: { _id?: string; title?: string; category?: string };
};

type BackendDoctor = {
  _id?: string;
  id?: string;
  name: string;
  specialization: string | string[]; // backend may return string or string[]
  experience: string | number;
  qualifications: string;
  bio?: string;
  image?: string;
  imageUrl?: string;
  clinics?: string[];
};

type BackendService = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  category: string;
  description: string;
  benefits?: string[];
  process?: string[];
  processSteps?: string[];
  icon?: string;
  image?: string;
  imageUrl?: string;
};

type LoginResponse = {
  token: string;
  admin: {
    id: string;
    email: string;
    role: 'admin' | 'super_admin';
    name?: string;
  };
};

const normalizeStatus = (status?: string): AppointmentStatus => {
  const normalized = (status || 'pending').toLowerCase();
  if (normalized === 'confirmed' || normalized === 'completed' || normalized === 'cancelled' || normalized === 'feedback') {
    return normalized;
  }
  return 'pending';
};

const toBackendStatus = (status: AppointmentStatus) => {
  return status;
};

const mapAppointment = (appointment: BackendAppointment): AppointmentDTO => ({
  _id: appointment._id,
  patientName: appointment.patientName,
  phone: appointment.phone,
  age: appointment.age || 0,
  gender: appointment.gender || 'Other',
  symptoms: appointment.symptoms,
  medications: appointment.medications || '',
  medicalHistory: appointment.medicalHistory || '',
  pastDentalHistory: '',
  clinicId: appointment.clinicId?._id || '',
  clinic: appointment.clinicId?.name || '',
  clinicName: appointment.clinicId?.name || '',
  doctorId: appointment.doctorId?._id || '',
  doctorName: appointment.doctorId?.name || '',
  serviceId: appointment.serviceId?._id || '',
  service: appointment.serviceId?.title || '',
  serviceName: appointment.serviceId?.title || '',
  preferredDate: appointment.preferredDate ? new Date(appointment.preferredDate).toISOString().split('T')[0] : '',
  appointmentTime: '',
  status: normalizeStatus(appointment.status),
  contacted: false,
  notes: appointment.notes || '',
  createdAt: appointment.createdAt,
});

const normalizeSpecialization = (spec: string | string[]): string[] => {
  if (Array.isArray(spec)) return spec.filter(Boolean);
  if (typeof spec === 'string' && spec.trim()) {
    // Handle legacy comma-separated strings
    return spec.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const mapDoctor = (doctor: BackendDoctor, clinics: ClinicDTO[]): DoctorDTO => ({
  _id: doctor._id || doctor.id || '',
  name: doctor.name,
  image: doctor.image || doctor.imageUrl || '',
  specialization: normalizeSpecialization(doctor.specialization) as DoctorDTO['specialization'],
  experience: typeof doctor.experience === 'string' ? Number.parseInt(doctor.experience, 10) || 0 : doctor.experience || 0,
  qualifications: doctor.qualifications,
  assignedClinicIds: (doctor.clinics || [])
    .map((clinicName) => clinics.find((clinic) => clinic.name === clinicName)?._id)
    .filter((clinicId): clinicId is string => Boolean(clinicId)),
  bio: doctor.bio || '',
});

const mapService = (service: BackendService): ServiceDTO => ({
  _id: service._id || service.id || '',
  name: service.title || service.name || '',
  category: service.category.toLowerCase() === 'aesthetic' ? 'Aesthetic' : 'Dental',
  description: service.description,
  benefits: service.benefits || [],
  processSteps: service.process || service.processSteps || [],
  icon: service.icon || '',
  image: service.image || service.imageUrl || '',
});

export const AuthService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse, LoginResponse>('/admin/login', { email, password }),
  me: () => api.get<User, User>('/admin/me'),
};

export const AppointmentService = {
  getAppointments: async () => {
    const data = await api.get<BackendAppointment[], BackendAppointment[]>('/admin/appointments?limit=100');
    return data.map(mapAppointment);
  },
  create: (data: Partial<AppointmentDTO>) =>
    api.post<{ appointmentRef: string }, { appointmentRef: string }>('/appointments', {
      patientName: data.patientName,
      phone: data.phone,
      age: data.age,
      symptoms: data.symptoms,
      medications: data.medications,
      medicalHistory: data.medicalHistory,
      clinicId: data.clinicId,
      doctorId: data.doctorId || undefined,
      serviceId: data.serviceId || undefined,
      preferredDate: data.preferredDate || undefined,
    }),
  update: async (id: string, data: Partial<AppointmentDTO>) => {
    const payload: Record<string, unknown> = {};
    if (data.notes !== undefined) payload.notes = data.notes;
    if (data.doctorId) payload.doctorId = data.doctorId;
    if (data.status) payload.status = toBackendStatus(data.status);
    if (data.preferredDate) payload.confirmedDate = data.preferredDate;
    const updated = await api.put<BackendAppointment, BackendAppointment>(`/admin/appointments/${id}`, payload);
    return mapAppointment(updated);
  },
  updateStatus: async (id: string, status: AppointmentStatus) => {
    const updated = await api.put<BackendAppointment, BackendAppointment>(`/admin/appointments/${id}`, {
      status: toBackendStatus(status),
    });
    return mapAppointment(updated);
  },
  confirm: async (id: string) => {
    const updated = await api.put<BackendAppointment, BackendAppointment>(`/admin/appointments/${id}/confirm`);
    return mapAppointment(updated);
  },
};

export const ClinicService = {
  getAll: () => api.get<ClinicDTO[], ClinicDTO[]>('/clinics'),
  create: (data: Partial<ClinicDTO>) => api.post<ClinicDTO, ClinicDTO>('/admin/clinics', data),
  update: (id: string, data: Partial<ClinicDTO>) => api.put<ClinicDTO, ClinicDTO>(`/admin/clinics/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }, { success: boolean }>(`/admin/clinics/${id}`),
};

export const DoctorService = {
  getAll: async () => {
    const clinics = await ClinicService.getAll();
    const doctors = await api.get<BackendDoctor[], BackendDoctor[]>('/doctors');
    return doctors.map((doctor) => mapDoctor(doctor, clinics));
  },
  create: (data: Partial<DoctorDTO>) =>
    api.post<DoctorDTO, DoctorDTO>('/admin/doctors', {
      name: data.name,
      // Always send as array; handle string input gracefully
      specialization: Array.isArray(data.specialization)
        ? data.specialization
        : typeof data.specialization === 'string'
          ? (data.specialization as string).split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      experience: `${data.experience || 0} Years`,
      qualifications: data.qualifications,
      bio: data.bio,
      image: data.image,
      clinics: data.assignedClinicIds || [],
    }),
  update: (id: string, data: Partial<DoctorDTO>) =>
    api.put<DoctorDTO, DoctorDTO>(`/admin/doctors/${id}`, {
      name: data.name,
      specialization: Array.isArray(data.specialization)
        ? data.specialization
        : typeof data.specialization === 'string'
          ? (data.specialization as string).split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      experience: `${data.experience || 0} Years`,
      qualifications: data.qualifications,
      bio: data.bio,
      image: data.image,
      clinics: data.assignedClinicIds || [],
    }),
  delete: (id: string) => api.delete<{ success: boolean }, { success: boolean }>(`/admin/doctors/${id}`),
};

export const ServiceService = {
  getAll: async () => {
    const services = await api.get<BackendService[], BackendService[]>('/services');
    return services.map(mapService);
  },
  create: (data: Partial<ServiceDTO>) =>
    api.post<ServiceDTO, ServiceDTO>('/admin/services', {
      title: data.name,
      category: data.category?.toLowerCase(),
      description: data.description,
      benefits: data.benefits || [],
      process: data.processSteps || [],
      icon: data.icon,
      image: data.image,
    }),
  update: (id: string, data: Partial<ServiceDTO>) =>
    api.put<ServiceDTO, ServiceDTO>(`/admin/services/${id}`, {
      title: data.name,
      category: data.category?.toLowerCase(),
      description: data.description,
      benefits: data.benefits || [],
      process: data.processSteps || [],
      icon: data.icon,
      image: data.image,
    }),
  delete: (id: string) => api.delete<{ success: boolean }, { success: boolean }>(`/admin/services/${id}`),
};

export const UploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const data = await api.post<{ url: string; filename: string }, { url: string; filename: string }>(
      '/admin/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.url;
  },
};

