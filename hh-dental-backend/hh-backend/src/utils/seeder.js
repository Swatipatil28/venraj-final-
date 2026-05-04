require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Clinic    = require("../models/Clinic");
const Doctor    = require("../models/Doctor");
const Service   = require("../models/Service");
const AdminUser = require("../models/AdminUser");
const Testimonial = require("../models/Testimonial");

// ── Clinic seed data ──────────────────────────────────────
const clinicsData = [
  // Telangana / Hyderabad
  { name: "H&H Kondapur", city: "Hyderabad", state: "Telangana", area: "Kondapur", phone: "+91 97033 34624", email: "kondapur@hhdental.in" },
  { name: "H&H Manikonda", city: "Hyderabad", state: "Telangana", area: "Manikonda", phone: "+91 97033 34624", email: "manikonda@hhdental.in" },
  // Andhra Pradesh
  { name: "H&H Tirupati", city: "Tirupati", state: "Andhra Pradesh", area: "Tirupati", phone: "+91 97033 34624", email: "tirupati@hhdental.in" },
  { name: "H&H Nagari", city: "Nagari", state: "Andhra Pradesh", area: "Nagari", phone: "+91 97033 34624", email: "nagari@hhdental.in" },
  { name: "H&H Eluru", city: "Eluru", state: "Andhra Pradesh", area: "Eluru", phone: "+91 97033 34624", email: "eluru@hhdental.in" },
  { name: "H&H Ongole", city: "Ongole", state: "Andhra Pradesh", area: "Ongole", phone: "+91 97033 34624", email: "ongole@hhdental.in" },
  { name: "H&H Vijayawada", city: "Vijayawada", state: "Andhra Pradesh", area: "Vijayawada", phone: "+91 97033 34624", email: "vijayawada@hhdental.in" },
  { name: "H&H Jangareddygudem", city: "Jangareddygudem", state: "Andhra Pradesh", area: "Jangareddygudem", phone: "+91 97033 34624", email: "jangareddygudem@hhdental.in" },
  { name: "H&H Tadepalligudem", city: "Tadepalligudem", state: "Andhra Pradesh", area: "Tadepalligudem", phone: "+91 97033 34624", email: "tadepalligudem@hhdental.in" },
  { name: "H&H Badvel", city: "Badvel", state: "Andhra Pradesh", area: "Badvel", phone: "+91 97033 34624", email: "badvel@hhdental.in" },
  { name: "H&H Guntur", city: "Guntur", state: "Andhra Pradesh", area: "Guntur", phone: "+91 97033 34624", email: "guntur@hhdental.in" },
  { name: "H&H Bhimavaram", city: "Bhimavaram", state: "Andhra Pradesh", area: "Bhimavaram", phone: "+91 97033 34624", email: "bhimavaram@hhdental.in" },
];

// ── Service seed data ─────────────────────────────────────
const servicesData = [
  {
    title: "Dental Check-up", category: "dental", icon: "◈", displayOrder: 1,
    description: "Comprehensive oral examination to maintain your dental health.",
    benefits: ["Early detection", "Preventive care", "Personalized advice"],
    process: ["Clinical examination", "X-ray if needed", "Cleaning recommendation"],
  },
  {
    title: "Smile Correction", category: "dental", icon: "✦", displayOrder: 2,
    description: "Transform your smile with our advanced correction techniques.",
    benefits: ["Enhanced aesthetics", "Boosted confidence", "Improved function"],
    process: ["Smile analysis", "Treatment planning", "Procedure execution"],
  },
  {
    title: "Dental Implants", category: "dental", icon: "◈", displayOrder: 3,
    description: "Permanent tooth replacement that looks, feels, and functions like your natural teeth.",
    benefits: ["Lifetime durability", "Natural appearance", "Preserves jawbone"],
    process: ["Consultation", "Implant placement", "Healing", "Crown fitting"],
  },
  {
    title: "Dental Caries Management & Fillings", category: "dental", icon: "◎", displayOrder: 4,
    description: "Effective treatment for cavities using modern filling materials.",
    benefits: ["Stops decay", "Restores tooth structure", "Pain relief"],
    process: ["Decay removal", "Cavity preparation", "Filling placement"],
  },
  {
    title: "Invisalign & Aligners", category: "dental", icon: "◎", displayOrder: 5,
    description: "Discreet orthodontic solutions for a straighter smile without braces.",
    benefits: ["Nearly invisible", "Removable", "Comfortable"],
    process: ["Digital scan", "3D planning", "Custom aligner wear"],
  },
  {
    title: "Crowns & Veneers", category: "dental", icon: "❋", displayOrder: 6,
    description: "Restore and enhance your teeth with custom-crafted crowns and veneers.",
    benefits: ["Natural look", "Strength", "Stain resistance"],
    process: ["Tooth prep", "Impression", "Fitting"],
  },
  {
    title: "Complete Dentures", category: "dental", icon: "⊕", displayOrder: 7,
    description: "High-quality dentures for full mouth restoration and function.",
    benefits: ["Restores chewing", "Natural look", "Comfortable fit"],
    process: ["Impressions", "Trial fit", "Final delivery"],
  },
  {
    title: "Full Mouth Rehabilitation", category: "dental", icon: "◈", displayOrder: 8,
    description: "Comprehensive reconstruction of all teeth for health and aesthetics.",
    benefits: ["Total restoration", "Improved bite", "Aesthetic overhaul"],
    process: ["Deep analysis", "Phased treatment", "Final restoration"],
  },
  {
    title: "Mouth Guards & Oral Appliances", category: "dental", icon: "◇", displayOrder: 9,
    description: "Custom appliances for sports protection and teeth grinding.",
    benefits: ["Injury prevention", "Protects enamel", "Better sleep"],
    process: ["Impression", "Custom fabrication", "Fitting"],
  },
  {
    title: "Pediatric Dentistry", category: "dental", icon: "✦", displayOrder: 10,
    description: "Specialized dental care for children in a friendly environment.",
    benefits: ["Child-friendly", "Preventive focus", "Early habit correction"],
    process: ["Gentle check-up", "Preventive care", "Parent education"],
  },
  {
    title: "Head and Neck Trauma, Cysts & Tumors", category: "dental", icon: "⊕", displayOrder: 11,
    description: "Expert surgical management of complex head and neck conditions.",
    benefits: ["Expert care", "Advanced techniques", "Compassionate approach"],
    process: ["Diagnosis", "Surgical planning", "Operation", "Recovery"],
  },
  {
    title: "Facial Aesthetics", category: "aesthetic", icon: "✧", displayOrder: 12,
    description: "Enhance your natural beauty with our aesthetic facial treatments.",
    benefits: ["Youthful look", "Balanced features", "Non-surgical options"],
    process: ["Consultation", "Treatment mapping", "Procedure"],
  },
  {
    title: "Hair Transplant & Other Services", category: "aesthetic", icon: "✺", displayOrder: 13,
    description: "Advanced hair restoration and various aesthetic enhancements.",
    benefits: ["Natural hair growth", "Self-confidence", "Expert execution"],
    process: ["Consultation", "Procedure", "Aftercare"],
  },
];

// ── Testimonial seed data ──────────────────────────────────
const testimonialsData = [
  {
    name: "Anita Sharma",
    treatment: "Smile Correction",
    quote: "The care I received at H&H Dental was exceptional. My smile transformation is better than I ever imagined!",
    rating: 5,
    displayOrder: 1
  },
  {
    name: "Rajesh Kumar",
    treatment: "Dental Implants",
    quote: "Professional staff and painless procedure. Highly recommend for anyone looking for quality dental work.",
    rating: 5,
    displayOrder: 2
  },
  {
    name: "Priya V.",
    treatment: "Invisalign",
    quote: "Smooth process from start to finish. The team is very supportive and the results are amazing.",
    rating: 4,
    displayOrder: 3
  }
];

// ── Main seeder ───────────────────────────────────────────
const seed = async () => {
  await connectDB();
  console.log("🌱  Starting database seed...\n");

  // Clear existing data
  await Promise.all([
    Clinic.deleteMany({}),
    Doctor.deleteMany({}),
    Service.deleteMany({}),
    AdminUser.deleteMany({}),
    Testimonial.deleteMany({}),
  ]);
  console.log("🗑   Cleared existing collections.");

  // Seed testimonials
  const testimonials = await Testimonial.insertMany(testimonialsData);
  console.log(`✅  ${testimonials.length} testimonials seeded.`);

  // Seed clinics
  const clinicsToInsert = clinicsData.map(c => ({...c, image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"}));
  const clinics = await Clinic.insertMany(clinicsToInsert);
  console.log(`✅  ${clinics.length} clinics seeded.`);

  // Seed services
  const servicesToInsert = servicesData.map(s => ({...s, image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"}));
  const services = await Service.insertMany(servicesToInsert);
  console.log(`✅  ${services.length} services seeded.`);

  // Map clinic names to IDs for doctor assignment
  const clinicMap = {};
  clinics.forEach((c) => { clinicMap[c.name] = c._id; });

  // Seed doctors with actual clinic references
  const doctorsData = [
    {
      name: "Dr Harshita Akurathi",
      specialization: ["Prosthodontist", "Implantologist", "Cosmetic Dentist", "Aesthetic Dentist"],
      experience: "10+ Years",
      qualifications: "MDS (Prosthodontics)",
      bio: "Dr. Harshita specializes in dental implants and cosmetic dentistry, bringing smiles back to life.",
      state: "Telangana",
      clinics: [clinicMap["H&H Kondapur"], clinicMap["H&H Manikonda"], clinicMap["H&H Tirupati"]],
    },
    {
      name: "Dr K Harshith",
      specialization: ["Oral & Maxillofacial Surgeon", "Cosmetic Dentist", "Aesthetic Dentist"],
      experience: "8+ Years",
      qualifications: "MDS (Oral & Maxillofacial Surgery)",
      bio: "Dr. Harshith is an expert in complex oral surgeries and facial aesthetics.",
      state: "Andhra Pradesh",
      clinics: [clinicMap["H&H Vijayawada"], clinicMap["H&H Guntur"], clinicMap["H&H Kondapur"]],
    },
  ];

  const doctorsToInsert = doctorsData.map(d => ({...d, image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"}));
  const doctors = await Doctor.insertMany(doctorsToInsert);
  console.log(`✅  ${doctors.length} doctors seeded.`);

  // Seed admin user
  const admin = await AdminUser.create({
    name: "H&H Admin",
    email: process.env.ADMIN_EMAIL || "admin@hhdental.in",
    password: process.env.ADMIN_PASSWORD || "Admin@1234",
    role: "super_admin",
  });
  console.log(`✅  Admin user created: ${admin.email}`);

  console.log("\n🎉  Seed complete!\n");
  console.log("─────────────────────────────────────");
  console.log(`📧  Admin Email   : ${admin.email}`);
  console.log(`🔑  Admin Password: ${process.env.ADMIN_PASSWORD || "Admin@1234"}`);
  console.log("─────────────────────────────────────");

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
