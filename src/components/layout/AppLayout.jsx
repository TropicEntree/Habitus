import { useRef, useEffect, lazy, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, HeartHandshake, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { emitTabReset } from "@/lib/tabEvents";
import {
  notificationsSupported,
  showNotification,
  getReminderConfig,
  setReminderConfig,
  buildSmartReminder,
} from "@/lib/notifications";
import { AppSettingsProvider, useAppSettings } from "@/lib/AppSettings";
import { paletteStyle } from "@/lib/palettes";
import { useThemeMode } from "@/lib/useThemeMode";

const HabitusHome = lazy(() => import("@/pages/habitus/Home"));
const Library = lazy(() => import("@/pages/habitus/Library"));
const Experts = lazy(() => import("@/pages/habitus/Experts"));
const Assistant = lazy(() => import("@/pages/habitus/Assistant"));
const HabitusProfile = lazy(() => import("@/pages/habitus/Profile"));

const tabs = [
  { path: "/", labelKey: "nav_home", icon: Home, Component: HabitusHome, match: (p) => p === "/" },
  { path: "/library", labelKey: "nav_library", icon: BookOpen, Component: Library, match: (p) => p === "/library" },
  { path: "/experts", labelKey: "nav_experts", icon: HeartHandshake, Component: Experts, match: (p) => p === "/experts" },
  { path: "/assistant", labelKey: "nav_ai", icon: Sparkles, Component: Assistant, match: (p) => p === "/assistant" },
  { path: "/profile", labelKey: "nav_profile", icon: User, Component: HabitusProfile, match: (p) => p === "/profile" },
];

function Spinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const { t, palette, evening } = useAppSettings();
  const { isDark } = useThemeMode();
  const scrollRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      const cfg = getReminderConfig();
      if (!cfg.enabled) return;
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const [h, m] = (cfg.time || "09:00").split(":").map(Number);
      const reached = now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m);
      if (reached && cfg.lastFired !== today) {
        (async () => {
          if (notificationsSupported() && Notification.permission === "granted") {
            const msg = await buildSmartReminder();
            if (msg) showNotification(msg.title, msg.body);
          }
          setReminderConfig({ ...cfg, lastFired: today });
        })();
      }
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const active = tabs.find((tab) => tab.match(location.pathname)) || tabs[0];
  const ActiveComponent = active.Component;

  const handleNavClick = (e, tab) => {
    if (tab.match(location.pathname)) {
      e.preventDefault();
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      emitTabReset(tab.path);
    }
  };

  return (
    <div className="h-dvh bg-background safe-area-pt overflow-hidden transition-colors" style={paletteStyle(palette, isDark)}>
      <div className="max-w-lg mx-auto relative h-full">
        <Suspense fallback={<Spinner />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.path}
              ref={scrollRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 overflow-y-auto scroll-container no-scrollbar"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>

      {evening && (
        <div
          className="fixed inset-0 z-40 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(40,30,50,0.12), rgba(55,38,30,0.26))" }}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
        <div className="max-w-lg mx-auto px-3 pb-3">
          <div className="rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-lg flex items-center justify-around py-1.5 px-1">
            {tabs.map((tab) => {
              const isActive = tab.match(location.pathname);
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  onClick={(e) => handleNavClick(e, tab)}
                  aria-label={t(tab.labelKey)}
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-11 min-h-11 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-xs font-bold">{t(tab.labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default function AppLayout() {
  return (
    <AppSettingsProvider>
      <AppShell />
    </AppSettingsProvider>
  );
}