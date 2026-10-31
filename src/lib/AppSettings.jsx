import { createContext, useContext, useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { translations } from "./i18n";
import { DEFAULT_PALETTE } from "./palettes";

const Ctx = createContext(null);

export function AppSettingsProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [lang, setLangState] = useState("it");
  const [evening, setEvening] = useState(false);
  const [palette, setPaletteState] = useState(DEFAULT_PALETTE);

  useEffect(() => {
    (async () => {
      try {
        const profiles = await base44.entities.UserProfile.list();
        const p = profiles[0] || null;
        setProfile(p);
        setLangState(p?.language || "it");
        setEvening(!!p?.evening_mode);
        setPaletteState(p?.bg_color || DEFAULT_PALETTE);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const persist = async (updates) => {
    let p = profile;
    if (p) {
      p = await base44.entities.UserProfile.update(p.id, updates);
    } else {
      p = await base44.entities.UserProfile.create(updates);
    }
    setProfile(p);
    return p;
  };

  const setLang = (l) => {
    setLangState(l);
    persist({ language: l });
  };
  const setPalette = (c) => {
    setPaletteState(c);
    persist({ bg_color: c });
  };
  const toggleEvening = (v) => {
    setEvening(v);
    persist({ evening_mode: v });
  };

  const t = (key, vars) => {
    const dict = translations[lang] || translations.it;
    let s = dict[key] ?? translations.it[key] ?? key;
    if (vars) Object.keys(vars).forEach((k) => {
      s = s.replace(`{${k}}`, vars[k]);
    });
    return s;
  };

  return (
    <Ctx.Provider value={{ lang, t, setLang, evening, toggleEvening, palette, setPalette, profile, persist }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAppSettings = () => useContext(Ctx);