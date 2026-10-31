import { useState, useEffect } from "react";
import { Plus, Star, Pencil, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAppSettings } from "@/lib/AppSettings";
import CoachDialog from "@/components/admin/CoachDialog";

export default function AdminCoaches() {
  const { t } = useAppSettings();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const data = await base44.entities.Expert.list("-rating", 200);
    setCoaches(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (coach) => {
    setEditing(coach);
    setDialogOpen(true);
  };

  const remove = async (coach) => {
    if (!window.confirm(t("admin_delete_coach_confirm"))) return;
    await base44.entities.Expert.delete(coach.id);
    load();
  };

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-extrabold text-foreground">{t("admin_coaches")}</h1>
        <button
          onClick={openCreate}
          aria-label={t("admin_add_coach")}
          className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
        >
          <Plus size={18} />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-5">{t("admin_coaches_desc")}</p>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-4 border-sakura/40 border-t-sakura rounded-full animate-spin" />
        </div>
      ) : coaches.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-10">{t("admin_no_coaches")}</p>
      ) : (
        <div className="space-y-3">
          {coaches.map((c) => (
            <div key={c.id} className="flex gap-3 p-4 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sakura to-lilac flex items-center justify-center text-lg font-extrabold text-white shrink-0 overflow-hidden">
                {c.photo_url ? (
                  <img src={c.photo_url} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  c.name?.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{t(`sp_${c.specialty}`)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-sunset">
                    <Star size={11} className="text-sunset" />
                    {c.rating?.toFixed?.(1) || "5.0"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{t(`lang_${c.language}`)}</span>
                  {!c.available && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {t("admin_field_available")}: OFF
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                <span className="font-extrabold text-foreground text-sm">€{c.price}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    aria-label={t("admin_edit_coach")}
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(c)}
                    aria-label={t("admin_delete")}
                    className="p-2 rounded-xl hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CoachDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSaved={load} coach={editing} />
    </div>
  );
}
