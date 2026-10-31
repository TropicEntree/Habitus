import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video, Phone } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAppSettings } from "@/lib/AppSettings";

export default function BookingDialog({ expert, open, onClose, onBooked }) {
  const { t } = useAppSettings();
  const [mode, setMode] = useState("video");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  if (!expert) return null;

  const submit = async () => {
    if (!date) return;
    setSaving(true);
    const iso = new Date(`${date}T${time}:00`).toISOString();
    await base44.entities.Booking.create({
      expert_id: expert.id,
      expert_name: expert.name,
      session_date: iso,
      mode,
      price: expert.price,
      status: "pending",
    });
    setSaving(false);
    setDone(true);
    setTimeout(() => {
      onBooked?.();
      onClose();
      setDone(false);
      setDate("");
    }, 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="w-full max-w-md bg-card rounded-3xl p-5 safe-area-pt safe-area-pb shadow-2xl border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg text-foreground">{t("book_with", { name: expert.name })}</h3>
              <button onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-muted">
                <X size={18} />
              </button>
            </div>

            {done ? (
              <p className="text-center py-10 text-foreground">
                {t("sent")}
                <br />
                <span className="text-sm text-muted-foreground">{t("sent_note")}</span>
              </p>
            ) : (
              <>
                <p className="text-xs font-bold text-muted-foreground mb-2">{t("mode")}</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => setMode("video")}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-sm font-bold ${
                      mode === "video" ? "border-sakura bg-sakura/15 text-foreground" : "border-border text-muted-foreground"
                    }`}
                  >
                    <Video size={16} /> {t("video")}
                  </button>
                  <button
                    onClick={() => setMode("audio")}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-sm font-bold ${
                      mode === "audio" ? "border-sakura bg-sakura/15 text-foreground" : "border-border text-muted-foreground"
                    }`}
                  >
                    <Phone size={16} /> {t("audio")}
                  </button>
                </div>

                <p className="text-xs font-bold text-muted-foreground mb-2">{t("when")}</p>
                <div className="flex gap-2 mb-4">
                  <input
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-input bg-background text-foreground"
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-input bg-background text-foreground"
                  />
                </div>

                <p className="text-sm text-muted-foreground mb-4">{t("price_note", { price: expert.price })}</p>

                <button
                  onClick={submit}
                  disabled={saving || !date}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold disabled:opacity-50"
                >
                  {saving ? t("sending") : t("confirm")}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}