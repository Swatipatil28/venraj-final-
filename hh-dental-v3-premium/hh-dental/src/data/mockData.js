export const services = [
  {
    id: "svc-checkup",
    title: "Dental Check-up",
    category: "dental",
    description: "Comprehensive oral examination to maintain your dental health.",
    shortDescription: "Routine examination and preventive care.",
    imageUrl: "https://images.unsplash.com/photo-1625134673337-519d00bb0f0c?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Early detection", "Preventive care", "Personalized advice"],
    process: ["Clinical examination", "X-ray if needed", "Cleaning recommendation"],
    relatedServiceIds: ["svc-implants", "svc-caries"]
  },
  {
    id: "svc-smile",
    title: "Smile Correction",
    category: "dental",
    description: "Transform your smile with our advanced correction techniques.",
    shortDescription: "Bespoke smile design and correction.",
    imageUrl: "https://images.unsplash.com/photo-1593022356769-11f762e25ed9?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Enhanced aesthetics", "Boosted confidence", "Improved function"],
    process: ["Smile analysis", "Treatment planning", "Procedure execution"],
    relatedServiceIds: ["svc-veneers", "svc-aligners"]
  },
  {
    id: "svc-implants",
    title: "Dental Implants",
    category: "dental",
    description: "Permanent tooth replacement that looks, feels, and functions like your natural teeth.",
    shortDescription: "Permanent and natural tooth replacement.",
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Lifetime durability", "Natural appearance", "Preserves jawbone"],
    process: ["Consultation", "Implant placement", "Healing", "Crown fitting"],
    relatedServiceIds: ["svc-full-mouth", "svc-veneers"]
  },
  {
    id: "svc-caries",
    title: "Dental Caries Management & Fillings",
    category: "dental",
    description: "Effective treatment for cavities using modern filling materials.",
    shortDescription: "Advanced cavity treatment and fillings.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Stops decay", "Restores tooth structure", "Pain relief"],
    process: ["Decay removal", "Cavity preparation", "Filling placement"],
    relatedServiceIds: ["svc-checkup", "svc-kids"]
  },
  {
    id: "svc-aligners",
    title: "Invisalign & Aligners",
    category: "dental",
    description: "Discreet orthodontic solutions for a straighter smile without braces.",
    shortDescription: "Clear aligner therapy for perfect alignment.",
    imageUrl: "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Nearly invisible", "Removable", "Comfortable"],
    process: ["Digital scan", "3D planning", "Custom aligner wear"],
    relatedServiceIds: ["svc-smile", "svc-veneers"]
  },
  {
    id: "svc-veneers",
    title: "Crowns & Veneers",
    category: "dental",
    description: "Restore and enhance your teeth with custom-crafted crowns and veneers.",
    shortDescription: "High-quality ceramic crowns and veneers.",
    imageUrl: "https://images.unsplash.com/photo-1588776814546-ec7e7f4d4048?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Natural look", "Strength", "Stain resistance"],
    process: ["Tooth prep", "Impression", "Fitting"],
    relatedServiceIds: ["svc-smile", "svc-implants"]
  },
  {
    id: "svc-dentures",
    title: "Complete Dentures",
    category: "dental",
    description: "High-quality dentures for full mouth restoration and function.",
    shortDescription: "Removable and fixed denture solutions.",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Restores chewing", "Natural look", "Comfortable fit"],
    process: ["Impressions", "Trial fit", "Final delivery"],
    relatedServiceIds: ["svc-full-mouth", "svc-implants"]
  },
  {
    id: "svc-full-mouth",
    title: "Full Mouth Rehabilitation",
    category: "dental",
    description: "Comprehensive reconstruction of all teeth for health and aesthetics.",
    shortDescription: "Complete oral health and aesthetic restoration.",
    imageUrl: "https://images.unsplash.com/photo-1593022356769-11f762e25ed9?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Total restoration", "Improved bite", "Aesthetic overhaul"],
    process: ["Deep analysis", "Phased treatment", "Final restoration"],
    relatedServiceIds: ["svc-implants", "svc-dentures"]
  },
  {
    id: "svc-guards",
    title: "Mouth Guards & Oral Appliances",
    category: "dental",
    description: "Custom appliances for sports protection and teeth grinding.",
    shortDescription: "Protective and therapeutic oral appliances.",
    imageUrl: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Injury prevention", "Protects enamel", "Better sleep"],
    process: ["Impression", "Custom fabrication", "Fitting"],
    relatedServiceIds: ["svc-checkup"]
  },
  {
    id: "svc-kids",
    title: "Pediatric Dentistry",
    category: "dental",
    description: "Specialized dental care for children in a friendly environment.",
    shortDescription: "Gentle and specialized care for kids.",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Child-friendly", "Preventive focus", "Early habit correction"],
    process: ["Gentle check-up", "Preventive care", "Parent education"],
    relatedServiceIds: ["svc-checkup", "svc-caries"]
  },
  {
    id: "svc-trauma",
    title: "Head and Neck Trauma, Cysts & Tumors",
    category: "dental",
    description: "Expert surgical management of complex head and neck conditions.",
    shortDescription: "Advanced maxillofacial surgical care.",
    imageUrl: "https://images.unsplash.com/photo-1579154235602-3c2c240954b4?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Expert care", "Advanced techniques", "Compassionate approach"],
    process: ["Diagnosis", "Surgical planning", "Operation", "Recovery"],
    relatedServiceIds: ["svc-implants"]
  },
  {
    id: "svc-facial",
    title: "Facial Aesthetics",
    category: "aesthetic",
    description: "Enhance your natural beauty with our aesthetic facial treatments.",
    shortDescription: "Non-surgical facial rejuvenation and enhancement.",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Youthful look", "Balanced features", "Non-surgical options"],
    process: ["Consultation", "Treatment mapping", "Procedure"],
    relatedServiceIds: ["svc-smile", "svc-hair"]
  },
  {
    id: "svc-hair",
    title: "Hair Transplant & Other Services",
    category: "aesthetic",
    description: "Advanced hair restoration and various aesthetic enhancements.",
    shortDescription: "Modern hair restoration solutions.",
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Natural hair growth", "Self-confidence", "Expert execution"],
    process: ["Consultation", "Procedure", "Aftercare"],
    relatedServiceIds: ["svc-facial"]
  }
];

export const doctors = [
  { id: "doc-harshita", name: "Dr Harshita Akurathi", specialization: "Prosthodontist & Implantologist", experience: "10+ Years", clinics: ["Kondapur", "Manikonda", "Tirupati"], qualifications: "MDS (Prosthodontics)", bio: "Expert in dental implants and cosmetic dentistry, bringing smiles back to life.", imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80" },
  { id: "doc-harshith", name: "Dr K Harshith", specialization: "Oral & Maxillofacial Surgeon", experience: "8+ Years", clinics: ["Vijayawada", "Guntur", "Kondapur"], qualifications: "MDS (Oral & Maxillofacial Surgery)", bio: "Specialist in complex oral surgeries and facial aesthetics.", imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80" },
];

export const clinics = [
  { id: "clinic-kondapur", name: "H&H Kondapur", city: "Hyderabad", region: "Telangana", address: "Plot 45, Botanical Garden Road, Kondapur, Hyderabad 500084", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Kondapur+Hyderabad", imageUrl: "https://images.unsplash.com/photo-1631217868264-e6b90bb7e133?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-manikonda", name: "H&H Manikonda", city: "Hyderabad", region: "Telangana", address: "Lanco Hills Road, Manikonda, Hyderabad 500089", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Manikonda+Hyderabad", imageUrl: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-tirupati", name: "H&H Tirupati", city: "Tirupati", region: "Andhra Pradesh", address: "Air Bypass Road, Tirupati 517501", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Tirupati", imageUrl: "https://images.unsplash.com/photo-1643297654416-0571c5a42199?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-nagari", name: "H&H Nagari", city: "Nagari", region: "Andhra Pradesh", address: "Main Road, Nagari 517590", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Nagari", imageUrl: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-eluru", name: "H&H Eluru", city: "Eluru", region: "Andhra Pradesh", address: "Powerpet, Eluru 534002", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Eluru", imageUrl: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-ongole", name: "H&H Ongole", city: "Ongole", region: "Andhra Pradesh", address: "Kurnool Road, Ongole 523001", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Ongole", imageUrl: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-vijayawada", name: "H&H Vijayawada", city: "Vijayawada", region: "Andhra Pradesh", address: "Benz Circle, Vijayawada 520010", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Vijayawada", imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-jangareddygudem", name: "H&H Jangareddygudem", city: "Jangareddygudem", region: "Andhra Pradesh", address: "Main Road, Jangareddygudem 534447", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Jangareddygudem", imageUrl: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-tadepalligudem", name: "H&H Tadepalligudem", city: "Tadepalligudem", region: "Andhra Pradesh", address: "KN Road, Tadepalligudem 534101", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Tadepalligudem", imageUrl: "https://images.unsplash.com/photo-1631217868264-e6b90bb7e133?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-badvel", name: "H&H Badvel", city: "Badvel", region: "Andhra Pradesh", address: "Main Road, Badvel 516227", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Badvel", imageUrl: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-guntur", name: "H&H Guntur", city: "Guntur", region: "Andhra Pradesh", address: "Brodipet, Guntur 522002", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Guntur", imageUrl: "https://images.unsplash.com/photo-1643297654416-0571c5a42199?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-bhimavaram", name: "H&H Bhimavaram", city: "Bhimavaram", region: "Andhra Pradesh", address: "Main Road, Bhimavaram 534201", phone: "+91 97033 34624", mapUrl: "https://maps.google.com/?q=Bhimavaram", imageUrl: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80" },
];

export const appointments = [];

export const MOCK_SERVICES = services;
export const MOCK_DOCTORS = doctors;
export const MOCK_CLINICS = clinics;
export const MOCK_APPOINTMENTS = appointments;

export const TESTIMONIALS = [
  { id: 1, name: "Ananya S.", treatment: "Smile Makeover", quote: "I booked for veneers and ended up with the most carefully planned smile journey I have ever experienced. The clinic feels five-star from start to finish." },
  { id: 2, name: "Kiran V.", treatment: "Dental Implants", quote: "The consultation made the decision easy. Every detail was explained clearly, and the final result feels secure, natural, and incredibly polished." },
  { id: 3, name: "Madhuri R.", treatment: "Clear Aligners", quote: "The team made orthodontic treatment feel premium and effortless. Progress reviews were smooth, and booking was simple even with my travel schedule." }
];

export const BEFORE_AFTER_CASES = [
  { id: 1, label: "Veneer Enhancement", before: "https://images.unsplash.com/photo-1593022356769-11f762e25ed9?auto=format&fit=crop&w=1200&q=80", after: "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?auto=format&fit=crop&w=1200&q=80" },
  { id: 2, label: "Whitening Refresh", before: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80", after: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80" }
];

export const SITE_STATS = [
  { value: "15K+", label: "smiles elevated" },
  { value: "12", label: "premium clinics" },
  { value: "24h", label: "appointment response" },
  { value: "4.9", label: "patient satisfaction" }
];
