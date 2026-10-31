import { motion } from "framer-motion";
import { Trophy, Flame, Star, Zap, Target, Brain, Award, Crown } from "lucide-react";

const badgeConfig = {
  first_habit: { icon: Star, label: "Prima Abitudine", color: "from-amber-500 to-yellow-500" },
  streak_3: { icon: Flame, label: "3 Giorni Streak", color: "from-orange-500 to-red-500" },
  streak_7: { icon: Flame, label: "7 Giorni Streak", color: "from-red-500 to-pink-500" },
  streak_30: { icon: Crown, label: "30 Giorni Streak", color: "from-purple-500 to-pink-500" },
  level_5: { icon: Trophy, label: "Livello 5", color: "from-blue-500 to-cyan-500" },
  level_10: { icon: Award, label: "Livello 10", color: "from-violet-500 to-purple-500" },
  focus_master: { icon: Brain, label: "Focus Master", color: "from-cyan-500 to-blue-500" },
  xp_100: { icon: Zap, label: "100 XP", color: "from-green-500 to-emerald-500" },
  xp_500: { icon: Zap, label: "500 XP", color: "from-emerald-500 to-teal-500" },
  ten_completions: { icon: Target, label: "10 Completamenti", color: "from-pink-500 to-rose-500" },
};

export default function BadgeDisplay({ badges = [], compact = false }) {
  if (badges.length === 0) {
    return (
      <p className="text-xs text-slate-600 italic">Completa abitudini per sbloccare badge!</p>
    );
  }

  return (
    <div className={`flex flex-wrap ${compact ? "gap-2" : "gap-3"}`}>
      {badges.map((badgeId, idx) => {
        const config = badgeConfig[badgeId] || { icon: Star, label: badgeId, color: "from-slate-500 to-slate-600" };
        const Icon = config.icon;
        return (
          <motion.div
            key={badgeId}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.1, type: "spring" }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r ${config.color} shadow-lg ${compact ? "text-[10px]" : "text-xs"}`}
          >
            <Icon size={compact ? 12 : 14} className="text-white" />
            <span className="font-bold text-white">{config.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}