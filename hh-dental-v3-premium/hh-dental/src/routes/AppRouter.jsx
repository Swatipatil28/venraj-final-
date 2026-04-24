import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ServicesPage from "../pages/ServicesPage";
import ServiceDetailPage from "../pages/ServiceDetailPage";
import DoctorsPage from "../pages/DoctorsPage";
import LocationsPage from "../pages/LocationsPage";
import BookAppointmentPage from "../pages/BookAppointmentPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/book-appointment" element={<BookAppointmentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
