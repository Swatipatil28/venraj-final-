import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 5173);

  // --- Memory Fallback Storage (For Cloud Preview) ---
  let useMockData = false;
  const mockStorage = {
    appointments: [
      { _id: "m1", patientName: "Rahul Sharma (Preview)", phone: "919876543210", age: 32, gender: "Male", symptoms: "Toothache", clinicName: "H&H Jubilee Hills", clinic: "H&H Jubilee Hills", doctorName: "Dr. Anita Rao", serviceName: "Root Canal", service: "Root Canal", preferredDate: "2024-04-20", status: "pending", createdAt: new Date() },
      { _id: "m2", patientName: "Priya Patel (Preview)", phone: "918888888888", age: 29, gender: "Female", symptoms: "Discoloration", clinicName: "H&H Gachibowli", clinic: "H&H Gachibowli", doctorName: "Dr. Vikram Singh", serviceName: "Whitening", service: "Whitening", preferredDate: "2024-04-19", status: "confirmed", createdAt: new Date() }
    ],
    doctors: [
      { 
        _id: "d1", 
        name: "Dr. Anita Rao", 
        specialization: "Orthodontist", 
        experience: 12, 
        qualifications: "MDS - Orthodontics",
        assignedClinicIds: ["c1"], 
        bio: "Specialist in smile design and invisible braces.",
        image: "https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200&h=200" 
      }
    ],
    services: [
      { _id: "s1", name: "Laser Whitening", category: "Aesthetic", description: "Advanced whitening for a brighter smile.", benefits: ["Instant results", "Safe"], processSteps: ["Consultation", "Application"], icon: "Zap" },
      { _id: "s2", name: "Clear Aligners", category: "Dental", description: "Modern alternative to braces.", benefits: ["Invisible", "Comfortable"], processSteps: ["Scanning", "Fitting"], icon: "Smile" }
    ],
    clinics: [
      { _id: "c1", name: "H&H Jubilee Hills", city: "Hyderabad", state: "Telangana", address: "Road No. 36", phone: "040-1234567", email: "jh@hhdental.com" },
      { _id: "c2", name: "H&H Vizag", city: "Visakhapatnam", state: "Andhra Pradesh", address: "Beach Road", phone: "0891-987654", email: "vizag@hhdental.com" }
    ]
  };

  // MongoDB Connection (Non-blocking)
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hh_dental";
  
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB successfully");
      useMockData = false;
    })
    .catch((error) => {
      useMockData = false;
      console.error("MongoDB connection failed. Mock fallback is disabled.", error.message);
    });

  app.use(cors());
  app.use(express.json());

  // --- Mongoose Models ---

  const appointmentSchema = new mongoose.Schema({
    patientName: String,
    phone: String,
    age: Number,
    symptoms: String,
    medications: String,
    medicalHistory: String,
    clinicId: String,
    clinicName: String,
    doctorId: String,
    doctorName: String,
    serviceId: String,
    serviceName: String,
    preferredDate: String,
    appointmentTime: String,
    status: { type: String, default: "pending" },
    contacted: { type: Boolean, default: false },
    notes: String,
    createdAt: { type: Date, default: Date.now }
  });
  const Appointment = mongoose.model("Appointment", appointmentSchema);

  const doctorSchema = new mongoose.Schema({
    name: String,
    specialization: String,
    experience: Number,
    qualifications: String,
    assignedClinicIds: [String],
    bio: String,
    image: String
  });
  const Doctor = mongoose.model("Doctor", doctorSchema);

  const serviceSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    benefits: [String],
    processSteps: [String],
    icon: String
  });
  const Service = mongoose.model("Service", serviceSchema);

  const clinicSchema = new mongoose.Schema({
    name: String,
    city: String,
    state: String,
    address: String,
    phone: String,
    email: String
  });
  const Clinic = mongoose.model("Clinic", clinicSchema);

  // --- Seed Initial Data if DB is empty ---
  async function seedData() {
    if (mongoose.connection.readyState !== 1) return;
    
    const docCount = await Doctor.countDocuments();
    if (docCount === 0) {
      await Doctor.create([
        { name: "Dr. Anita Rao", specialization: "Orthodontics", experience: 12, assignedClinicIds: ["c1"], image: "https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200&h=200" },
        { name: "Dr. Vikram Singh", specialization: "Periodontics", experience: 8, assignedClinicIds: ["c2"], image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200" }
      ]);
    }

    const aptCount = await Appointment.countDocuments();
    if (aptCount === 0) {
      await Appointment.create([
        { patientName: "Rahul Sharma", phone: "919876543210", symptoms: "Toothache", clinicName: "H&H Jubilee Hills", doctorName: "Dr. Anita Rao", serviceName: "Root Canal", preferredDate: "2024-04-20", status: "pending" },
        { patientName: "Priya Patel", phone: "918888888888", symptoms: "Discoloration", clinicName: "H&H Gachibowli", doctorName: "Dr. Vikram Singh", serviceName: "Whitening", preferredDate: "2024-04-19", status: "confirmed" }
      ]);
    }
  }
  
  if (mongoose.connection.readyState === 1) {
    seedData();
  } else {
    mongoose.connection.once('open', seedData);
  }

  const normalizeStatus = (status?: string) => {
    const normalized = (status || "pending").toLowerCase();
    return ["pending", "confirmed", "completed", "cancelled"].includes(normalized)
      ? normalized
      : "pending";
  };

  const shapeAppointment = (appointment: any) => {
    const item = typeof appointment?.toObject === "function" ? appointment.toObject() : appointment;
    return {
      ...item,
      status: normalizeStatus(item.status),
      clinic: item.clinicName || item.clinic || "",
      service: item.serviceName || item.service || "",
      clinicName: item.clinicName || item.clinic || "",
      serviceName: item.serviceName || item.service || "",
    };
  };

  const mapAppointments = (appointments: any[]) => appointments.map(shapeAppointment);

  const createAppointment = async (payload: any) => {
    const body = {
      ...payload,
      status: normalizeStatus(payload.status),
      clinicName: payload.clinicName || payload.clinic || "",
      serviceName: payload.serviceName || payload.service || "",
      doctorName: payload.doctorName || "",
    };

    if (useMockData || mongoose.connection.readyState !== 1) {
      const item = shapeAppointment({
        _id: Date.now().toString(),
        createdAt: new Date(),
        ...body,
      });
      mockStorage.appointments.unshift(item);
      return item;
    }

    const created = await Appointment.create(body);
    return shapeAppointment(created);
  };

  const updateAppointment = async (id: string, payload: any) => {
    const update = {
      ...payload,
      ...(payload.status ? { status: normalizeStatus(payload.status) } : {}),
      ...(payload.clinic || payload.clinicName ? { clinicName: payload.clinicName || payload.clinic } : {}),
      ...(payload.service || payload.serviceName ? { serviceName: payload.serviceName || payload.service } : {}),
    };

    if (useMockData || mongoose.connection.readyState !== 1) {
      mockStorage.appointments = mockStorage.appointments.map((appointment) =>
        appointment._id === id ? shapeAppointment({ ...appointment, ...update }) : appointment
      );
      return mockStorage.appointments.find((appointment) => appointment._id === id);
    }

    const updated = await Appointment.findByIdAndUpdate(id, update, { new: true });
    return updated ? shapeAppointment(updated) : null;
  };

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
  });

  // Appointments
  app.get("/api/admin/appointments", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        return res.json(mapAppointments(mockStorage.appointments));
      }
      const appointments = await Appointment.find().sort({ createdAt: -1 });
      res.json(mapAppointments(appointments));
    } catch (error) {
      res.status(200).json(mapAppointments(mockStorage.appointments));
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        return res.json(mapAppointments(mockStorage.appointments));
      }
      const appointments = await Appointment.find().sort({ createdAt: -1 });
      res.json(mapAppointments(appointments));
    } catch (error) {
      res.status(200).json(mapAppointments(mockStorage.appointments));
    }
  });

  app.get("/api/admin/appointments/history/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      if (useMockData || mongoose.connection.readyState !== 1) {
        return res.json(mapAppointments(mockStorage.appointments.filter(a => a.phone === phone)));
      }
      const history = await Appointment.find({ phone }).sort({ preferredDate: -1 });
      res.json(mapAppointments(history));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patient history" });
    }
  });

  app.get("/api/appointments/history/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      if (useMockData || mongoose.connection.readyState !== 1) {
        return res.json(mapAppointments(mockStorage.appointments.filter(a => a.phone === phone)));
      }
      const history = await Appointment.find({ phone }).sort({ preferredDate: -1 });
      res.json(mapAppointments(history));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patient history" });
    }
  });

  app.post("/api/admin/appointments", async (req, res) => {
    try {
      const appointment = await createAppointment(req.body);
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointment = await createAppointment(req.body);
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  app.put("/api/admin/appointments/:id", async (req, res) => {
    try {
      const appointment = await updateAppointment(req.params.id, req.body);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await updateAppointment(req.params.id, req.body);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const appointment = await updateAppointment(req.params.id, { status: req.body.status });
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment status" });
    }
  });

  // Doctors
  app.get("/api/admin/doctors", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) return res.json(mockStorage.doctors);
      const doctors = await Doctor.find();
      res.json(doctors);
    } catch (error) {
      res.json(mockStorage.doctors);
    }
  });

  app.get("/api/doctors", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) return res.json(mockStorage.doctors);
      const doctors = await Doctor.find();
      res.json(doctors);
    } catch (error) {
      res.json(mockStorage.doctors);
    }
  });

  app.post("/api/admin/doctors", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        const item = { ...req.body, _id: Date.now().toString() };
        mockStorage.doctors.push(item);
        return res.json(item);
      }
      const doctor = await Doctor.create(req.body);
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: "Failed to create doctor" });
    }
  });

  app.post("/api/doctors", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        const item = { ...req.body, _id: Date.now().toString() };
        mockStorage.doctors.push(item);
        return res.json(item);
      }
      const doctor = await Doctor.create(req.body);
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: "Failed to create doctor" });
    }
  });

  app.put("/api/admin/doctors/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.doctors = mockStorage.doctors.map(d => d._id === req.params.id ? { ...d, ...req.body } : d);
        return res.json(mockStorage.doctors.find(d => d._id === req.params.id));
      }
      const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: "Failed to update doctor" });
    }
  });

  app.put("/api/doctors/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.doctors = mockStorage.doctors.map(d => d._id === req.params.id ? { ...d, ...req.body } : d);
        return res.json(mockStorage.doctors.find(d => d._id === req.params.id));
      }
      const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: "Failed to update doctor" });
    }
  });

  app.delete("/api/admin/doctors/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.doctors = mockStorage.doctors.filter(d => d._id !== req.params.id);
        return res.json({ success: true });
      }
      await Doctor.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete doctor" });
    }
  });

  app.delete("/api/doctors/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.doctors = mockStorage.doctors.filter(d => d._id !== req.params.id);
        return res.json({ success: true });
      }
      await Doctor.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete doctor" });
    }
  });

  // Services
  app.get("/api/admin/services", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) return res.json(mockStorage.services);
      const services = await Service.find();
      res.json(services);
    } catch (error) {
      res.status(200).json(mockStorage.services);
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) return res.json(mockStorage.services);
      const services = await Service.find();
      res.json(services);
    } catch (error) {
      res.status(200).json(mockStorage.services);
    }
  });

  app.post("/api/admin/services", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        const item = { ...req.body, _id: Date.now().toString() };
        mockStorage.services.push(item);
        return res.json(item);
      }
      const service = await Service.create(req.body);
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        const item = { ...req.body, _id: Date.now().toString() };
        mockStorage.services.push(item);
        return res.json(item);
      }
      const service = await Service.create(req.body);
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/admin/services/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.services = mockStorage.services.map(s => s._id === req.params.id ? { ...s, ...req.body } : s);
        return res.json(mockStorage.services.find(s => s._id === req.params.id));
      }
      const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.put("/api/services/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.services = mockStorage.services.map(s => s._id === req.params.id ? { ...s, ...req.body } : s);
        return res.json(mockStorage.services.find(s => s._id === req.params.id));
      }
      const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.services = mockStorage.services.filter(s => s._id !== req.params.id);
        return res.json({ success: true });
      }
      await Service.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.services = mockStorage.services.filter(s => s._id !== req.params.id);
        return res.json({ success: true });
      }
      await Service.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Clinics
  app.get("/api/admin/clinics", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) return res.json(mockStorage.clinics);
      const clinics = await Clinic.find();
      res.json(clinics);
    } catch (error) {
      res.status(200).json(mockStorage.clinics);
    }
  });

  app.get("/api/clinics", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) return res.json(mockStorage.clinics);
      const clinics = await Clinic.find();
      res.json(clinics);
    } catch (error) {
      res.status(200).json(mockStorage.clinics);
    }
  });

  app.post("/api/admin/clinics", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        const item = { ...req.body, _id: Date.now().toString() };
        mockStorage.clinics.push(item);
        return res.json(item);
      }
      const clinic = await Clinic.create(req.body);
      res.json(clinic);
    } catch (error) {
      res.status(500).json({ error: "Failed to create clinic" });
    }
  });

  app.post("/api/clinics", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        const item = { ...req.body, _id: Date.now().toString() };
        mockStorage.clinics.push(item);
        return res.json(item);
      }
      const clinic = await Clinic.create(req.body);
      res.json(clinic);
    } catch (error) {
      res.status(500).json({ error: "Failed to create clinic" });
    }
  });

  app.put("/api/admin/clinics/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.clinics = mockStorage.clinics.map(c => c._id === req.params.id ? { ...c, ...req.body } : c);
        return res.json(mockStorage.clinics.find(c => c._id === req.params.id));
      }
      const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(clinic);
    } catch (error) {
      res.status(500).json({ error: "Failed to update clinic" });
    }
  });

  app.put("/api/clinics/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.clinics = mockStorage.clinics.map(c => c._id === req.params.id ? { ...c, ...req.body } : c);
        return res.json(mockStorage.clinics.find(c => c._id === req.params.id));
      }
      const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(clinic);
    } catch (error) {
      res.status(500).json({ error: "Failed to update clinic" });
    }
  });

  app.delete("/api/admin/clinics/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.clinics = mockStorage.clinics.filter(c => c._id !== req.params.id);
        return res.json({ success: true });
      }
      await Clinic.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete clinic" });
    }
  });

  app.delete("/api/clinics/:id", async (req, res) => {
    try {
      if (useMockData || mongoose.connection.readyState !== 1) {
        mockStorage.clinics = mockStorage.clinics.filter(c => c._id !== req.params.id);
        return res.json({ success: true });
      }
      await Clinic.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete clinic" });
    }
  });

  // --- Vite Dev Server / Production Static Serving ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    }
    throw error;
  });
}

startServer();
