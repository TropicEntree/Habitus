import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function AccountDeletion() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setStep(1);
    setConfirmText("");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setStep(1);
    setConfirmText("");
  };

  const [error, setError] = useState("");

  // Store rules (Apple 5.1.1(v), Google Play User Data) require a real deletion:
  // if it fails we must tell the user instead of logging them out silently.
  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const me = await base44.auth.me();
      if (!me?.id) throw new Error("no-user");
      await base44.entities.User.delete(me.id);
      await base44.auth.logout("/login");
      window.location.href = "/login";
    } catch {
      setError("Eliminazione non riuscita. Riprova più tardi o contatta il supporto.");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all"
      >
        <Trash2 size={16} />
        Elimina Account
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-2xl p-5 safe-area-pt safe-area-pb"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <h3 className="font-bold text-white text-base">Elimina Account</h3>
              </div>
              <button onClick={closeModal} className="text-slate-500 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {step === 1 && (
              <>
                <div className="space-y-3 mb-5">
                  <p className="text-sm text-slate-300">
                    Stai per eliminare definitivamente il tuo account FocusFlow. Questa azione <span className="text-red-400 font-semibold">non è reversibile</span>.
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    <li className="flex gap-2"><span className="text-red-400">•</span> Tutti i tuoi dati verranno cancellati</li>
                    <li className="flex gap-2"><span className="text-red-400">•</span> Abitudini, progressi e badge andranno persi</li>
                    <li className="flex gap-2"><span className="text-red-400">•</span> Impossibile recuperare l'account</li>
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-xl bg-red-500/15 text-red-400 text-sm font-semibold hover:bg-red-500/25"
                  >
                    Continua
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-3 mb-5">
                  <p className="text-sm text-slate-300">
                    Per confermare, digita <span className="text-red-400 font-mono font-bold">ELIMINA</span> nel campo qui sotto.
                  </p>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="ELIMINA"
                    className="w-full bg-slate-800 text-white text-sm rounded-xl px-3 py-3 border border-slate-700/30 outline-none focus:border-red-500/50 text-center font-mono uppercase tracking-widest"
                  />
                  {error && (
                    <p role="alert" className="text-xs text-red-400">{error}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={confirmText !== "ELIMINA" || loading}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {loading ? "Eliminazione..." : "Elimina definitivamente"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}