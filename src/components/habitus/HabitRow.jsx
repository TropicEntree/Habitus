import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";
import { TIME_SLOTS } from "@/lib/habitus";
import { useAppSettings } from "@/lib/AppSettings";

const colorMap = {
  sakura: "border-sakura/40 bg-sakura/15",
  sky: "border-sky/40 bg-sky/15",
  lilac: "border-lilac/40 bg-lilac/15",
  mint: "border-mint/40 bg-mint/15",
};

export default function HabitRow({ habit, done, onCheck }) {
  const { t } = useAppSettings();
  const slot = TIME_SLOTS[habit.time_slot] || TIME_SLOTS.all_day;
  const cls = colorMap[habit.color] || colorMap.mint;
  return (
    <motion.div
      className={`flex items-center gap-3 p-3.5 rounded-2xl border card transition-colors ${
        done ? "bg-mint/20 border-mint" : cls
      }`}
    >
      <div className="text-2xl">{habit.icon || "🌿"}</div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
          {habit.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground">
            {slot.emoji} {t(`slot_${habit.time_slot || "all_day"}`)}
          </span>
          {habit.streak > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-sunset">
              <Flame size={11} /> {habit.streak}
            </span>
          )}
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => !done && onCheck()}
        disabled={done}
        aria-label={done ? t("completed_label", { name: habit.title }) : t("complete_label", { name: habit.title })}
        className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all ${
          done
            ? "bg-mint border-mint text-white"
            : "border-muted-foreground/25 text-transparent hover:border-sakura"
        }`}
      >
        {done && <Check size={20} strokeWidth={3} />}
      </motion.button>
    </motion.div>
  );
}