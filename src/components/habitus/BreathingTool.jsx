import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppSettings } from "@/lib/AppSettings";

const PHASES = [
  { key: "inhale", dur: 4, scale: 1.4 },
  { key: "hold", dur: 4, scale: 1.4 },
  { key: "exhale", dur: 6, scale: 1 },
];

export default function BreathingTool({ open, onClose }) {
  const { t } = useAppSettings();
  const [phase, setPhase] = useState(0);
  const cur = PHASES[phase];

  useEffect(() => {
    if (!open) return;
    const tmo = setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), cur.dur * 1000);
    return () => clearTimeout(tmo);
  }, [phase, open, cur.dur]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-lilac/30 backdrop-blur-md p-6 safe-area-pt safe-area-pb"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button onClick={onClose} aria-label={t("breath_title")} className="absolute top-6 right-6 p-2 rounded-full bg-card/80">
            <X />
          </button>
          <p className="text-sm text-foreground/70 mb-8">{t("breath_title")}</p>
          <motion.div
            animate={{ scale: cur.scale }}
            transition={{ duration: cur.dur, ease: "easeInOut" }}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-sakura to-lilac flex items-center justify-center shadow-2xl"
          >
            <span className="text-white font-extrabold text-lg">{t(cur.key)}</span>
          </motion.div>
          <p className="text-xs text-foreground/60 mt-8">{t("breath_hint")}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}