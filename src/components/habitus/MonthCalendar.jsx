import { useMemo } from "react";
import moment from "moment";
import { useAppSettings } from "@/lib/AppSettings";

export default function MonthCalendar({ logs, month = moment() }) {
  const { t } = useAppSettings();
  const start = month.clone().startOf("month");
  const gridStart = start.clone().subtract(start.day() === 0 ? 6 : start.day() - 1, "days");
  const days = Array.from({ length: 42 }, (_, i) => gridStart.clone().add(i, "days"));

  const counts = useMemo(() => {
    const m = {};
    logs.forEach((l) => {
      if (l.completed_date) m[l.completed_date] = (m[l.completed_date] || 0) + 1;
    });
    return m;
  }, [logs]);

  const weekdays = t("weekdays");

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {weekdays.map((d, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const ds = d.format("YYYY-MM-DD");
          const c = counts[ds] || 0;
          const inMonth = d.isSame(month, "month");
          return (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-[10px] ${
                inMonth ? "" : "opacity-30"
              } ${c > 0 ? "bg-mint text-foreground font-bold" : "bg-muted/60 text-muted-foreground"}`}
            >
              {d.date()}
            </div>
          );
        })}
      </div>
    </div>
  );
}