import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAppSettings } from "@/lib/AppSettings";

const MAX_LEN = 60;

// Shows the user's name with a pencil button; editing saves through the
// update_my_name RPC, which only changes the signed-in user's own row.
export default function EditableName({ name, onSaved }) {
  const { t } = useAppSettings();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const start = () => {
    setValue(name || "");
    setError("");
    setEditing(true);
  };

  const save = async (e) => {
    e?.preventDefault();
    const clean = value.trim();
    if (!clean || clean.length > MAX_LEN) {
      setError(t("name_error"));
      return;
    }
    setSaving(true);
    try {
      await base44.auth.updateMyName(clean);
      setEditing(false);
      onSaved?.(clean);
    } catch {
      setError(t("name_error"));
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={start}
        className="flex items-center gap-1.5 mt-2 group"
        aria-label={t("edit_name")}
      >
        <h1 className="font-extrabold text-lg text-foreground">{name || t("user")}</h1>
        <Pencil size={14} className="text-muted-foreground group-hover:text-foreground" />
      </button>
    );
  }

  return (
    <form onSubmit={save} className="flex flex-col items-center mt-2 w-full max-w-xs">
      <div className="flex items-center gap-2 w-full">
        <input
          autoFocus
          value={value}
          maxLength={MAX_LEN}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("name_placeholder")}
          aria-label={t("name_placeholder")}
          className="flex-1 h-10 px-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={saving}
          aria-label={t("name_save")}
          className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
        >
          <Check size={16} />
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          aria-label={t("name_cancel")}
          className="h-10 w-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center"
        >
          <X size={16} />
        </button>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </form>
  );
}
