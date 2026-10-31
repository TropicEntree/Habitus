import { useState, useEffect, useMemo } from "react";
import { Search, ShieldCheck, Shield, Crown, Ban, PlayCircle, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAppSettings } from "@/lib/AppSettings";
import { useAuth } from "@/lib/AuthContext";
import DeleteUserDialog from "@/components/admin/DeleteUserDialog";

export default function AdminUsers() {
  const { t } = useAppSettings();
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    const [userList, profileList] = await Promise.all([
      base44.entities.User.list("-created_date", 500),
      base44.entities.UserProfile.listAll(null, 500),
    ]);
    setUsers(userList);
    const byOwner = {};
    for (const p of profileList) {
      const key = p.created_by || p.owner || p.user_email;
      if (key) byOwner[key] = p;
    }
    setProfiles(byOwner);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, query]);

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    await base44.entities.User.update(u.id, { role: newRole });
    load();
  };

  const toggleSuspend = async (u) => {
    const newStatus = u.status === "suspended" ? "active" : "suspended";
    await base44.entities.User.update(u.id, { status: newStatus });
    load();
  };

  const togglePremium = async (u) => {
    const profile = profiles[u.email];
    const nextPlan = profile?.plan === "premium" ? "free" : "premium";
    if (profile) {
      await base44.entities.UserProfile.update(profile.id, { plan: nextPlan });
    } else {
      await base44.entities.UserProfile.create({ plan: nextPlan, created_by: u.email });
    }
    load();
  };

  const confirmDelete = async () => {
    await base44.entities.User.delete(deleteTarget.id).catch(() => {});
    load();
  };

  return (
    <div className="px-5">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">{t("admin_users")}</h1>
      <p className="text-sm text-muted-foreground mb-4">{t("admin_users_desc")}</p>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("admin_search_users")}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-input bg-card text-foreground"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-4 border-sakura/40 border-t-sakura rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-10">{t("admin_no_users")}</p>
      ) : (
        <div className="space-y-3 pb-4">
          {filtered.map((u) => {
            const isSelf = u.id === me?.id;
            const isAdmin = u.role === "admin";
            const isSuspended = u.status === "suspended";
            const isPremium = profiles[u.email]?.plan === "premium";
            return (
              <div key={u.id} className="p-4 rounded-2xl bg-card border border-border">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{u.full_name || t("user")}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAdmin ? "bg-lilac/25 text-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isAdmin ? t("admin_role_admin") : t("admin_role_user")}
                      </span>
                      {isPremium && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sunset/20 text-sunset">
                          {t("plan_premium")}
                        </span>
                      )}
                      {isSuspended && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">
                          {t("admin_suspended_badge")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => toggleRole(u)}
                    disabled={isSelf}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-muted text-foreground disabled:opacity-30"
                  >
                    {isAdmin ? <Shield size={12} /> : <ShieldCheck size={12} />}
                    {isAdmin ? t("admin_remove_admin") : t("admin_make_admin")}
                  </button>
                  <button
                    onClick={() => togglePremium(u)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-muted text-foreground"
                  >
                    <Crown size={12} />
                    {isPremium ? t("admin_revoke_premium") : t("admin_grant_premium")}
                  </button>
                  <button
                    onClick={() => toggleSuspend(u)}
                    disabled={isSelf}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-muted text-foreground disabled:opacity-30"
                  >
                    {isSuspended ? <PlayCircle size={12} /> : <Ban size={12} />}
                    {isSuspended ? t("admin_reactivate") : t("admin_suspend")}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(u)}
                    disabled={isSelf}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-destructive/10 text-destructive disabled:opacity-30"
                  >
                    <Trash2 size={12} />
                    {t("admin_delete")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeleteUserDialog
        user={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
