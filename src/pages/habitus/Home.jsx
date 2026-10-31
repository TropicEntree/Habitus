import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { subscribeTabReset } from "@/lib/tabEvents";
import { loadHabitsAndLogs, completeHabit, todayProgress, globalStreak, habitCap, todayStr } from "@/lib/habitus";
import { useAppSettings } from "@/lib/AppSettings";
import { localeFor, getMotivation } from "@/lib/i18n";
import moment from "moment";
import ProgressRing from "@/components/habitus/ProgressRing";
import HabitList from "@/components/habitus/HabitList";
import AddHabitDialog from "@/components/habitus/AddHabitDialog";
import PullToRefresh from "@/components/shared/PullToRefresh";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const UNDO_WINDOW_MS = 4000;

export default function Home() {
  const { t, lang } = useAppSettings();
  const { toast } = useToast();
  const undoTimers = useRef({});
  const [me, setMe] = useState(null);
  const [profile, setProfile] = useState(null);
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const load = async () => {
    const [m, profiles] = await Promise.all([base44.auth.me(), base44.entities.UserProfile.list()]);
    setMe(m);
    setProfile(profiles[0] || null);
    const { habits, logs } = await loadHabitsAndLogs();
    setHabits([...habits].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
    setLogs(logs);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);
  useEffect(() => subscribeTabReset("/", load), []);

  const handleCheck = async (habit) => {
    const optimisticLog = { habit_id: habit.id, completed_date: todayStr() };
    setLogs((l) => [...l, optimisticLog]);
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.7 },
        colors: ["#FFB4C6", "#A8D8E8", "#C8B6E2", "#B8E8C8"],
      });
    } catch {
      /* confetti is optional */
    }

    // Delay the actual write so an impulsive tap can be undone: nothing is
    // persisted (and no streak/XP math needs reversing) unless the window elapses.
    const logsAtTap = logs;
    const timer = setTimeout(async () => {
      delete undoTimers.current[habit.id];
      await completeHabit(habit, logsAtTap, profile);
      load();
    }, UNDO_WINDOW_MS);
    undoTimers.current[habit.id] = timer;

    toast({
      title: t("completed_label", { name: habit.title }),
      description: t("undo_hint"),
      duration: UNDO_WINDOW_MS + 500,
      action: (
        <ToastAction
          altText={t("undo")}
          onClick={() => {
            clearTimeout(undoTimers.current[habit.id]);
            delete undoTimers.current[habit.id];
            setLogs((l) => l.filter((entry) => entry !== optimisticLog));
          }}
        >
          {t("undo")}
        </ToastAction>
      ),
    });
  };

  const handleReorder = async (reordered) => {
    setHabits(reordered);
    await base44.entities.Habit.bulkUpdate(reordered.map((h, i) => ({ id: h.id, sort_order: i })));
  };

  const { done, total } = todayProgress(habits, logs);
  const streak = globalStreak(habits);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-sakura/40 border-t-sakura rounded-full animate-spin" />
      </div>
    );
  }

  const hour = new Date().getHours();
  const greetKey = hour < 12 ? "greet_morning" : hour < 18 ? "greet_afternoon" : "greet_evening";
  const name = me?.full_name?.split(" ")[0] || "🌸";
  const dateStr = new Date().toLocaleDateString(localeFor(lang), { weekday: "long", day: "numeric", month: "long" });

  return (
    <PullToRefresh onRefresh={load}>
    <div className="px-5 pt-14 pb-28 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-1">
        <h1 className="text-2xl font-extrabold text-foreground">{t(greetKey, { name })}</h1>
        <p className="text-sm text-muted-foreground capitalize">{dateStr}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center my-6">
        <ProgressRing done={done} total={total} />
        <p className="text-sm text-center text-muted-foreground mt-4 max-w-xs">{getMotivation(lang, moment().dayOfYear())}</p>
        <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-sunset/15">
          <Flame className="text-sunset" size={18} />
          <span className="font-extrabold text-sunset">{streak}</span>
          <span className="text-xs text-sunset/80">{t("streak_global")}</span>
        </div>
      </motion.div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-extrabold text-foreground">{t("section_today")}</h2>
        <button
          onClick={() => setAddOpen(true)}
          aria-label={t("add_habit")}
          className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-2.5">
        {habits.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-sm">{t("empty_title")}</p>
            <p className="text-xs mt-1">{t("empty_hint")}</p>
          </div>
        ) : (
          <HabitList habits={habits} logs={logs} onCheck={handleCheck} onReorder={handleReorder} />
        )}
      </div>

      <AddHabitDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={load}
        cap={habitCap(profile)}
        count={habits.length}
      />
    </div>
    </PullToRefresh>
  );
}