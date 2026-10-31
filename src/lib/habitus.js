import { base44 } from "@/api/base44Client";
import moment from "moment";

export const TIME_SLOTS = {
  morning: { label: "Mattina", emoji: "🌅", color: "sky" },
  afternoon: { label: "Pomeriggio", emoji: "☀️", color: "sakura" },
  evening: { label: "Sera", emoji: "🌙", color: "lilac" },
  all_day: { label: "Tutto il giorno", emoji: "🌿", color: "mint" },
};

export const HABIT_COLORS = ["sakura", "sky", "lilac", "mint"];

export const HABIT_EMOJIS = ["🌿", "💧", "📖", "🏃", "🧘", "💤", "🥗", "☀️", "🧹", "💌", "🎯", "🌸"];

export const MOTIVATION = [
  "Un passo alla volta, va benissimo così 🌱",
  "Oggi è un nuovo inizio, niente senso di colpa 🌸",
  "Piccoli progressi contano, davvero ✨",
  "Sii gentile con te stesso, ci stai provando 🤍",
  "Una abitudine fatta è già una vittoria 🎉",
  "Non serve essere perfetti, solo costanti 🌿",
  "Il tuo futuro te stesso ti ringrazia 💛",
];

export const CATEGORIES = {
  neuroscienza: { label: "Neuroscienza", color: "lilac", emoji: "🧠" },
  produttivita: { label: "Produttività", color: "sky", emoji: "⚡" },
  mindset: { label: "Mindset", color: "mint", emoji: "🌿" },
  emozioni: { label: "Emozioni", color: "sakura", emoji: "🌸" },
  studio: { label: "Studio", color: "sunset", emoji: "📚" },
};

export const todayStr = () => moment().format("YYYY-MM-DD");

export const dailyMessage = () => MOTIVATION[moment().dayOfYear() % MOTIVATION.length];

export function getActiveHabits(habits) {
  return habits.filter((h) => h.is_active !== false);
}

export function completedToday(habitId, logs) {
  const t = todayStr();
  return logs.some((l) => l.habit_id === habitId && l.completed_date === t);
}

export function todayProgress(habits, logs) {
  const active = getActiveHabits(habits);
  const done = active.filter((h) => completedToday(h.id, logs)).length;
  return { done, total: active.length };
}

export function globalStreak(habits) {
  return getActiveHabits(habits).reduce((s, h) => s + (h.streak || 0), 0);
}

export async function loadHabitsAndLogs() {
  const [habits, logs] = await Promise.all([
    base44.entities.Habit.filter({ is_active: true }),
    base44.entities.HabitLog.filter({ completed_date: todayStr() }),
  ]);
  return { habits, logs };
}

// Complete a habit: create today's log, update streak (consecutive), best_streak, totals, XP.
export async function completeHabit(habit, logs, profile) {
  const t = todayStr();
  if (logs.some((l) => l.habit_id === habit.id && l.completed_date === t)) return null;

  const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");
  const yLogs = await base44.entities.HabitLog.filter({ habit_id: habit.id, completed_date: yesterday });
  const newStreak = yLogs.length > 0 ? (habit.streak || 0) + 1 : 1;

  await base44.entities.HabitLog.create({
    habit_id: habit.id,
    completed_date: t,
    xp_earned: habit.xp_per_completion || 10,
  });

  const updated = await base44.entities.Habit.update(habit.id, {
    streak: newStreak,
    best_streak: Math.max(habit.best_streak || 0, newStreak),
    total_completions: (habit.total_completions || 0) + 1,
  });

  if (profile) {
    await base44.entities.UserProfile.update(profile.id, {
      total_xp: (profile.total_xp || 0) + (habit.xp_per_completion || 10),
      longest_streak: Math.max(profile.longest_streak || 0, newStreak),
    });
  }
  return updated;
}

export function habitCap(profile) {
  return profile?.plan === "premium" ? 10 : 5;
}