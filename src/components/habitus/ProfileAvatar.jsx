import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAppSettings } from "@/lib/AppSettings";

export default function ProfileAvatar({ photoUrl, name, onUpdated }) {
  const { t } = useAppSettings();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await onUpdated({ photo_url: file_url });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sakura to-lilac flex items-center justify-center text-2xl font-extrabold text-white overflow-hidden">
        {photoUrl ? (
          <img src={photoUrl} alt={t("change_photo")} className="w-full h-full object-cover" />
        ) : (
          name?.charAt(0) || "🌸"
        )}
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label={t("change_photo")}
        className="absolute -bottom-1 -right-1 w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center shadow disabled:opacity-50"
      >
        {uploading ? (
          <span className="w-3 h-3 border-2 border-sakura/40 border-t-sakura rounded-full animate-spin" />
        ) : (
          <Camera size={14} className="text-foreground" />
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}