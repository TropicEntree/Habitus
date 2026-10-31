import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAppSettings } from "@/lib/AppSettings";
import SheetPicker from "@/components/habitus/SheetPicker";
import Toggle from "@/components/admin/Toggle";

const SPEC_KEYS = ["adhd_coach", "psychologist", "psychiatrist", "therapist", "neurologist"];
const LANG_KEYS = ["it", "en", "ko"];

const emptyForm = {
  name: "",
  title: "",
  specialty: "adhd_coach",
  bio: "",
  photo_url: "",
  price: 40,
  rating: 5,
  language: "it",
  online_available: true,
  available: true,
};

export default function CoachDialog({ open, onClose, onSaved, coach }) {
  const { t } = useAppSettings();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const isEdit = !!coach;

  useEffect(() => {
    if (open) setForm(coach ? { ...emptyForm, ...coach } : emptyForm);
  }, [open, coach]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      name: form.name.trim(),
      title: form.title.trim(),
      bio: form.bio.trim(),
      photo_url: form.photo_url.trim(),
      price: Number(form.price) || 0,
      rating: Number(form.rating) || 0,
    };
    if (isEdit) {
      await base44.entities.Expert.update(coach.id, payload);
    } else {
      await base44.entities.Expert.create(payload);
    }
    setSaving(false);
    onSaved();
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
              <h3 className="font-extrabold text-lg text-foreground">
                {isEdit ? t("admin_edit_coach") : t("admin_add_coach")}
              </h3>
              <button onClick={onClose} aria-label={t("admin_cancel")} className="p-2 rounded-full hover:bg-muted">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1.5">{t("admin_field_name")}</p>
                <input
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-foreground"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1.5">{t("admin_field_title")}</p>
                <input
                  value={form.title}
                  onChange={(e) => set("title")(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-foreground"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1.5">{t("admin_field_specialty")}</p>
                <SheetPicker
                  value={form.specialty}
                  onChange={set("specialty")}
                  label={t("admin_field_specialty")}
                  options={SPEC_KEYS.map((k) => ({ value: k, label: t(`sp_${k}`) }))}
                  triggerClassName="w-full px-4 py-3 rounded-2xl text-left border border-input bg-background text-foreground"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1.5">{t("admin_field_bio")}</p>
                <textarea
                  value={form.bio}
                  onChange={(e) => set("bio")(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-foreground resize-none"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1.5">{t("admin_field_photo")}</p>
                <input
                  value={form.photo_url}
                  onChange={(e) => set("photo_url")(e.target.value)}
                  placeholder="https://…"
                  className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1.5">{t("admin_field_price")}</p>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => set("price")(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-foreground"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1.5">{t("admin_field_rating")}</p>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => set("rating")(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1.5">{t("language")}</p>
                <SheetPicker
                  value={form.language}
                  onChange={set("language")}
                  label={t("language")}
                  options={LANG_KEYS.map((k) => ({ value: k, label: t(`lang_${k}`) }))}
                  triggerClassName="w-full px-4 py-3 rounded-2xl text-left border border-input bg-background text-foreground"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border">
                <span className="text-sm font-bold text-foreground">{t("admin_field_online")}</span>
                <Toggle on={form.online_available} onChange={set("online_available")} />
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background border border-border">
                <span className="text-sm font-bold text-foreground">{t("admin_field_available")}</span>
                <Toggle on={form.available} onChange={set("available")} />
              </div>
            </div>

            <button
              onClick={submit}
              disabled={saving || !form.name.trim()}
              className="w-full mt-5 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold disabled:opacity-50"
            >
              {saving ? t("admin_saving") : t("admin_save")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
