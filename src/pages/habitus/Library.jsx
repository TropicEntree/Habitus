import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Lock, Wind, Sparkles, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { subscribeTabReset } from "@/lib/tabEvents";
import { CATEGORIES } from "@/lib/habitus";
import { useAppSettings } from "@/lib/AppSettings";
import BreathingTool from "@/components/habitus/BreathingTool";
import PullToRefresh from "@/components/shared/PullToRefresh";

const catChip = {
  neuroscienza: "bg-lilac/20",
  produttivita: "bg-sky/20",
  mindset: "bg-mint/20",
  emozioni: "bg-sakura/20",
  studio: "bg-sunset/20",
};

export default function Library() {
  const { t, lang } = useAppSettings();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("all");
  const [dur, setDur] = useState("all");
  const [breath, setBreath] = useState(false);
  const [openItem, setOpenItem] = useState(null);

  const load = async () => {
    const data = await base44.entities.LibraryContent.list("-created_date", 500);
    setItems(data);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => subscribeTabReset("/library", load), []);

  useEffect(() => {
    if (!openItem) return;
    window.history.pushState({ habModal: true }, "");
    const onPop = () => setOpenItem(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [openItem]);

  const filtered = items.filter(
    (i) =>
      // Content without a language tag predates per-language tagging — keep it visible to everyone.
      (!i.language || i.language === lang) &&
      (cat === "all" || i.category === cat) &&
      (dur === "all" || (dur === "short" && i.duration_minutes < 3) || (dur === "mid" && i.duration_minutes >= 3))
  );

  return (
    <PullToRefresh onRefresh={load}>
    <div className="px-5 pt-14 pb-28 min-h-screen">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">{t("lib_title")}</h1>
      <p className="text-sm text-muted-foreground mb-4">{t("lib_subtitle")}</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <button onClick={() => setBreath(true)} className="p-4 rounded-2xl bg-sky/20 border border-sky/40 text-left">
          <Wind size={20} className="text-foreground mb-2" />
          <p className="font-bold text-sm text-foreground">{t("breath")}</p>
          <p className="text-[11px] text-muted-foreground">{t("breath_desc")}</p>
        </button>
        <button onClick={() => setBreath(true)} className="p-4 rounded-2xl bg-mint/20 border border-mint/40 text-left">
          <Sparkles size={20} className="text-foreground mb-2" />
          <p className="font-bold text-sm text-foreground">{t("reset")}</p>
          <p className="text-[11px] text-muted-foreground">{t("reset_desc")}</p>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
        {[["all", t("filter_all")], ...Object.keys(CATEGORIES).map((k) => [k, t(`cat_${k}`)])].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setCat(k)}
            className={`px-3.5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap ${
              cat === k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        {[["all", t("dur_any")], ["short", t("dur_short")], ["mid", t("dur_mid")]].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setDur(k)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              dur === k ? "bg-lilac text-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-4 border-sakura/40 border-t-sakura rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((it) => (
            <button
              key={it.id}
              onClick={() => setOpenItem(it)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border text-left"
            >
              <div className="text-3xl">{it.emoji || "🌿"}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground">{it.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-foreground ${catChip[it.category] || "bg-mint/20"}`}>
                    {t(`cat_${it.category}`)}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock size={11} /> {t("min", { n: it.duration_minutes })}
                  </span>
                </div>
              </div>
              {it.is_premium && <Lock size={16} className="text-sunset" />}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {openItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => window.history.back()}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-3xl p-5 shadow-2xl border border-border max-h-[80vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{openItem.emoji}</span>
                <button onClick={() => window.history.back()} aria-label="Close" className="p-2 rounded-full hover:bg-muted">
                  <X size={18} />
                </button>
              </div>
              <h3 className="font-extrabold text-lg text-foreground mb-1">{openItem.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{t("read_time", { n: openItem.duration_minutes })}</p>
              {openItem.is_premium ? (
                <div className="text-center py-8">
                  <Lock className="mx-auto text-sunset mb-2" />
                  <p className="text-sm text-foreground font-bold mb-1">{t("premium")}</p>
                  <p className="text-xs text-muted-foreground mb-4">{t("premium_unlock")}</p>
                  <button className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm">
                    {t("premium_cta")}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{openItem.body || openItem.summary}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BreathingTool open={breath} onClose={() => setBreath(false)} />
    </div>
    </PullToRefresh>
  );
}