# H&H Dental Services — Backend API

Production-ready Node.js + Express + MongoDB backend for the H&H Dental Services platform.

---

## Quick Start

```bash
cd hh-backend
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env — set MONGO_URI and other vars

# Seed the database (clinics, doctors, services, admin user)
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5001` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/hh_dental` |
| `JWT_SECRET` | JWT signing secret | *(required)* |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `ADMIN_EMAIL` | Seed admin email | `admin@hhdental.in` |
| `ADMIN_PASSWORD` | Seed admin password | `Admin@1234` |
| `SMTP_HOST` | SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | — |
| `SMTP_PASS` | SMTP app password | — |
| `WHATSAPP_NUMBER` | WhatsApp number (with country code) | `919876511001` |

---

## API Reference

### Base URL
```
http://localhost:5001/api
```

### Response Format
```json
{ "success": true, "data": { ... }, "message": "Success" }
{ "success": false, "message": "Error description" }
```

---

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/clinics` | List all active clinics |
| GET | `/api/clinics/:id` | Get clinic by ID |
| GET | `/api/doctors` | List all active doctors |
| GET | `/api/doctors/:id` | Get doctor by ID |
| GET | `/api/services` | List all active services |
| GET | `/api/services/:id` | Get service by ID |
| POST | `/api/appointments` | Submit appointment request |
| GET | `/health` | Health check |

**Query params for GET /api/doctors:**
- `?specialization=Orthodontist`
- `?clinicId=<mongoId>`

**Query params for GET /api/services:**
- `?category=dental`
- `?category=aesthetic`

---

### Admin Endpoints (JWT Required)

**Header:** `Authorization: Bearer <token>`

#### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin login → returns JWT |
| GET | `/api/admin/me` | Get logged-in admin profile |

#### Appointments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/appointments` | List appointments (paginated + filtered) |
| GET | `/api/admin/appointments/stats` | Dashboard stats |
| GET | `/api/admin/appointments/:id` | Get single appointment + WhatsApp links |
| PUT | `/api/admin/appointments/:id` | Update status / notes / doctor |
| DELETE | `/api/admin/appointments/:id` | Delete appointment |
| GET | `/api/admin/appointments/:id/whatsapp` | Get WhatsApp deep-link |

**Query params for GET /api/admin/appointments:**
- `?page=1&limit=10`
- `?status=Pending`
- `?clinicId=<id>`
- `?date=2025-07-15` (exact date)
- `?dateFrom=2025-07-01&dateTo=2025-07-31` (date range)
- `?search=Ravi` (name, phone, or ref)

#### Clinics / Doctors / Services
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/clinics` | Create clinic |
| PUT | `/api/admin/clinics/:id` | Update clinic |
| DELETE | `/api/admin/clinics/:id` | Deactivate clinic |
| POST | `/api/admin/doctors` | Create doctor |
| PUT | `/api/admin/doctors/:id` | Update doctor |
| DELETE | `/api/admin/doctors/:id` | Deactivate doctor |
| POST | `/api/admin/services` | Create service |
| PUT | `/api/admin/services/:id` | Update service |
| DELETE | `/api/admin/services/:id` | Deactivate service |

---

## Appointment Status Flow

```
Pending → Confirmed → Completed
Pending → Cancelled
Confirmed → Cancelled
```

---

## Database Models

### Appointment
```
patientName, phone, age, symptoms, medications, medicalHistory,
clinicId (ref), doctorId (ref), serviceId (ref),
preferredDate, status, confirmedDate, notes, appointmentRef
```

### Clinic
```
name, city, state, address, phone, email, isActive
```

### Doctor
```
name, specialization, experience, qualifications, bio, imageUrl,
clinics (ref[]), isActive
```

### Service
```
title, category (dental|aesthetic), description, benefits[],
process[], icon, displayOrder, isActive
```

### AdminUser
```
name, email, password (hashed), role (admin|super_admin),
isActive, lastLogin
```

---

## Rate Limits

| Route | Limit |
|---|---|
| Global | 200 req / 15 min |
| `POST /api/appointments` | 10 req / hour |
| `POST /api/admin/login` | 10 req / 15 min |

---

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** express-validator
- **Email:** Nodemailer
- **Security:** Helmet, CORS, express-rate-limit
- **Dev:** nodemon

---

H&H Dental Services © 2025
