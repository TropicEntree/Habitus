import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { HABIT_EMOJIS, HABIT_COLORS, TIME_SLOTS } from "@/lib/habitus";
import { useAppSettings } from "@/lib/AppSettings";
import { suggestHabits } from "@/lib/habitSuggest";

const colorBg = { sakura: "bg-sakura", sky: "bg-sky", lilac: "bg-lilac", mint: "bg-mint" };

export default function AddHabitDialog({ open, onClose, onCreated, cap, count }) {
  const { t, lang } = useAppSettings();
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🌿");
  const [color, setColor] = useState("mint");
  const [slot, setSlot] = useState("all_day");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [goal, setGoal] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestError, setSuggestError] = useState("");
  const atCap = count >= cap;

  const submit = async () => {
    if (!title.trim() || atCap) return;
    setSaving(true);
    setSaveError(false);
    let created;
    try {
      created = await base44.entities.Habit.create({
      title: title.trim(),
      icon: emoji,
      color,
      time_slot: slot,
      category: "routine",
      is_active: true,
    });
    } catch {
      setSaveError(true);
      setSaving(false);
      return;
    }
    setSaving(false);
    setSuggestions([]);
    setGoal("");
    setTitle("");
    setEmoji("🌿");
    setColor("mint");
    setSlot("all_day");
    onCreated(created);
    onClose();
  };

  const askAi = async () => {
    if (!goal.trim() || suggesting) return;
    setSuggesting(true);
    setSuggestError("");
    setSuggestions([]);
    try {
      const found = await suggestHabits(goal.trim(), lang);
      setSuggestions(found);
      if (found.length === 0) setSuggestError(t("ai_suggest_error"));
    } catch (e) {
      setSuggestError(t(e?.context?.status === 429 ? "ai_suggest_limit" : "ai_suggest_error"));
    }
    setSuggesting(false);
  };

  const applySuggestion = (s) => {
    setTitle(s.title);
    if (HABIT_EMOJIS.includes(s.emoji)) setEmoji(s.emoji);
    if (HABIT_COLORS.includes(s.color)) setColor(s.color);
    if (TIME_SLOTS[s.time_slot]) setSlot(s.time_slot);
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

            <div className="p-3 rounded-2xl bg-muted mb-4">
              <p className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-2">
                <Sparkles size={14} /> {t("ai_suggest_title")}
              </p>
              <div className="flex gap-2">
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askAi()}
                  maxLength={200}
                  aria-label={t("ai_suggest_title")}
                  placeholder={t("ai_suggest_placeholder")}
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60"
                />
                <button
                  onClick={askAi}
                  disabled={suggesting || !goal.trim()}
                  className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold disabled:opacity-50"
                >
                  {suggesting ? t("ai_suggest_busy") : t("ai_suggest_btn")}
                </button>
              </div>
              {suggestError && <p className="text-xs text-destructive mt-2">{suggestError}</p>}
              {suggestions.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => applySuggestion(s)}
                      className={`w-full text-left p-2.5 rounded-xl border bg-card text-sm font-bold text-foreground ${title === s.title ? "border-primary" : "border-border"}`}
                    >
                      {s.emoji} {s.title}
                    </button>
                  ))}
                  <p className="text-[11px] text-muted-foreground">{t("ai_suggest_hint")}</p>
                </div>
              )}
            </div>

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

            {saveError && <p className="text-xs text-destructive mb-2">{t("habit_save_error")}</p>}
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