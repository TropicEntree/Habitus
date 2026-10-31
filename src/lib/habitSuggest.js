import { base44 } from "@/api/base44Client";
import { HABIT_COLORS, HABIT_EMOJIS, TIME_SLOTS } from "@/lib/habitus";

const LANG_NAME = { it: "Italian", en: "English", ko: "Korean" };

/** Asks the AI for up to 3 small habits for the user's goal. */
export async function suggestHabits(goal, lang) {
  const habits = await base44.entities.Habit.filter({ is_active: true });
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Suggest exactly 3 small habits for an adult with ADHD, based on the goal below.
Each habit must take under 10 minutes, be concrete and start with a verb. Title at most 40 characters, in ${LANG_NAME[lang] || "Italian"}. No guilt, no medical advice.
Do not repeat these existing habits: ${JSON.stringify(habits.map((h) => h.title))}
Goal: ${JSON.stringify(goal)}`,
    response_json_schema: {
      type: "object",
      properties: {
        suggestions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              emoji: { type: "string", enum: HABIT_EMOJIS },
              color: { type: "string", enum: HABIT_COLORS },
              time_slot: { type: "string", enum: Object.keys(TIME_SLOTS) },
            },
          },
        },
      },
    },
  });
  return (res?.suggestions || []).filter((s) => s?.title).slice(0, 3);
}
