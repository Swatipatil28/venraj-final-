/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'feedback';

export interface AppointmentDTO {
  _id: string;
  patientName: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  symptoms: string;
  medications?: string;
  medicalHistory?: string;
  pastDentalHistory?: string;
  clinicId: string;
  clinic?: string;
  clinicName?: string;
  doctorId: string;
  doctorName?: string;
  serviceId: string;
  service?: string;
  serviceName?: string;
  preferredDate: string;
  appointmentTime?: string; // Format: HH:mm
  status: AppointmentStatus;
  contacted?: boolean;
  notes?: string;
  createdAt: string;
}

export interface ClinicDTO {
  _id: string;
  name: string;
  city: string;
  state: string;
  area: string;
  phone: string;
  email: string;
  image?: string;
}

export type Specialization = string;

export interface DoctorDTO {
  _id: string;
  name: string;
  image?: string;
  specialization: Specialization[]; // Array — doctors can have multiple specializations
  experience: number;
  qualifications: string;
  assignedClinicIds: string[];
  bio: string;
}

export type ServiceCategory = 'Dental' | 'Aesthetic';

export interface ServiceDTO {
  _id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  benefits: string[];
  processSteps: string[];
  icon?: string;
  image?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin';
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
