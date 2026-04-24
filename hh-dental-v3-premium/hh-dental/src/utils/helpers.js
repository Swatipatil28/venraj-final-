/**
 * Truncates a string to maxLength and adds ellipsis.
 */
export const truncate = (str, maxLength = 100) => {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength).trimEnd() + "…" : str;
};

/**
 * Capitalises the first letter of a string.
 */
export const capitalise = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Returns initials from a full name (up to 2 chars).
 * e.g. "Dr. Haritha Reddy" → "HR"
 */
export const getInitials = (name = "") => {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

/**
 * Groups an array of objects by a key.
 * e.g. groupBy(clinics, "state")
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const group = item[key] || "Other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
};

/**
 * Formats a date string to a readable format.
 * e.g. "2025-06-15" → "15 Jun 2025"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Builds a WhatsApp deep-link URL with a pre-filled message.
 */
export const buildWhatsAppUrl = (phone, message = "") => {
  const cleaned = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
};

/**
 * Scrolls the page to an element by ID.
 */
export const scrollToId = (id, offset = 80) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
};
