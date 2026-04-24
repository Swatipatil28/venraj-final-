import { createContext, useContext, useMemo, useState } from "react";

const translations = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      doctors: "Doctors",
      locations: "Locations",
      book: "Book Appointment",
    },
    common: {
      learnMore: "Learn More",
      viewAll: "View All",
      bookNow: "Book Appointment",
      directions: "Directions",
      retry: "Try Again",
      previous: "Previous",
      next: "Next",
      submit: "Confirm Booking",
      backToHome: "Back to Home",
      loading: "Loading",
      choose: "Choose",
      savedLocal: "Saved locally. We will sync your appointment once backend is available.",
      bookedSuccess: "Appointment request submitted successfully.",
    },
    home: {
      heroEyebrow: "Luxury Dental Experience",
      heroTitle: "Transform Your Smile with Expert Dental Care",
      heroBody:
        "Private consultations, advanced dentistry, and premium aesthetic care designed to help every visit feel calm, elevated, and worth booking.",
      heroSecondary: "Explore Services",
      sectionServices: "Signature Treatments",
      sectionDoctors: "Meet Your Specialists",
      sectionStories: "Smile Transformations",
      sectionTestimonials: "Patient Stories",
      sectionLocations: "Visit H&H Near You",
      ctaTitle: "Make your first appointment feel easy, polished, and personal.",
      ctaBody: "Share your details once. We handle the rest with a quick callback and the right specialist match.",
    },
    services: {
      title: "Curated Dental & Aesthetic Services",
      body: "Explore premium treatment journeys crafted for confidence, comfort, and lasting results.",
      dentalTab: "Dental",
      aestheticTab: "Aesthetic",
      related: "Related Services",
      benefits: "Key Benefits",
      process: "Treatment Process",
      inlineCta: "Ready to reserve your consultation?",
    },
    doctors: {
      title: "Specialists Patients Trust",
      body: "A senior team combining restorative precision, smile artistry, and comfort-first care.",
      filter: "Specialization",
      all: "All Specializations",
      clinics: "Clinics",
      experience: "Experience",
    },
    locations: {
      title: "Premium Clinics Across Telangana & Andhra Pradesh",
      body: "Elegant spaces designed for efficient visits, calm consultations, and easy bookings.",
      telangana: "Telangana",
      andhra: "Andhra Pradesh",
    },
    booking: {
      title: "Book Your Appointment",
      body: "A three-step form designed to keep booking quick while capturing the details your care team needs.",
      step1: "Basic Info",
      step2: "Medical Details",
      step3: "Appointment Details",
      fullName: "Full Name",
      phone: "Phone Number",
      age: "Age",
      gender: "Gender",
      symptoms: "Symptoms / Concern",
      medications: "Current Medications",
      medicalHistory: "Past Medical History",
      dentalHistory: "Past Dental History",
      location: "Clinic Location",
      service: "Service",
      date: "Preferred Date",
      male: "Male",
      female: "Female",
      other: "Other",
      successTitle: "Your appointment request is in.",
      successBody: "Our concierge team will call you shortly to confirm the ideal clinic, doctor, and timing.",
    },
    errors: {
      required: "This field is required.",
      phone: "Enter a valid phone number.",
      age: "Enter a valid age.",
      date: "Choose a future date.",
      generic: "We could not load this section right now.",
    },
  },
  te: {
    nav: {
      home: "హోమ్",
      services: "సర్వీసులు",
      doctors: "డాక్టర్లు",
      locations: "లోకేషన్లు",
      book: "అపాయింట్‌మెంట్",
    },
    common: {
      learnMore: "మరింత తెలుసుకోండి",
      viewAll: "అన్నీ చూడండి",
      bookNow: "అపాయింట్‌మెంట్ బుక్ చేయండి",
      directions: "దారులు",
      retry: "మళ్లీ ప్రయత్నించండి",
      previous: "వెనక్కి",
      next: "తర్వాత",
      submit: "బుకింగ్ నిర్ధారించండి",
      backToHome: "హోమ్‌కు వెళ్లండి",
      loading: "లోడ్ అవుతోంది",
      choose: "ఎంచుకోండి",
      savedLocal: "లోకల్‌గా సేవ్ అయ్యింది. బ్యాకెండ్ అందుబాటులోకి రాగానే సింక్ అవుతుంది.",
      bookedSuccess: "అపాయింట్‌మెంట్ అభ్యర్థన విజయవంతంగా పంపబడింది.",
    },
    home: {
      heroEyebrow: "ప్రీమియం డెంటల్ అనుభవం",
      heroTitle: "నిపుణుల డెంటల్ కేర్‌తో మీ చిరునవ్వును మార్చుకోండి",
      heroBody:
        "ప్రైవేట్ కన్సల్టేషన్లు, ఆధునిక డెంటిస్ట్రీ, ప్రీమియం ఏస్తెటిక్ కేర్ - ప్రతి విజిట్ నమ్మకంగా, ప్రశాంతంగా అనిపించేలా.",
      heroSecondary: "సర్వీసులు చూడండి",
      sectionServices: "సిగ్నేచర్ ట్రీట్మెంట్స్",
      sectionDoctors: "మీ స్పెషలిస్టులను కలవండి",
      sectionStories: "స్మైల్ మార్పులు",
      sectionTestimonials: "పేషెంట్ అభిప్రాయాలు",
      sectionLocations: "మీకు దగ్గరలోని H&H",
      ctaTitle: "మీ మొదటి అపాయింట్‌మెంట్‌ను సులభంగా, అందంగా, వ్యక్తిగతంగా చేసుకోండి.",
      ctaBody: "మీ వివరాలు ఒకసారి పంపండి. మిగతాదాన్ని మా టీమ్ త్వరగా నిర్వహిస్తుంది.",
    },
    services: {
      title: "ఎంపిక చేసిన డెంటల్ & ఏస్తెటిక్ సర్వీసులు",
      body: "నమ్మకం, సౌకర్యం, దీర్ఘకాలిక ఫలితాల కోసం రూపొందించిన ప్రీమియం ట్రీట్మెంట్స్.",
      dentalTab: "డెంటల్",
      aestheticTab: "ఏస్తెటిక్",
      related: "సంబంధిత సర్వీసులు",
      benefits: "ప్రధాన ప్రయోజనాలు",
      process: "ట్రీట్మెంట్ దశలు",
      inlineCta: "మీ కన్సల్టేషన్ రిజర్వ్ చేయడానికి సిద్ధమా?",
    },
    doctors: {
      title: "పేషెంట్లు నమ్మే నిపుణులు",
      body: "రీస్టోరేటివ్ ప్రిసిషన్, స్మైల్ ఆర్టిస్ట్రీ, కంఫర్ట్-ఫస్ట్ కేర్ కలిగిన సీనియర్ టీమ్.",
      filter: "స్పెషలైజేషన్",
      all: "అన్నీ",
      clinics: "క్లినిక్స్",
      experience: "అనుభవం",
    },
    locations: {
      title: "తెలంగాణ & ఆంధ్రప్రదేశ్ అంతటా ప్రీమియం క్లినిక్స్",
      body: "ప్రశాంత కన్సల్టేషన్లు, సులభ బుకింగ్, వేగవంతమైన విజిట్స్ కోసం రూపొందించిన సొగసైన స్థలాలు.",
      telangana: "తెలంగాణ",
      andhra: "ఆంధ్రప్రదేశ్",
    },
    booking: {
      title: "మీ అపాయింట్‌మెంట్ బుక్ చేయండి",
      body: "త్వరగా బుక్ చేసుకునేలా, అవసరమైన వైద్య వివరాలు సేకరించేలా రూపొందించిన మూడు దశల ఫారం.",
      step1: "ప్రాథమిక వివరాలు",
      step2: "మెడికల్ వివరాలు",
      step3: "అపాయింట్‌మెంట్ వివరాలు",
      fullName: "పూర్తి పేరు",
      phone: "ఫోన్ నంబర్",
      age: "వయసు",
      gender: "లింగం",
      symptoms: "లక్షణాలు / సమస్య",
      medications: "ప్రస్తుత మందులు",
      medicalHistory: "గత వైద్య చరిత్ర",
      dentalHistory: "గత డెంటల్ చరిత్ర",
      location: "క్లినిక్ లోకేషన్",
      service: "సర్వీస్",
      date: "ఇష్టమైన తేదీ",
      male: "పురుషుడు",
      female: "స్త్రీ",
      other: "ఇతరులు",
      successTitle: "మీ అపాయింట్‌మెంట్ అభ్యర్థన పంపబడింది.",
      successBody: "మీకు సరైన క్లినిక్, డాక్టర్, సమయం నిర్ధారించడానికి మా టీమ్ త్వరలో కాల్ చేస్తుంది.",
    },
    errors: {
      required: "ఈ ఫీల్డ్ తప్పనిసరి.",
      phone: "చెల్లుబాటు అయ్యే ఫోన్ నంబర్ ఇవ్వండి.",
      age: "చెల్లుబాటు అయ్యే వయసు ఇవ్వండి.",
      date: "భవిష్యత్ తేదీని ఎంచుకోండి.",
      generic: "ఈ భాగాన్ని ఇప్పుడు లోడ్ చేయలేకపోయాం.",
    },
  },
};

const LanguageContext = createContext(null);

const getValue = (object, path) =>
  path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), object);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (path) => getValue(translations[language], path) ?? getValue(translations.en, path) ?? path,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return value;
}
