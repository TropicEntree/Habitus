import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";

function getXPForLevel(level) {
  return level * 100;
}

export default function XPBar({ totalXP, level }) {
  const xpForCurrent = getXPForLevel(level);
  const xpFromPrevLevels = Array.from({ length: level - 1 }, (_, i) => getXPForLevel(i + 1)).reduce((a, b) => a + b, 0);
  const xpInLevel = Math.max(totalXP - xpFromPrevLevels, 0);
  const progress = Math.min((xpInLevel / xpForCurrent) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-xs font-black text-white">{level}</span>
          </div>
          <span className="text-xs font-semibold text-slate-400">Livello {level}</span>
        </div>
        <div className="flex items-center gap-1 text-purple-400">
          <Zap size={12} />
          <span className="text-xs font-bold">
            <AnimatedCounter value={xpInLevel} />/<AnimatedCounter value={xpForCurrent} duration={400} /> XP
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full shadow-sm shadow-purple-500/50"
        />
      </div>
    </div>
  );
}