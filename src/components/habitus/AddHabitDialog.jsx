import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { HABIT_EMOJIS, HABIT_COLORS, TIME_SLOTS } from "@/lib/habitus";
import { useAppSettings } from "@/lib/AppSettings";

const colorBg = { sakura: "bg-sakura", sky: "bg-sky", lilac: "bg-lilac", mint: "bg-mint" };

export default function AddHabitDialog({ open, onClose, onCreated, cap, count }) {
  const { t } = useAppSettings();
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🌿");
  const [color, setColor] = useState("mint");
  const [slot, setSlot] = useState("all_day");
  const [saving, setSaving] = useState(false);
  const atCap = count >= cap;

  const submit = async () => {
    if (!title.trim() || atCap) return;
    setSaving(true);
    const created = await base44.entities.Habit.create({
      title: title.trim(),
      icon: emoji,
      color,
      time_slot: slot,
      category: "routine",
      is_active: true,
    });
    setSaving(false);
    setTitle("");
    setEmoji("🌿");
    setColor("mint");
    setSlot("all_day");
    onCreated(created);
    onClose();
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
            className="w-full max-w-md bg-card rounded-3xl p-5 safe-area-pt safe-area-pb shadow-2xl border border-border max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg text-foreground">{t("new_habit")}</h3>
              <button onClick={onClose} aria-label={t("new_habit")} className="p-2 rounded-full hover:bg-muted">
                <X size={18} />
              </button>
            </div>

            {atCap && (
              <p className="text-sm text-sunset bg-sunset/10 rounded-xl p-3 mb-3">{t("cap_warning", { cap })}</p>
            )}

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("title_placeholder")}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background mb-4 text-foreground placeholder:text-muted-foreground/60"
            />

            <p className="text-xs font-bold text-muted-foreground mb-2">{t("emoji")}</p>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {HABIT_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-xl p-2 rounded-xl border ${emoji === e ? "border-sakura bg-sakura/20" : "border-border"}`}
                >
                  {e}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-muted-foreground mb-2">{t("color")}</p>
            <div className="flex gap-2 mb-4">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={c}
                  className={`w-10 h-10 rounded-full ${colorBg[c]} ${color === c ? "ring-2 ring-offset-2 ring-foreground/30" : ""}`}
                />
              ))}
            </div>

            <p className="text-xs font-bold text-muted-foreground mb-2">{t("time_slot")}</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {Object.entries(TIME_SLOTS).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setSlot(k)}
                  className={`p-3 rounded-2xl border text-left ${slot === k ? "border-sakura bg-sakura/15" : "border-border"}`}
                >
                  <span className="text-lg">{v.emoji}</span>
                  <p className="text-xs font-bold text-foreground mt-1">{t(`slot_${k}`)}</p>
                </button>
              ))}
            </div>

            <button
              onClick={submit}
              disabled={saving || !title.trim() || atCap}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold disabled:opacity-50"
            >
              {saving ? t("adding") : t("add_btn")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}