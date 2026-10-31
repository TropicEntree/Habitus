import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Zap, TrendingUp } from "lucide-react";
import moment from "moment";

const dayLabels = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

export default function WeeklyProgressChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const mod = await import("recharts");
        if (active) setChart(mod);
      } catch {
        /* optional */
      }
    })();
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const loadData = async () => {
    try {
      const logs = await base44.entities.HabitLog.list("-completed_date", 500);
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const day = moment().subtract(i, "days");
        days.push({
          date: day.format("YYYY-MM-DD"),
          label: dayLabels[day.day()],
          xp: 0,
          completions: 0,
        });
      }
      logs.forEach((log) => {
        if (!log.completed_date) return;
        const logDate = moment(log.completed_date).format("YYYY-MM-DD");
        const day = days.find((d) => d.date === logDate);
        if (day) {
          day.xp += log.xp_earned || 0;
          day.completions += 1;
        }
      });
      setData(days);
    } catch {
      // silent
    }
    setLoading(false);
  };

  const totalXP = data.reduce((s, d) => s + d.xp, 0);
  const totalCompletions = data.reduce((s, d) => s + d.completions, 0);
  const activeDays = data.filter((d) => d.completions > 0).length;

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.75rem",
    fontSize: "12px",
    color: "hsl(var(--foreground))",
  };

  if (loading || !chart) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const { ResponsiveContainer, ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, CartesianGrid } = chart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mt-5 p-5 rounded-2xl bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <TrendingUp size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm">Progresso Settimanale</h3>
            <p className="text-xs text-muted-foreground">Ultimi 7 giorni</p>
          </div>
        </div>
        <div className="flex gap-3 text-right">
          <div>
            <div className="flex items-center gap-1 justify-end">
              <Zap size={12} className="text-purple-400" />
              <span className="text-sm font-black text-purple-400">{totalXP}</span>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">XP totali</p>
          </div>
          <div>
            <span className="text-sm font-black text-cyan-400">{activeDays}/7</span>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Giorni attivi</p>
          </div>
        </div>
      </div>

      <div className="h-40 mt-3 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(168,85,247,0.05)" }} labelStyle={{ color: "#a855f7", fontWeight: "bold" }} />
            <Area type="monotone" dataKey="xp" name="XP" stroke="#a855f7" strokeWidth={2} fill="url(#xpGrad)" />
            <Bar dataKey="completions" name="Abitudini" fill="url(#barGrad)" radius={[4, 4, 0, 0]} barSize={14} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span className="text-xs text-muted-foreground">XP guadagnati</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-b from-blue-500 to-cyan-500" />
          <span className="text-xs text-muted-foreground">Abitudini completate</span>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">{totalCompletions} completamenti</div>
      </div>
    </motion.div>
  );
}