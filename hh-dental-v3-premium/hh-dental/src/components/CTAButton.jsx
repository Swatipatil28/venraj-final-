import { useNavigate } from "react-router-dom";
export default function CTAButton({ children="Book Consultation", to, onClick, variant="primary", size="md", className="", type="button", disabled=false, loading=false }) {
  const navigate = useNavigate();
  const handleClick = () => { if (onClick) return onClick(); if (to) navigate(to); };
  const base = variant === "primary" ? "btn-gold" : "btn-ghost";
  const sizes = { sm:"text-[10px] px-5 py-2.5", md:"text-xs px-7 py-3.5", lg:"text-xs px-10 py-5" };
  return (
    <button type={type} onClick={handleClick} disabled={disabled||loading}
      className={`${base} ${sizes[size]} ${disabled||loading?"opacity-50 cursor-not-allowed":""} ${className}`}>
      {loading ? "Sending…" : children}
    </button>
  );
}
