export const services = [
  {
    id: "svc-implant-smiles",
    title: "Dental Implants",
    category: "dental",
    description: "Permanent implant restorations designed for stability, confidence, and natural aesthetics.",
    shortDescription: "Precision implants for seamless tooth replacement and renewed function.",
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    benefits: [
      "Natural-looking replacement tailored to your bite and face",
      "Restores chewing comfort and speech confidence",
      "Helps preserve jawbone support over time",
      "Planned digitally for accuracy and comfort"
    ],
    process: [
      "Digital scans and smile analysis",
      "Custom implant planning with CBCT guidance",
      "Precision placement with comfort-first sedation options",
      "Healing and final zirconia restoration delivery"
    ],
    relatedServiceIds: ["svc-full-smile", "svc-root-canal", "svc-whitening"]
  },
  {
    id: "svc-whitening",
    title: "Teeth Whitening",
    category: "dental",
    description: "Professional whitening protocols that brighten safely while protecting enamel.",
    shortDescription: "In-chair and take-home brightening for polished, camera-ready smiles.",
    imageUrl: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Noticeable brightening in a single visit", "Custom shade planning for a refined result", "Reduced sensitivity with clinician-guided care", "Pairs beautifully with smile makeover plans"],
    process: ["Smile consultation and shade mapping", "Enamel-safe prep and protection", "Targeted whitening activation", "Aftercare guidance for longevity"],
    relatedServiceIds: ["svc-veneers", "svc-full-smile", "svc-cleaning"]
  },
  {
    id: "svc-veneers",
    title: "Porcelain Veneers",
    category: "dental",
    description: "Custom porcelain veneers shaped for proportion, brightness, and a naturally elegant finish.",
    shortDescription: "Luxury smile design with handcrafted porcelain detail.",
    imageUrl: "https://images.unsplash.com/photo-1588776814546-ec7e7f4d4048?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Refines shape, spacing, and symmetry", "Beautiful translucency with stain resistance", "Designed around your facial features", "Ideal for complete smile transformations"],
    process: ["Facial analysis and digital smile preview", "Minimal preparation and impression capture", "Trial smile review and refinement", "Final veneer placement and polishing"],
    relatedServiceIds: ["svc-full-smile", "svc-whitening", "svc-aligners"]
  },
  {
    id: "svc-root-canal",
    title: "Microscopic Root Canal",
    category: "dental",
    description: "Comfort-led endodontic care using magnification and modern rotary systems.",
    shortDescription: "Pain-relieving root canal treatment with precise microscopic care.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Relieves pain while preserving your natural tooth", "Improves precision with magnification", "Efficient treatment and gentle recovery", "Pairs with restorative crowns for long-term strength"],
    process: ["Diagnosis and digital imaging", "Comfort-first local anesthesia", "Microscopic canal cleaning and sealing", "Protective restoration planning"],
    relatedServiceIds: ["svc-implant-smiles", "svc-cleaning", "svc-full-smile"]
  },
  {
    id: "svc-aligners",
    title: "Clear Aligners",
    category: "dental",
    description: "Discreet orthodontic correction for adults and teens who want an elegant alignment journey.",
    shortDescription: "Transparent aligner treatment for straighter smiles with minimal disruption.",
    imageUrl: "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Nearly invisible and easy to maintain", "Digital treatment preview before you begin", "Comfortable incremental tooth movement", "Supports bite balance and smile symmetry"],
    process: ["Scan-based orthodontic assessment", "Digital movement planning", "Custom aligner delivery and tracking", "Retention and smile refinement"],
    relatedServiceIds: ["svc-veneers", "svc-whitening", "svc-full-smile"]
  },
  {
    id: "svc-cleaning",
    title: "Dental Hygiene Therapy",
    category: "dental",
    description: "Advanced cleaning and gum wellness care for fresh breath, healthier tissue, and prevention.",
    shortDescription: "Deep hygiene care that keeps your smile polished and healthy.",
    imageUrl: "https://images.unsplash.com/photo-1625134673337-519d00bb0f0c?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Removes buildup and freshens breath", "Supports long-term gum health", "Helps prevent cavities and inflammation", "Excellent as a routine smile maintenance visit"],
    process: ["Oral health assessment", "Gentle ultrasonic and manual cleaning", "Polishing and gum-care guidance", "Recall and prevention planning"],
    relatedServiceIds: ["svc-whitening", "svc-root-canal", "svc-aligners"]
  },
  {
    id: "svc-full-smile",
    title: "Full Smile Makeover",
    category: "aesthetic",
    description: "A bespoke treatment plan combining restorative and cosmetic dentistry for a complete smile transformation.",
    shortDescription: "Custom smile makeover plans crafted around facial harmony and confidence.",
    imageUrl: "https://images.unsplash.com/photo-1593022356769-11f762e25ed9?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Tailored around your features and priorities", "Blends function, aesthetics, and longevity", "Combines multiple disciplines under one team", "Perfect for milestone events and confidence rebuilds"],
    process: ["Private consultation and smile goals review", "Comprehensive imaging and treatment blueprint", "Phased transformation with comfort-focused scheduling", "Final refinement and maintenance planning"],
    relatedServiceIds: ["svc-veneers", "svc-whitening", "svc-implant-smiles"]
  },
  {
    id: "svc-facial-balance",
    title: "Facial Aesthetic Dentistry",
    category: "aesthetic",
    description: "Non-surgical facial enhancement paired with dental planning for overall lower-face harmony.",
    shortDescription: "Refined aesthetic planning for lips, profile balance, and smile framing.",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Enhances smile framing and profile balance", "Subtle, elegant improvements", "Planned alongside dental proportions", "Ideal for confidence-led refinements"],
    process: ["Aesthetic consultation and facial mapping", "Conservative treatment design", "Procedure with comfort-led precision", "Review and maintenance plan"],
    relatedServiceIds: ["svc-full-smile", "svc-whitening", "svc-veneers"]
  },
  {
    id: "svc-gummy-smile",
    title: "Gum Contouring",
    category: "aesthetic",
    description: "Laser-led gum sculpting to reveal more tooth structure and create balanced smile proportions.",
    shortDescription: "Laser contouring for cleaner, more balanced smile architecture.",
    imageUrl: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Improves symmetry and smile balance", "Performed with modern laser precision", "Fast recovery and minimal downtime", "Often combined with whitening or veneers"],
    process: ["Smile design analysis", "Laser contour planning", "Precise reshaping of gum margins", "Review and optional cosmetic pairing"],
    relatedServiceIds: ["svc-whitening", "svc-veneers", "svc-full-smile"]
  },
  {
    id: "svc-kids-dentistry",
    title: "Pediatric Dentistry",
    category: "dental",
    description: "Child-friendly preventive and restorative dentistry focused on comfort and lifelong oral habits.",
    shortDescription: "Gentle pediatric care with prevention-first treatment plans.",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Calm first-visit experience for children", "Early cavity and bite-risk detection", "Preventive plans for growth stages", "Parent guidance and easy follow-up"],
    process: ["Child dental assessment", "Preventive cleaning and fluoride", "Age-appropriate treatment if required", "Home-care coaching for guardians"],
    relatedServiceIds: ["svc-cleaning", "svc-aligners", "svc-whitening"]
  }
];

export const doctors = [
  { id: "doc-haritha", name: "Dr. Haritha Reddy", specialization: "Prosthodontics", experience: "14 years", clinics: ["Kondapur", "Manikonda"], qualifications: "MDS, Smile Rehabilitation", bio: "Known for full-mouth reconstruction plans that balance aesthetics with long-term comfort.", imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80" },
  { id: "doc-hemanth", name: "Dr. Hemanth Kumar", specialization: "Orthodontics", experience: "11 years", clinics: ["Vijayawada", "Guntur"], qualifications: "MDS, Clear Aligner Planning", bio: "Leads premium aligner and smile-balance programs for adult professionals and teens.", imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80" },
  { id: "doc-sravani", name: "Dr. Sravani Nair", specialization: "Implantology", experience: "12 years", clinics: ["Tirupati", "Vizag"], qualifications: "MDS, FICOI", bio: "Specializes in digitally guided implant placement and aesthetic anterior restorations.", imageUrl: "https://images.unsplash.com/photo-1594824388853-d0c88d5f0ec2?auto=format&fit=crop&w=900&q=80" },
  { id: "doc-priya", name: "Dr. Priya Anand", specialization: "Endodontics", experience: "9 years", clinics: ["Nellore", "Guntur"], qualifications: "MDS, Microscopic Endodontics", bio: "Focused on pain-relieving microscopic root canal therapy with restorative preservation.", imageUrl: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=900&q=80" },
  { id: "doc-rajesh", name: "Dr. Rajesh Varma", specialization: "Facial Aesthetics", experience: "10 years", clinics: ["Kondapur", "Vizag"], qualifications: "MD, Facial Rejuvenation", bio: "Pairs conservative facial aesthetic refinement with smile design consultations.", imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=80" },
  { id: "doc-anil", name: "Dr. Anil Chandra", specialization: "Oral Surgery", experience: "16 years", clinics: ["Tirupati", "Vijayawada"], qualifications: "MDS, Maxillofacial Surgery", bio: "Leads advanced surgical procedures with comfort-focused planning and meticulous recovery care.", imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80" }
];

export const clinics = [
  { id: "clinic-kondapur", name: "H&H Dental Kondapur", city: "Hyderabad", region: "Telangana", address: "Plot 45, Botanical Garden Road, Kondapur, Hyderabad 500084", phone: "+91 98765 11001", mapUrl: "https://maps.google.com/?q=Kondapur+Hyderabad", imageUrl: "https://images.unsplash.com/photo-1631217868264-e6b90bb7e133?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-manikonda", name: "H&H Dental Manikonda", city: "Hyderabad", region: "Telangana", address: "Lanco Hills Road, Manikonda, Hyderabad 500089", phone: "+91 98765 11002", mapUrl: "https://maps.google.com/?q=Manikonda+Hyderabad", imageUrl: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-tirupati", name: "H&H Dental Tirupati", city: "Tirupati", region: "Andhra Pradesh", address: "Air Bypass Road, Tirupati 517501", phone: "+91 98765 11003", mapUrl: "https://maps.google.com/?q=Tirupati", imageUrl: "https://images.unsplash.com/photo-1643297654416-0571c5a42199?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-ongole", name: "H&H Dental Ongole", city: "Ongole", region: "Andhra Pradesh", address: "Kurnool Road, Ongole 523001", phone: "+91 98765 11004", mapUrl: "https://maps.google.com/?q=Ongole", imageUrl: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-guntur", name: "H&H Dental Guntur", city: "Guntur", region: "Andhra Pradesh", address: "Brodipet 4th Lane, Guntur 522002", phone: "+91 98765 11005", mapUrl: "https://maps.google.com/?q=Guntur", imageUrl: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-vijayawada", name: "H&H Dental Vijayawada", city: "Vijayawada", region: "Andhra Pradesh", address: "Benz Circle, Vijayawada 520010", phone: "+91 98765 11006", mapUrl: "https://maps.google.com/?q=Vijayawada", imageUrl: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-vizag", name: "H&H Dental Vizag", city: "Visakhapatnam", region: "Andhra Pradesh", address: "MVP Colony, Visakhapatnam 530017", phone: "+91 98765 11007", mapUrl: "https://maps.google.com/?q=Visakhapatnam", imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80" },
  { id: "clinic-nellore", name: "H&H Dental Nellore", city: "Nellore", region: "Andhra Pradesh", address: "Magunta Layout, Nellore 524003", phone: "+91 98765 11008", mapUrl: "https://maps.google.com/?q=Nellore", imageUrl: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&w=1200&q=80" }
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
  { value: "8", label: "premium clinics" },
  { value: "24h", label: "appointment response" },
  { value: "4.9", label: "patient satisfaction" }
];
