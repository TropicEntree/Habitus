import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { subscribeTabReset } from "@/lib/tabEvents";
import { useAppSettings } from "@/lib/AppSettings";
import moment from "moment";

const LANG_NAME = { it: "italiano", en: "inglese", ko: "coreano" };

export default function Assistant() {
  const { t, lang } = useAppSettings();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const scrollRef = useRef(null);

  const load = async () => {
    const msgs = await base44.entities.AiMessage.list("created_date", 100);
    setMessages(msgs);
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => subscribeTabReset("/assistant", load), []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const weeklyAnalysis = async () => {
    setLoadingInsight(true);
    const start = moment().subtract(6, "days").format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");
    const [habits, logs] = await Promise.all([
      base44.entities.Habit.filter({ is_active: true }),
      base44.entities.HabitLog.filter({ completed_date: { $gte: start, $lte: today } }, "-completed_date", 500),
    ]);
    const total = habits.length * 7;
    const done = logs.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const slotCount = {};
    logs.forEach((l) => {
      const h = habits.find((x) => x.id === l.habit_id);
      if (h) slotCount[h.time_slot || "all_day"] = (slotCount[h.time_slot || "all_day"] || 0) + 1;
    });
    const best = Object.entries(slotCount).sort((a, b) => b[1] - a[1])[0];
    const bestKey = best?.[0] || "all_day";
    setInsight({ pct, bestKey });
    setLoadingInsight(false);
  };
  useEffect(() => {
    weeklyAnalysis();
  }, []);

  const send = async () => {
    if (!input.trim() || busy) return;
    const text = input.trim();
    setInput("");
    setBusy(true);
    const userMsg = await base44.entities.AiMessage.create({ role: "user", content: text });
    setMessages((m) => [...m, userMsg]);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Sei un assistente gentile per persone con ADHD che usano un'app di abitudini chiamata Habitus. Parla come un amico che capisce, mai freddo. Frasi brevi, niente senso di colpa, incoraggiante. Rispondi SEMPRE in lingua ${LANG_NAME[lang] || "italiano"}. Rispondi a: "${text}"`,
      });
      const aiText = typeof res === "string" ? res : res?.content || "🌸";
      const aiMsg = await base44.entities.AiMessage.create({ role: "assistant", content: aiText });
      setMessages((m) => [...m, aiMsg]);
    } catch (e) {
      const aiMsg = await base44.entities.AiMessage.create({ role: "assistant", content: t("ai_error") });
      setMessages((m) => [...m, aiMsg]);
    }
    setBusy(false);
  };

  return (
    <div className="flex flex-col h-dvh pt-14 pb-28">
      <div className="px-5 mb-3">
        <h1 className="text-2xl font-extrabold text-foreground">{t("ai_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("ai_subtitle")}</p>
      </div>

      <button
        onClick={weeklyAnalysis}
        disabled={loadingInsight}
        className="mx-5 mb-3 p-4 rounded-2xl bg-gradient-to-br from-sakura/30 to-lilac/30 border border-lilac/40 text-left"
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-foreground" />
          <span className="font-bold text-sm text-foreground">{t("weekly")}</span>
        </div>
        {loadingInsight ? (
          <p className="text-xs text-muted-foreground">{t("computing")}</p>
        ) : insight ? (
          <p className="text-xs text-foreground/80">
            {t("insight", { pct: insight.pct, best: t(`best_${insight.bestKey}`) })}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">{t("tap_to_see")}</p>
        )}
      </button>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar scroll-container px-5 space-y-2.5">
        {messages.length === 0 && <p className="text-center text-sm text-muted-foreground mt-8">{t("empty_chat")}</p>}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border text-foreground rounded-bl-md"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-card border border-border">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pt-2">
        <div className="flex gap-2 items-center bg-card border border-border rounded-2xl p-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("input_placeholder")}
            className="flex-1 px-3 py-2 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          <button
            onClick={send}
            disabled={busy || !input.trim()}
            aria-label={t("input_placeholder")}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}