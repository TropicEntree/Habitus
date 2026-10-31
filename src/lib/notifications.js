import { base44 } from "@/api/base44Client";
import moment from "moment";

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function ensurePermission() {
  if (!notificationsSupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return "denied";
  }
}

export function showNotification(title, body) {
  if (!notificationsSupported() || Notification.permission !== "granted") return false;
  try {
    new Notification(title, { body });
    return true;
  } catch (e) {
    return false;
  }
}

export function getReminderConfig() {
  try {
    return JSON.parse(localStorage.getItem("ff_reminder") || "{}");
  } catch (e) {
    return {};
  }
}

export function setReminderConfig(cfg) {
  try {
    localStorage.setItem("ff_reminder", JSON.stringify(cfg));
  } catch (e) {
    // ignore
  }
}

/**
 * Builds a smart, non-invasive reminder based on today's real progress.
 * Returns { title, body } or null when there is nothing meaningful to say.
 */
export async function buildSmartReminder() {
  const today = moment().format("YYYY-MM-DD");
  const [habits, logs] = await Promise.all([
    base44.entities.Habit.filter({ is_active: true }),
    base44.entities.HabitLog.filter({ completed_date: today }),
  ]);
  if (!habits.length) return null;
  const doneIds = new Set(logs.map((l) => l.habit_id));
  const completed = habits.filter((h) => doneIds.has(h.id)).length;
  const pending = habits.length - completed;

  if (pending === 0) {
    return { title: "Obiettivo raggiunto 🎉", body: "Hai completato tutte le abitudini di oggi. Ottimo lavoro!" };
  }
  if (completed === 0) {
    return {
      title: "Una piccola vittoria",
      body: `Hai ${pending} abitudini oggi. Iniziane una, anche breve: conta comunque.`,
    };
  }
  return {
    title: "Continua così 💪",
    body: `Hai completato ${completed}/${habits.length} abitudini. Ne mancano ${pending}.`,
  };
}