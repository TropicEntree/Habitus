import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useAppSettings } from "@/lib/AppSettings";

const CONFIRM_WORD = "DELETE";

export default function DeleteUserDialog({ user, open, onClose, onConfirm }) {
  const { t } = useAppSettings();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => {
    setConfirmText("");
    onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    close();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-foreground/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-card border border-destructive/30 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-destructive" />
                </div>
                <h3 className="font-bold text-foreground text-base">{t("admin_delete_user_confirm_title")}</h3>
              </div>
              <button onClick={close} className="text-muted-foreground hover:text-foreground p-1">
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-2">{user?.full_name || user?.email}</p>
            <p className="text-sm text-muted-foreground mb-4">
              {t("admin_delete_user_confirm_body", { word: CONFIRM_WORD })}
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_WORD}
              className="w-full bg-background text-foreground text-sm rounded-xl px-3 py-3 border border-input outline-none focus:border-destructive/50 text-center font-mono uppercase tracking-widest mb-4"
            />

            <div className="flex gap-2">
              <button onClick={close} className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium">
                {t("admin_cancel")}
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirmText !== CONFIRM_WORD || loading}
                className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? t("admin_saving") : t("admin_delete_user")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
