import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AppSettingsProvider, useAppSettings } from "@/lib/AppSettings";

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function AdminShell() {
  const { t } = useAppSettings();
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-background safe-area-pt safe-area-pb">
      <div className="max-w-lg mx-auto pb-10">
        <div className="flex items-center gap-1 px-5 pt-14 pb-2">
          <button
            onClick={() => navigate(-1)}
            aria-label={t("admin_back")}
            className="p-2 -ml-2 rounded-full hover:bg-muted text-foreground"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="text-sm font-bold text-muted-foreground">{t("admin_back")}</span>
        </div>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AppSettingsProvider>
      <AdminShell />
    </AppSettingsProvider>
  );
}
