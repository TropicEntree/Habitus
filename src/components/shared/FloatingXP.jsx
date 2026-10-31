import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";

/**
 * Shows a floating "+XP" chip that rises and fades when xpKey changes.
 * xpKey: any value — when it changes, a new burst plays.
 */
export default function FloatingXP({ xp, xpKey, className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}>
      <AnimatePresence>
        {xpKey > 0 && (
          <motion.div
            key={xpKey}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -40, scale: 1.2 }}
            exit={{ opacity: 0, y: -60, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex items-center gap-1 bg-purple-500 text-white font-black text-sm px-2.5 py-1 rounded-full shadow-lg shadow-purple-500/50"
          >
            <Zap size={12} strokeWidth={3} />
            +{xp}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}