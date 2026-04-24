import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../context/ToastContext";

const toneMap = {
  success: "border-emerald-400/30 bg-emerald-500/15 text-emerald-100",
  warning: "border-amber-300/30 bg-amber-400/15 text-amber-100",
  info: "border-[var(--line)] bg-[rgba(255,255,255,0.08)] text-[var(--text)]"
};

export default function ToastStack() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex w-[min(92vw,24rem)] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className={`glass-panel rounded-2xl border px-4 py-3 text-sm ${toneMap[toast.type] || toneMap.info}`}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="leading-6">{toast.message}</p>
              <button type="button" onClick={() => removeToast(toast.id)} className="text-xs opacity-80 hover:opacity-100">
                Close
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
