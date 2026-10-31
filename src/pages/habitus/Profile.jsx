import { useState, useEffect } from "react";
import { Globe, Moon, Bell, LogOut, Flame, Calendar, Award, TrendingUp, Palette, SunMoon, ShieldCheck, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { subscribeTabReset } from "@/lib/tabEvents";
import { getReminderConfig, setReminderConfig } from "@/lib/notifications";
import { useAppSettings } from "@/lib/AppSettings";
import { localeFor } from "@/lib/i18n";
import { PALETTES } from "@/lib/palettes";
import { useThemeMode } from "@/lib/useThemeMode";
import moment from "moment";
import MonthCalendar from "@/components/habitus/MonthCalendar";
import ProfileAvatar from "@/components/habitus/ProfileAvatar";
import AccountDeletion from "@/components/profile/AccountDeletion";
import EditableName from "@/components/profile/EditableName";
import SheetPicker from "@/components/habitus/SheetPicker";

function SettingRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-muted-foreground" />
        <span className="text-sm font-bold text-foreground">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-11 h-6 rounded-full p-0.5 transition-colors ${on ? "bg-mint" : "bg-muted"}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function badgesFor(days, streak, habitsCount, t) {
  return [
    { label: t("badge_first"), emoji: "🌸", earned: days >= 1 },
    { label: t("badge_week"), emoji: "🌱", earned: days >= 7 },
    { label: t("badge_s7"), emoji: "🔥", earned: streak >= 7 },
    { label: t("badge_s30"), emoji: "💎", earned: streak >= 30 },
    { label: t("badge_10"), emoji: "🌿", earned: habitsCount >= 10 },
  ];
}

export default function Profile() {
  const { t, lang, setLang, evening, toggleEvening, palette, setPalette } = useAppSettings();
  const { mode: themeMode, setMode: setThemeMode } = useThemeMode();
  const [me, setMe] = useState(null);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [m, allLogs, h] = await Promise.all([
      base44.auth.me(),
      base44.entities.HabitLog.filter(
        {
          completed_date: {
            $gte: moment().subtract(60, "days").format("YYYY-MM-DD"),
            $lte: moment().format("YYYY-MM-DD"),
          },
        },
        "-completed_date",
        500
      ),
      base44.entities.Habit.filter({ is_active: true }),
    ]);
    setMe(m);
    setProfile((await base44.entities.UserProfile.list())[0] || null);
    setLogs(allLogs);
    setHabits(h);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => subscribeTabReset("/profile", load), []);

  const ensureProfile = async (updates) => {
    let p = profile;
    if (p) {
      p = await base44.entities.UserProfile.update(p.id, updates);
    } else {
      p = await base44.entities.UserProfile.create(updates);
    }
    setProfile(p);
    return p;
  };

  const daysActive = new Set(logs.map((l) => l.completed_date)).size;
  const last7 = logs.filter((l) => moment(l.completed_date).isAfter(moment().subtract(7, "days"))).length;
  const avgPct = habits.length > 0 ? Math.round((last7 / (habits.length * 7)) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-sakura/40 border-t-sakura rounded-full animate-spin" />
      </div>
    );
  }

  const isPremium = profile?.plan === "premium";

  return (
    <div className="px-5 pt-14 pb-28 min-h-screen">
      <div className="flex flex-col items-center mb-6">
        <ProfileAvatar photoUrl={profile?.photo_url} name={me?.full_name} onUpdated={ensureProfile} />
        <EditableName name={me?.full_name} onSaved={(n) => setMe((m) => ({ ...m, full_name: n }))} />
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full mt-1 ${
            isPremium ? "bg-sunset/20 text-sunset" : "bg-muted text-muted-foreground"
          }`}
        >
          {isPremium ? t("plan_premium") : t("plan_free")}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Calendar, label: t("stat_days"), val: daysActive },
          { icon: Flame, label: t("stat_streak"), val: profile?.longest_streak || 0 },
          { icon: TrendingUp, label: t("stat_7"), val: `${avgPct}%` },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-2xl bg-card border border-border text-center">
            <s.icon size={16} className="mx-auto text-sunset mb-1" />
            <p className="text-xl font-extrabold text-foreground">{s.val}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border mb-6">
        <p className="font-bold text-sm text-foreground mb-3 capitalize">
          {new Date().toLocaleDateString(localeFor(lang), { month: "long", year: "numeric" })}
        </p>
        <MonthCalendar logs={logs} />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-sunset" />
          <h2 className="font-bold text-sm text-foreground">{t("achievements")}</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {badgesFor(daysActive, profile?.longest_streak || 0, habits.length, t).map((b) => (
            <span
              key={b.label}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                b.earned ? "bg-mint/20 text-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {b.emoji} {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="font-bold text-sm text-foreground mb-1">{t("settings")}</h2>
        <SettingRow icon={Globe} label={t("language")}>
          <SheetPicker
            value={lang}
            onChange={setLang}
            label={t("language")}
            options={[
              { value: "it", label: "Italiano" },
              { value: "en", label: "English" },
              { value: "ko", label: "한국어" },
            ]}
            triggerClassName="px-3 py-1.5 rounded-xl text-xs border border-input bg-card text-foreground font-bold"
          />
        </SettingRow>
        <SettingRow icon={SunMoon} label={t("theme_mode")}>
          <SheetPicker
            value={themeMode}
            onChange={setThemeMode}
            label={t("theme_mode")}
            options={[
              { value: "light", label: t("theme_mode_light") },
              { value: "dark", label: t("theme_mode_dark") },
              { value: "auto", label: t("theme_mode_auto") },
            ]}
            triggerClassName="px-3 py-1.5 rounded-xl text-xs border border-input bg-card text-foreground font-bold"
          />
        </SettingRow>
        <SettingRow icon={Moon} label={t("evening_mode")}>
          <Toggle on={evening} onChange={(v) => toggleEvening(v)} />
        </SettingRow>
        <SettingRow icon={Bell} label={t("gentle_notif")}>
          <Toggle
            on={!!getReminderConfig().enabled}
            onChange={(v) => setReminderConfig({ ...getReminderConfig(), enabled: v })}
          />
        </SettingRow>
        <SettingRow icon={Palette} label={t("theme")}>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPalette(p.id)}
                aria-label={p.name}
                className={`w-10 h-10 rounded-full border ${palette === p.id ? "ring-2 ring-offset-1 ring-foreground/40" : "border-border"}`}
                style={{ backgroundColor: p.accent }}
              />
            ))}
          </div>
        </SettingRow>
      </div>

      {me?.role === "admin" && (
        <Link
          to="/admin"
          className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border mb-4"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-mint" />
            <span className="font-bold text-sm text-foreground">{t("admin_panel")}</span>
          </span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
      )}

      {!isPremium && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sakura/30 to-lilac/30 border border-lilac/40 mb-4">
          <p className="font-bold text-sm text-foreground mb-1">{t("premium_card_title")}</p>
          <p className="text-xs text-muted-foreground mb-3">{t("premium_card_body")}</p>
          <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
            {t("premium_card_cta")}
          </button>
        </div>
      )}

      <button
        onClick={() => base44.auth.logout("/login")}
        className="w-full py-3 rounded-2xl border border-border text-muted-foreground font-bold text-sm flex items-center justify-center gap-2"
      >
        <LogOut size={16} /> {t("logout")}
      </button>

      <div className="mt-3">
        <AccountDeletion />
      </div>
    </div>
  );
}