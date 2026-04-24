require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Clinic    = require("../models/Clinic");
const Doctor    = require("../models/Doctor");
const Service   = require("../models/Service");
const AdminUser = require("../models/AdminUser");

// ── Clinic seed data ──────────────────────────────────────
const clinicsData = [
  { name:"H&H Kondapur",      city:"Kondapur",      state:"Telangana",       address:"Plot 45, Kondapur Main Rd, Hyderabad – 500084", phone:"+91 98765 11001", email:"kondapur@hhdental.in"   },
  { name:"H&H Manikonda",     city:"Manikonda",     state:"Telangana",       address:"Shop 12, Manikonda Junction, Hyderabad – 500089", phone:"+91 98765 11002", email:"manikonda@hhdental.in"  },
  { name:"H&H Tirupati",      city:"Tirupati",      state:"Andhra Pradesh",  address:"42 RC Road, Tirupati – 517501",                  phone:"+91 98765 11003", email:"tirupati@hhdental.in"   },
  { name:"H&H Ongole",        city:"Ongole",        state:"Andhra Pradesh",  address:"10 Kurnool Road, Ongole – 523001",               phone:"+91 98765 11004", email:"ongole@hhdental.in"     },
  { name:"H&H Guntur",        city:"Guntur",        state:"Andhra Pradesh",  address:"88 Brodipet, Guntur – 522002",                   phone:"+91 98765 11005", email:"guntur@hhdental.in"     },
  { name:"H&H Vijayawada",    city:"Vijayawada",    state:"Andhra Pradesh",  address:"Benz Circle, Vijayawada – 520010",               phone:"+91 98765 11006", email:"vijayawada@hhdental.in" },
  { name:"H&H Nellore",       city:"Nellore",       state:"Andhra Pradesh",  address:"Grand Trunk Road, Nellore – 524001",             phone:"+91 98765 11007", email:"nellore@hhdental.in"    },
  { name:"H&H Visakhapatnam", city:"Visakhapatnam", state:"Andhra Pradesh",  address:"Dwaraka Nagar, Vizag – 530016",                  phone:"+91 98765 11008", email:"vizag@hhdental.in"      },
];

// ── Service seed data ─────────────────────────────────────
const servicesData = [
  {
    title:"Dental Implants", category:"dental", icon:"◈", displayOrder:1,
    description:"Permanent tooth replacement that looks, feels, and functions like your natural teeth.",
    benefits:["Lifetime durability","Natural appearance","Preserves jawbone","No adhesives needed"],
    process:["Initial consultation & X-ray","Implant placement surgery","Osseointegration (healing period)","Abutment & crown fitting","Final review & aftercare"],
  },
  {
    title:"Orthodontics & Braces", category:"dental", icon:"◎", displayOrder:2,
    description:"Comprehensive orthodontic solutions including metal, ceramic, and clear aligner options.",
    benefits:["Corrects misalignment","Improves bite function","Boosts confidence","Discreet options available"],
    process:["Orthodontic assessment","Treatment plan creation","Appliance fitting","Regular adjustment visits","Retainer stage"],
  },
  {
    title:"Root Canal Treatment", category:"dental", icon:"✦", displayOrder:3,
    description:"Pain-free, precision root canal therapy to save infected teeth using advanced rotary technology.",
    benefits:["Eliminates tooth pain","Saves natural tooth","Single-visit option","High success rate"],
    process:["Diagnosis & X-ray","Local anaesthesia","Pulp removal & cleaning","Canal filling & sealing","Crown placement"],
  },
  {
    title:"Teeth Whitening", category:"dental", icon:"◇", displayOrder:4,
    description:"Professional in-chair and take-home whitening solutions for a brilliantly bright smile.",
    benefits:["Up to 8 shades lighter","Fast results","Customised trays","Long-lasting effects"],
    process:["Shade assessment","Protective gel application","Whitening agent activation","Light treatment session","Aftercare guidance"],
  },
  {
    title:"Dental Veneers", category:"dental", icon:"❋", displayOrder:5,
    description:"Ultra-thin porcelain veneers crafted to perfect your smile's shape, colour, and symmetry.",
    benefits:["Instant smile makeover","Stain resistant","Minimal tooth prep","Natural translucency"],
    process:["Consultation & smile design","Tooth preparation","Impression & lab fabrication","Veneer bonding","Final polish & review"],
  },
  {
    title:"Wisdom Tooth Extraction", category:"dental", icon:"⊕", displayOrder:6,
    description:"Safe, comfortable removal of problematic wisdom teeth under local or general anaesthesia.",
    benefits:["Relieves pain & pressure","Prevents infection","Quick recovery","Expert surgical team"],
    process:["X-ray evaluation","Anaesthesia administration","Surgical extraction","Wound closure","Recovery instructions"],
  },
  {
    title:"Botox & Fillers", category:"aesthetic", icon:"✧", displayOrder:7,
    description:"FDA-approved botulinum toxin and hyaluronic acid dermal fillers for a youthful, refreshed look.",
    benefits:["Non-surgical","Immediate results","Minimal downtime","Natural-looking finish"],
    process:["Facial analysis consultation","Treatment mapping","Precise injection technique","Immediate aftercare","2-week review"],
  },
  {
    title:"Laser Skin Resurfacing", category:"aesthetic", icon:"◉", displayOrder:8,
    description:"Advanced fractional laser treatments to reduce wrinkles, scars, and pigmentation.",
    benefits:["Stimulates collagen","Reduces fine lines","Evens skin tone","Suitable for all skin types"],
    process:["Skin type assessment","Pre-treatment skincare","Laser treatment session","Cooling & soothing application","Post-care protocol"],
  },
  {
    title:"PRP Therapy", category:"aesthetic", icon:"✺", displayOrder:9,
    description:"Platelet-rich plasma therapy for facial rejuvenation and hair restoration using your own biology.",
    benefits:["Natural regeneration","Zero allergic risk","Dual skin & hair use","Long-lasting outcomes"],
    process:["Blood draw (small sample)","PRP centrifuge processing","Micro-needling preparation","PRP application","Recovery guidance"],
  },
  {
    title:"Chemical Peels", category:"aesthetic", icon:"◐", displayOrder:10,
    description:"Medical-grade superficial, medium, and deep peels for radiant, renewed skin.",
    benefits:["Removes dead skin cells","Improves texture","Reduces pigmentation","Boosts radiance"],
    process:["Consultation & skin analysis","Pre-peel preparation","Chemical solution application","Neutralisation & removal","Moisturising aftercare"],
  },
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
  ]);
  console.log("🗑   Cleared existing collections.");

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
      name:"Dr. Haritha Reddy", specialization:"Prosthodontist", experience:"12 Years",
      qualifications:"BDS, MDS (Prosthodontics)",
      bio:"Dr. Haritha specialises in full-mouth rehabilitation and aesthetic smile design with over a decade of expertise.",
      clinics:[clinicMap["H&H Kondapur"], clinicMap["H&H Manikonda"]],
    },
    {
      name:"Dr. Hemanth Kumar", specialization:"Orthodontist", experience:"9 Years",
      qualifications:"BDS, MDS (Orthodontics)",
      bio:"Expert in Invisalign and ceramic braces, Dr. Hemanth has transformed over 2,000 smiles across Andhra Pradesh.",
      clinics:[clinicMap["H&H Guntur"], clinicMap["H&H Vijayawada"]],
    },
    {
      name:"Dr. Sravani Nair", specialization:"Implantologist", experience:"11 Years",
      qualifications:"BDS, MDS, FICOI (Implants)",
      bio:"Trained in Switzerland, Dr. Sravani brings world-class dental implant techniques to South India.",
      clinics:[clinicMap["H&H Tirupati"], clinicMap["H&H Ongole"]],
    },
    {
      name:"Dr. Rajesh Varma", specialization:"Aesthetic Dermatologist", experience:"8 Years",
      qualifications:"MBBS, MD (Dermatology), FAAD",
      bio:"Dr. Rajesh is a leading aesthetic specialist offering advanced skin rejuvenation and facial contouring treatments.",
      clinics:[clinicMap["H&H Kondapur"], clinicMap["H&H Visakhapatnam"]],
    },
    {
      name:"Dr. Priya Anand", specialization:"Endodontist", experience:"7 Years",
      qualifications:"BDS, MDS (Endodontics)",
      bio:"Specialising in pain-free root canal therapy, Dr. Priya uses the latest rotary instrumentation technology.",
      clinics:[clinicMap["H&H Nellore"], clinicMap["H&H Guntur"]],
    },
    {
      name:"Dr. Anil Chandra", specialization:"Oral & Maxillofacial Surgeon", experience:"15 Years",
      qualifications:"BDS, MDS, FICOMS",
      bio:"With 15 years of surgical excellence, Dr. Anil is the region's foremost expert in wisdom tooth extractions and jaw surgery.",
      clinics:[clinicMap["H&H Vijayawada"], clinicMap["H&H Tirupati"]],
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
