export default function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${on ? "bg-mint" : "bg-muted"}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
