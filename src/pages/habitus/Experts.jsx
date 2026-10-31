import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { subscribeTabReset } from "@/lib/tabEvents";
import { useAppSettings } from "@/lib/AppSettings";
import BookingDialog from "@/components/habitus/BookingDialog";
import PullToRefresh from "@/components/shared/PullToRefresh";
import SheetPicker from "@/components/habitus/SheetPicker";

const SPEC_KEYS = ["adhd_coach", "psychologist", "psychiatrist", "therapist", "neurologist"];
const LANG_KEYS = ["it", "en", "ko"];

export default function Experts() {
  const { t } = useAppSettings();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spec, setSpec] = useState("all");
  const [lang, setLang] = useState("all");
  const [sort, setSort] = useState("rating");
  const [book, setBook] = useState(null);

  const load = async () => {
    const d = await base44.entities.Expert.list("-rating", 50);
    setExperts(d);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => subscribeTabReset("/experts", load), []);

  let list = experts.filter((e) => (spec === "all" || e.specialty === spec) && (lang === "all" || e.language === lang));
  list = [...list].sort((a, b) => (sort === "rating" ? (b.rating || 0) - (a.rating || 0) : (a.price || 0) - (b.price || 0)));

  return (
    <PullToRefresh onRefresh={load}>
    <div className="px-5 pt-14 pb-28 min-h-screen">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">{t("exp_title")}</h1>
      <p className="text-sm text-muted-foreground mb-4">{t("exp_subtitle")}</p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
        {[["all", t("exp_all")], ...SPEC_KEYS.map((k) => [k, t(`sp_${k}`)])].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setSpec(k)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              spec === k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <SheetPicker
          value={lang}
          onChange={setLang}
          label={t("all_langs")}
          options={[{ value: "all", label: t("all_langs") }, ...LANG_KEYS.map((k) => ({ value: k, label: t(`lang_${k}`) }))]}
          triggerClassName="px-3 py-1.5 rounded-xl text-xs border border-input bg-card text-foreground font-bold"
        />
        <SheetPicker
          value={sort}
          onChange={setSort}
          label={t("sort_rating")}
          options={[
            { value: "rating", label: t("sort_rating") },
            { value: "price", label: t("sort_price") },
          ]}
          triggerClassName="px-3 py-1.5 rounded-xl text-xs border border-input bg-card text-foreground font-bold"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-4 border-sakura/40 border-t-sakura rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((e) => (
            <div key={e.id} className="flex gap-3 p-4 rounded-2xl bg-card border border-border">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sakura to-lilac flex items-center justify-center text-xl font-extrabold text-white shrink-0 overflow-hidden">
                {e.photo_url ? (
                  <img src={e.photo_url} alt={e.name} className="w-full h-full object-cover" />
                ) : (
                  e.name?.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground">{e.name}</p>
                <p className="text-[11px] text-muted-foreground">{t(`sp_${e.specialty}`)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-sunset">
                    <Star size={11} className="text-sunset" />
                    {e.rating?.toFixed?.(1) || "5.0"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{t(`lang_${e.language}`)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="font-extrabold text-foreground">€{e.price}</span>
                <button
                  onClick={() => setBook(e)}
                  className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                >
                  {t("book")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BookingDialog expert={book} open={!!book} onClose={() => setBook(null)} />
    </div>
    </PullToRefresh>
  );
}