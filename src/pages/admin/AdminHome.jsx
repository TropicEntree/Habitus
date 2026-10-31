import { useState } from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, Users, BookOpen, ChevronRight, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAppSettings } from "@/lib/AppSettings";
import { buildLibraryRecords } from "@/data/studyTips.seed";

export default function AdminHome() {
  const { t } = useAppSettings();
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const runImport = async () => {
    setResult(null);
    const existing = await base44.entities.LibraryContent.filter({ category: "studio" }, null, 500);
    const count = existing?.length || 0;

    if (count > 0 && !window.confirm(t("admin_import_already_exists", { n: count }))) {
      return;
    }

    setImporting(true);
    try {
      const records = buildLibraryRecords();
      await base44.entities.LibraryContent.bulkCreate(records);
      setResult({ ok: true, n: records.length });
    } catch (e) {
      setResult({ ok: false });
    }
    setImporting(false);
  };

  return (
    <div className="px-5">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">{t("admin_home_title")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("admin_home_subtitle")}</p>

      <div className="space-y-3 mb-6">
        <Link
          to="/admin/coaches"
          className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border"
        >
          <div className="w-11 h-11 rounded-2xl bg-sky/20 flex items-center justify-center shrink-0">
            <HeartHandshake size={20} className="text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground">{t("admin_coaches")}</p>
            <p className="text-xs text-muted-foreground">{t("admin_coaches_desc")}</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>

        <Link
          to="/admin/users"
          className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border"
        >
          <div className="w-11 h-11 rounded-2xl bg-lilac/20 flex items-center justify-center shrink-0">
            <Users size={20} className="text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground">{t("admin_users")}</p>
            <p className="text-xs text-muted-foreground">{t("admin_users_desc")}</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={18} className="text-mint" />
          <p className="font-bold text-sm text-foreground">{t("admin_import_content_title")}</p>
        </div>
        <p className="text-xs text-muted-foreground mb-4">{t("admin_import_content_desc")}</p>

        {result?.ok && (
          <p className="text-xs text-mint font-bold mb-3">{t("admin_import_success", { n: result.n })}</p>
        )}
        {result?.ok === false && (
          <p className="text-xs text-destructive font-bold mb-3">{t("admin_import_error")}</p>
        )}

        <button
          onClick={runImport}
          disabled={importing}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50"
        >
          <Sparkles size={16} />
          {importing ? t("admin_importing") : t("admin_import_button")}
        </button>
      </div>
    </div>
  );
}
