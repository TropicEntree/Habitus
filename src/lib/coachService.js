import { base44 } from "@/api/base44Client";
import moment from "moment";

// Claude powers the coach (non-default model — uses more integration credits).
const COACH_MODEL = "claude_sonnet_4_6";

/**
 * Gathers the user's real progress data (last 7 days) into a compact JSON
 * string used as LLM context.
 */
export async function gatherCoachContext() {
  const sevenDaysAgo = moment().subtract(7, "days").format("YYYY-MM-DD");
  const [metrics, logs, habits, profiles] = await Promise.all([
    base44.entities.DailyMetric.list("-log_date", 50),
    base44.entities.HabitLog.list("-completed_date", 50),
    base44.entities.Habit.filter({ is_active: true }),
    base44.entities.UserProfile.list(),
  ]);
  const profile = profiles[0] || {};
  const recentMetrics = metrics.filter((m) => m.log_date && m.log_date >= sevenDaysAgo);
  const recentLogs = logs.filter((l) => l.completed_date && l.completed_date >= sevenDaysAgo);

  return JSON.stringify({
    xp_totale: profile.total_xp || 0,
    livello: profile.level || 1,
    longest_streak: profile.longest_streak || 0,
    abitudini: habits.map((h) => ({
      titolo: h.title,
      categoria: h.category,
      streak: h.streak,
      miglior_streak: h.best_streak,
      completamenti: h.total_completions,
    })),
    completamenti_7gg: recentLogs.length,
    xp_7gg: recentLogs.reduce((s, l) => s + (l.xp_earned || 0), 0),
    metriche: recentMetrics.map((m) => ({
      data: m.log_date,
      umore: m.mood,
      acqua: m.water_glasses,
      attivita_min: m.activity_minutes,
      wake: m.wake_time,
      todo: m.todo_text,
      miglioramento: m.improvement_text,
    })),
  });
}

/**
 * Analyzes the user's real data and creates a proactive motivational insight
 * (stored as a CoachMessage). Returns the created record.
 */
export async function generateInsight() {
  const context = await gatherCoachContext();
  const res = await base44.integrations.Core.InvokeLLM({
    model: COACH_MODEL,
    prompt:
      "Sei un coach motivazionale esperto che supporta persone con ADHD. Analizza i dati reali dell'utente (ultimi 7 giorni) e genera UN suggerimento motivazionale PROATTIVO, breve (max 2-3 frasi), personalizzato e basato sui progressi reali. Riconosci un pattern concreto (es. streak in calo, umore migliorato, abitudini trascurate, buon completamento) e usa un tono incoraggiante e non giudicante. Non inventare dati non presenti. Dati JSON:\n" +
      context,
    response_json_schema: {
      type: "object",
      properties: {
        message: { type: "string" },
        category: { type: "string", enum: ["insight", "motivation", "warning", "celebration"] },
        context_summary: { type: "string" },
      },
    },
  });
  return base44.entities.CoachMessage.create({
    message: res.message || "Continua così: ogni piccolo passo conta verso i tuoi obiettivi!",
    category: res.category || "motivation",
    context_summary: res.context_summary || "",
    is_read: false,
  });
}

/**
 * Answers a free-form question using the user's real data as context.
 */
export async function askCoach(question) {
  const context = await gatherCoachContext();
  const res = await base44.integrations.Core.InvokeLLM({
    model: COACH_MODEL,
    prompt:
      "Sei un coach motivazionale per persone con ADHD. Rispondi in modo breve, pratico e incoraggiante, basandoti sui dati reali dell'utente. Non inventare dati non presenti.\nDati JSON:\n" +
      context +
      "\n\nDomanda dell'utente: " +
      question,
  });
  return typeof res === "string" ? res : JSON.stringify(res);
}

/**
 * Generates and stores the weekly summary for the current ISO week.
 * Returns the created WeeklySummary record.
 */
export async function generateWeeklySummary() {
  const sevenDaysAgo = moment().subtract(7, "days").format("YYYY-MM-DD");
  const [logs, metrics, habits] = await Promise.all([
    base44.entities.HabitLog.list("-completed_date", 100),
    base44.entities.DailyMetric.list("-log_date", 50),
    base44.entities.Habit.filter({ is_active: true }),
  ]);
  const recentLogs = logs.filter((l) => l.completed_date && l.completed_date >= sevenDaysAgo);
  const recentMetrics = metrics.filter((m) => m.log_date && m.log_date >= sevenDaysAgo);

  const xpTotal = recentLogs.reduce((s, l) => s + (l.xp_earned || 0), 0);
  const completions = recentLogs.length;
  const activeDays = new Set(recentMetrics.map((m) => m.log_date)).size;

  const counts = {};
  recentLogs.forEach((l) => {
    counts[l.habit_id] = (counts[l.habit_id] || 0) + 1;
  });
  let bestHabitId = null;
  let bestCount = 0;
  Object.entries(counts).forEach(([id, c]) => {
    if (c > bestCount) {
      bestCount = c;
      bestHabitId = id;
    }
  });
  const bestHabit = habits.find((h) => h.id === bestHabitId);

  const context = JSON.stringify({
    xp_settimanale: xpTotal,
    completamenti: completions,
    giorni_attivi: activeDays,
    miglior_abitudine: bestHabit ? bestHabit.title : null,
    umori: recentMetrics.map((m) => m.mood),
    abitudini: habits.map((h) => ({ titolo: h.title, streak: h.streak })),
  });

  const res = await base44.integrations.Core.InvokeLLM({
    model: COACH_MODEL,
    prompt:
      "Sei un coach ADHD. Genera un RIEPILOGO SETTIMANALE breve (3-4 frasi) che celebra i progressi reali dell'utente della scorsa settimana e suggerisce un focus concreto per la prossima. Tono caldo, incoraggiante, non giudicante. Non inventare dati non presenti. Dati JSON:\n" +
      context,
    response_json_schema: {
      type: "object",
      properties: { summary_text: { type: "string" } },
    },
  });

  const weekKey = `${moment().isoWeekYear()}-W${String(moment().isoWeek()).padStart(2, "0")}`;
  return base44.entities.WeeklySummary.create({
    week_key: weekKey,
    summary_text: res.summary_text || "",
    xp_total: xpTotal,
    completions,
    active_days: activeDays,
    best_habit: bestHabit ? bestHabit.title : "",
  });
}