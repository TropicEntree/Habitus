import { Ban } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAppSettings } from '@/lib/AppSettings';

export default function SuspendedAccount() {
  const settings = useAppSettings();
  const t = settings?.t || ((key) => key);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <div className="max-w-md w-full p-8 bg-card rounded-2xl shadow-lg border border-border text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-destructive/15">
          <Ban className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-3">{t('suspended_title')}</h1>
        <p className="text-sm text-muted-foreground mb-8">{t('suspended_body')}</p>
        <button
          onClick={() => base44.auth.logout('/login')}
          className="w-full py-3 rounded-2xl border border-border text-muted-foreground font-bold text-sm"
        >
          {t('logout')}
        </button>
      </div>
    </div>
  );
}
