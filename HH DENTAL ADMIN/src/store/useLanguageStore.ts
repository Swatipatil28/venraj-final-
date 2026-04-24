import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'te';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Topbar
    searchPlaceholder: "Global Search (Patients, Doctors...)",
    
    // Sidebar
    dashboard: "Dashboard",
    appointments: "Appointments",
    doctors: "Doctors",
    services: "Services",
    clinics: "Clinics",
    settings: "Settings",
    logout: "Logout",
    
    // Dashboard
    welcome: "Welcome back",
    totalPatients: "Total Patients",
    confirmedAppointments: "Confirmed Appointments",
    activeDoctors: "Active Doctors",
    totalRevenue: "Total Revenue",
    recentAppointments: "Recent Appointments",
    managementOverview: "Management Overview",
    performanceTracking: "Tracking H&H performance metrics",
    exportCsv: "Export CSV",
    totalAppointments: "Total Appointments",
    pendingReview: "Pending Review",
    confirmedUnits: "Confirmed Units",
    completionRate: "Completion Rate",
    latestPatientRequests: "Latest patient requests from all clinics",
    viewAll: "View All",
    serviceInsights: "Service Insights",
    growthTip: "Growth Tip",
    
    // Table Headers (Generic)
    patient: "Patient",
    clinic: "Clinic",
    date: "Date",
    
    // Status
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    
    // Appointments
    patientDetails: "Patient Intelligence",
    clinicService: "Facility & Service",
    dateTime: "Scheduled Time",
    status: "Clinical Status",
    actions: "Administrative Actions",
    viewDetails: "Expand Intelligence",
    patientHistory: "Patient History",
    chiefComplaints: "Chief Complaints",
    medicalContext: "Medical Context",
    firstTimePatient: "First Time Patient",
    returningPatient: "Returning Patient",
    clinicOS: "Clinic OS",
    urgent: "Urgent",
    contacted: "Contacted by Staff",
    notContacted: "Not Contacted Yet",
    assignmentControls: "Assignment Controls",
    gender: "Gender",
    pastDentalHistory: "Past Dental History",
    currentMedications: "Current Medications",
    pastMedicalHistory: "Past Medical History",
    male: "Male",
    female: "Female",
    other: "Other",
    callPatient: "Call Patient",
    confirmAction: "Confirm Appointment",
    newAppointment: "Schedule Case",
    patientName: "Patient Legal Name",
    age: "Age",
    phone: "Phone Number",
    symptoms: "Symptoms / Concern",
    facilityBranch: "Facility Branch",
    selectedService: "Selected Service",
    scheduleDate: "Schedule Date",
    slotTime: "Slot Time",
    clinicalNotes: "Staff Findings & Notes",
    professionalBio: "Professional Bio",
    qualifications: "Qualifications",
    experience: "Experience",
    assignedToClinics: "Assigned to Clinics",
    city: "City",
    state: "State",
    streetAddress: "Street Address",
    createAppointment: "Create Appointment",
    updateAppointment: "Update Appointment",
    todaysRequests: "Today's Requests",
    upcomingSchedule: "Upcoming Schedule",
    mostDemanded: "Most Demanded",
    facilityName: "Facility Name",
    email: "Email Address",
    experienceYearsLabel: "Experience (Years)",
    doctorName: "Doctor Name",
    specialization: "Specialization",
    serviceTitle: "Service Title",
    clinicalCategory: "Clinical Category",
    serviceDescription: "Service Description",
    
    // Doctors
    registerDoctor: "Register Doctor",
    medicalSpecialists: "Medical Specialists",
    specialistProfiles: "Specialist Profiles",
    clinicalCatalog: "Clinical Catalog",
    newService: "New Service",
    dental: "Dental",
    aesthetic: "Aesthetic",
    keyBenefits: "Key Benefits",
    clinicalFlow: "Clinical Flow",
    
    // Clinics
    expansionNetwork: "Expansion Network",
    addFacility: "Add New Facility",
    navigateMap: "Navigate Map",
    websitePortal: "Website Portal",
    address: "Address",
    inquiry: "Inquiry"
  },
  te: {
    // Topbar
    searchPlaceholder: "గ్లోబల్ సెర్చ్ (రోగులు, వైద్యులు...)",
    
    // Sidebar
    dashboard: "డాష్‌బోర్డ్",
    appointments: "అపాయింట్‌మెంట్‌లు",
    doctors: "వైద్యులు",
    services: "సేవలు",
    clinics: "క్లినిక్‌లు",
    settings: "సెట్టింగులు",
    logout: "లాగ్ అవుట్",
    
    // Dashboard
    welcome: "తిరిగి స్వాగతం",
    totalPatients: "మొత్తం రోగులు",
    confirmedAppointments: "ధృవీకరించబడిన అపాయింట్‌మెంట్‌లు",
    activeDoctors: "క్రియాశీల వైద్యులు",
    totalRevenue: "మొత్తం ఆదాయం",
    recentAppointments: "ఇటీవలి అపాయింట్‌మెంట్‌లు",
    managementOverview: "నిర్వహణ అవలోకనం",
    performanceTracking: "H&H పనితీరు కొలమానాలను ట్రాక్ చేయడం",
    exportCsv: "CSV ఎగుమతి చేయండి",
    totalAppointments: "మొత్తం అపాయింట్‌మెంట్‌లు",
    pendingReview: "పెండింగ్ సమీక్ష",
    confirmedUnits: "ధృవీకరించబడిన యూనిట్లు",
    completionRate: "పూర్తి రేటు",
    latestPatientRequests: "అన్ని క్లినిక్‌ల నుండి తాజా రోగి అభ్యర్థనలు",
    viewAll: "అన్నీ చూడండి",
    serviceInsights: "సేవా అంతర్దృష్టులు",
    growthTip: "వృద్ధి చిట్కా",
    
    // Table Headers (Generic)
    patient: "రోగి",
    clinic: "క్లినిక్",
    date: "తేదీ",
    
    // Status
    pending: "పెండింగ్‌లో ఉంది",
    confirmed: "ధృవీకరించబడింది",
    completed: "పూర్తయింది",
    cancelled: "రద్దు చేయబడింది",
    
    // Appointments
    patientDetails: "రోగి సమాచారం",
    clinicService: "సౌకర్యం & సేవ",
    dateTime: "నిర్ణీత సమయం",
    status: "క్లినికల్ స్థితి",
    actions: "పరిపాలనా చర్యలు",
    viewDetails: "వివరాలు చూడండి",
    patientHistory: "రోగి చరిత్ర",
    chiefComplaints: "ప్రధాన ఫిర్యాదులు",
    medicalContext: "వైద్య నేపథ్యం",
    firstTimePatient: "మొదటిసారి రోగి",
    returningPatient: "తిరిగి వచ్చిన రోగి",
    clinicOS: "క్లినిక్ OS",
    urgent: "అత్యవసరం",
    contacted: "సిబ్బంది సంప్రదించారు",
    notContacted: "ఇంకా సంప్రదించలేదు",
    assignmentControls: "అప్పగింత నియంత్రణలు",
    gender: "లింగం",
    pastDentalHistory: "గత దంత చరిత్ర",
    currentMedications: "ప్రస్తుత మందులు",
    pastMedicalHistory: "గత వైద్య చరిత్ర",
    male: "పురుషుడు",
    female: "స్త్రీ",
    other: "ఇతర",
    callPatient: "రోగికి కాల్ చేయండి",
    confirmAction: "నియామకాన్ని ధృవీకరించండి",
    newAppointment: "కొత్త నియామకం",
    patientName: "రోగి పేరు",
    age: "వయస్సు",
    phone: "ఫోన్ నంబర్",
    symptoms: "లక్షణాలు / సమస్య",
    facilityBranch: "సౌకర్యం శాఖ",
    selectedService: "ఎంచుకున్న సేవ",
    scheduleDate: "తేదీ",
    slotTime: "సమయం",
    clinicalNotes: "సిబ్బంది నివేదికలు & గమనికలు",
    professionalBio: "వృత్తిపరమైన బయో",
    qualifications: "అర్హతలు",
    experience: "అనుభవం",
    assignedToClinics: "క్లినిక్‌లకు కేటాయించబడింది",
    city: "నగరం",
    state: "రాష్ట్రం",
    streetAddress: "చిరునామా",
    createAppointment: "అపాయింట్‌మెంట్ సృష్టించండి",
    updateAppointment: "అపాయింట్‌మెంట్ నవీకరించండి",
    todaysRequests: "నేటి అభ్యర్థనలు",
    upcomingSchedule: "రాబోయే షెడ్యూల్",
    mostDemanded: "అత్యధిక డిమాండ్",
    facilityName: "సౌకర్యం పేరు",
    email: "ఈమెయిల్ చిరునామా",
    experienceYearsLabel: "అనుభవం (సంవత్సరాలు)",
    doctorName: "వైద్యుని పేరు",
    specialization: "నైపుణ్యం",
    serviceTitle: "సేవ శీర్షిక",
    clinicalCategory: "క్లినికల్ వర్గం",
    serviceDescription: "సేవ వివరణ",
    
    // Doctors
    registerDoctor: "డాక్టరును నమోదు చేయండి",
    medicalSpecialists: "వైద్య నిపుణులు",
    specialistProfiles: "నిపుణుల ప్రొఫైల్స్",
    clinicalCatalog: "క్లినికల్ కేటలాగ్",
    newService: "కొత్త సేవ",
    dental: "డెంటల్",
    aesthetic: "సౌందర్య",
    keyBenefits: "ముఖ్య ప్రయోజనాలు",
    clinicalFlow: "క్లినికల్ ఫ్లో",
    
    // Clinics
    expansionNetwork: "నెట్‌వర్క్ విస్తరణ",
    addFacility: "కొత్త సౌకర్యాన్ని జోడించండి",
    navigateMap: "మ్యాప్ నావిగేట్ చేయండి",
    websitePortal: "వెబ్‌సైట్ పోర్టల్",
    address: "చిరునామా",
    inquiry: "విచారణ"
  }
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      t: (key) => {
        const lang = get().language;
        return translations[lang][key] || key;
      }
    }),
    {
      name: 'hh-dental-language'
    }
  )
);
