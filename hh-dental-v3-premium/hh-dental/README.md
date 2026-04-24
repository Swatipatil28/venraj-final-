# H&H Dental Services — Frontend

> Production-ready React 18 + Tailwind CSS frontend for a multi-location dental & aesthetic clinic platform.

---

## Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Framework   | React 18 + Vite 6           |
| Styling     | Tailwind CSS v3             |
| Routing     | React Router DOM v6         |
| HTTP Client | Axios                       |
| Fonts       | Playfair Display + DM Sans  |

---

## Quick Start

```bash
npm install
cp .env.example .env       # set VITE_API_BASE_URL
npm run dev                # http://localhost:5173
npm run build              # production build
```

---

## Pages & Routes

| Route               | Page                  | Notes                               |
|---------------------|-----------------------|-------------------------------------|
| /                   | HomePage              | Hero, previews, CTA banner          |
| /services           | ServicesPage          | Tabbed: Dental / Aesthetic          |
| /services/:id       | ServiceDetailPage     | Full landing page + appointment form|
| /doctors            | DoctorsPage           | Filter by specialization            |
| /locations          | LocationsPage         | Grouped by state: TS / AP           |
| /book-appointment   | BookAppointmentPage   | Request form + FAQ accordion        |
| *                   | NotFoundPage          | 404 fallback                        |

---

## API Endpoints (src/services/api.service.js)

```
GET  /clinics
GET  /doctors
GET  /services
GET  /services/:id
POST /appointments
```

Appointment POST body (AppointmentDTO):
```json
{
  "patientName": "Ravi Kumar",
  "phone": "+91 98765 43210",
  "issue": "Implant consultation",
  "clinicId": "3",
  "preferredDate": "2025-07-10",
  "serviceId": "1"
}
```

> If the API is unavailable, all pages fall back to rich mock data automatically.

---

## Environment Variables

| Variable            | Default                     |
|---------------------|-----------------------------|
| VITE_API_BASE_URL   | http://localhost:5001/api   |

---

## Folder Structure

```
src/
  dto/            ClinicDTO, DoctorDTO, ServiceDTO, AppointmentDTO
  services/       api.service.js (Axios + all endpoints)
  utils/          mockData, useApi hook, constants, helpers
  components/     Navbar, Footer, Hero, ServiceCard, DoctorCard,
                  LocationCard, AppointmentForm, SectionTitle,
                  CTAButton, LoadingSpinner
  layouts/        MainLayout (Navbar + Footer + scroll-to-top)
  routes/         AppRouter.jsx
  pages/          All 7 pages
```

---

## Clinics Covered

Telangana: Kondapur, Manikonda
Andhra Pradesh: Tirupati, Ongole, Guntur, Vijayawada, Nellore, Visakhapatnam

---

H&H Dental Services © 2025
