import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import ToastStack from "../components/ToastStack";
import OfflineBanner from "../components/OfflineBanner";

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="page-shell">
      <Navbar />
      <OfflineBanner />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ToastStack />
    </div>
  );
}
