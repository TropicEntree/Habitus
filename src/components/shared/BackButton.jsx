import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ onClick, label, className = "" }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={onClick || (() => navigate(-1))}
      aria-label={label || "Back"}
      className={`min-w-11 min-h-11 flex items-center justify-center gap-1 rounded-xl bg-card border border-border text-foreground shrink-0 ${className}`}
    >
      <ChevronLeft size={20} />
    </button>
  );
}