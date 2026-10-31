// Drop-in replacement for the Base44 SDK client, backed by Supabase.
//
// The pages still call `base44.entities.X.list(...)`, `base44.auth.me()`,
// `base44.integrations.Core.InvokeLLM(...)`: this module keeps that API so the
// UI code does not change. Security is enforced in the database by Row Level
// Security (supabase/migrations), not here.

import { supabase } from "@/api/supabaseClient";

// Base44 entity name → Supabase table.
const TABLES = {
  Habit: "habits",
  HabitLog: "habit_logs",
  AiMessage: "ai_messages",
  CoachMessage: "coach_messages",
  DailyMetric: "daily_metrics",
  WeeklySummary: "weekly_summaries",
  UserProfile: "user_profiles",
  Booking: "bookings",
  Expert: "experts",
  Specialist: "specialists",
  TrainingProgram: "training_programs",
  LibraryContent: "library_contents",
};

// Tables where a normal page must only see the signed-in user's rows, even
// when the user is an admin (admins can read every profile through RLS).
const OWN_ROWS_ONLY = new Set(["user_profiles"]);

// Columns the client must never write directly.
const READ_ONLY = ["id", "owner_id", "created_date", "updated_date"];

function unwrap({ data, error }) {
  if (error) {
    const err = new Error(error.message);
    err.status = error.status ?? error.code;
    err.data = error;
    throw err;
  }
  return data;
}

function clean(record) {
  const out = { ...record };
  for (const k of READ_ONLY) delete out[k];
  return out;
}

// "-field" → descending, "field" → ascending (Base44 convention).
function applySort(query, sort) {
  if (!sort) return query.order("created_date", { ascending: false });
  const desc = sort.startsWith("-");
  return query.order(desc ? sort.slice(1) : sort, { ascending: !desc });
}

// Supports equality and the Mongo-style operators used by the app.
function applyFilter(query, filter = {}) {
  for (const [field, value] of Object.entries(filter)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      for (const [op, v] of Object.entries(value)) {
        if (op === "$gte") query = query.gte(field, v);
        else if (op === "$lte") query = query.lte(field, v);
        else if (op === "$gt") query = query.gt(field, v);
        else if (op === "$lt") query = query.lt(field, v);
        else if (op === "$ne") query = query.neq(field, v);
        else if (op === "$in") query = query.in(field, v);
        else throw new Error(`Unsupported filter operator ${op}`);
      }
    } else if (value === null) {
      query = query.is(field, null);
    } else {
      query = query.eq(field, value);
    }
  }
  return query;
}

async function currentUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

function entity(table) {
  const select = async (filter, sort, limit, { all = false } = {}) => {
    let q = supabase.from(table).select("*");
    if (OWN_ROWS_ONLY.has(table) && !all) {
      const uid = await currentUserId();
      if (!uid) return [];
      q = q.eq("owner_id", uid);
    }
    q = applyFilter(q, filter);
    q = applySort(q, sort);
    if (limit) q = q.limit(limit);
    return unwrap(await q);
  };

  return {
    list: (sort, limit) => select({}, sort, limit),
    filter: (filter, sort, limit) => select(filter, sort, limit),
    // Admin pages only: every row RLS allows (e.g. all user profiles).
    listAll: (sort, limit) => select({}, sort, limit, { all: true }),
    get: async (id) => unwrap(await supabase.from(table).select("*").eq("id", id).single()),
    create: async (record) =>
      unwrap(await supabase.from(table).insert(clean(record)).select().single()),
    bulkCreate: async (records) =>
      unwrap(await supabase.from(table).insert(records.map(clean)).select()),
    update: async (id, changes) =>
      unwrap(await supabase.from(table).update(clean(changes)).eq("id", id).select().single()),
    bulkUpdate: async (rows) =>
      Promise.all(
        rows.map(({ id, ...changes }) =>
          supabase.from(table).update(clean(changes)).eq("id", id).select().single().then(unwrap),
        ),
      ),
    delete: async (id) => {
      unwrap(await supabase.from(table).delete().eq("id", id));
    },
  };
}

// The "User" entity maps to public.users plus account deletion RPCs.
const UserEntity = {
  list: async (sort, limit) => {
    let q = applySort(supabase.from("users").select("*"), sort);
    if (limit) q = q.limit(limit);
    return unwrap(await q);
  },
  update: async (id, changes) => {
    const allowed = {};
    if ("role" in changes) allowed.role = changes.role;
    if ("status" in changes) allowed.status = changes.status;
    if ("full_name" in changes) allowed.full_name = changes.full_name;
    return unwrap(await supabase.from("users").update(allowed).eq("id", id).select().single());
  },
  delete: async (id) => {
    const uid = await currentUserId();
    if (id === uid) {
      unwrap(await supabase.rpc("delete_my_account"));
      await supabase.auth.signOut();
    } else {
      unwrap(await supabase.rpc("admin_delete_user", { target: id }));
    }
  },
};

const entities = Object.fromEntries(
  Object.entries(TABLES).map(([name, table]) => [name, entity(table)]),
);
entities.User = UserEntity;

function siteUrl(path = "/") {
  return new URL(path, window.location.origin).toString();
}

const auth = {
  async me() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      const err = new Error("Not authenticated");
      err.status = 401;
      throw err;
    }
    const row = unwrap(
      await supabase.from("users").select("*").eq("id", data.user.id).maybeSingle(),
    );
    return {
      id: data.user.id,
      email: data.user.email,
      full_name: row?.full_name ?? data.user.user_metadata?.full_name ?? "",
      role: row?.role ?? "user",
      status: row?.status ?? "active",
      created_date: row?.created_date ?? data.user.created_at,
    };
  },
  async isAuthenticated() {
    const { data } = await supabase.auth.getSession();
    return Boolean(data?.session);
  },
  async loginViaEmailPassword(email, password) {
    return unwrap(await supabase.auth.signInWithPassword({ email, password }));
  },
  async loginWithProvider(provider, nextPath = "/") {
    return unwrap(
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: siteUrl(nextPath) },
      }),
    );
  },
  // Sign-up sends a 6-digit code by email (Supabase "Confirm signup" template
  // must show {{ .Token }}).
  async register({ email, password }) {
    return unwrap(
      await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: siteUrl("/") },
      }),
    );
  },
  async verifyOtp({ email, otpCode }) {
    const data = unwrap(await supabase.auth.verifyOtp({ email, token: otpCode, type: "email" }));
    // The session is stored by supabase-js; nothing else to do.
    return { access_token: data?.session?.access_token ?? null };
  },
  async resendOtp(email) {
    return unwrap(await supabase.auth.resend({ type: "signup", email }));
  },
  // Changes only the signed-in user's display name (RPC checks auth.uid()).
  async updateMyName(newName) {
    return unwrap(await supabase.rpc("update_my_name", { new_name: newName }));
  },
  // Kept for compatibility: supabase-js stores the session itself.
  setToken() {},
  async resetPasswordRequest(email) {
    return unwrap(
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: siteUrl("/reset-password?token=recovery"),
      }),
    );
  },
  // The recovery link signs the user in (PKCE), so we only set the password.
  async resetPassword({ newPassword }) {
    return unwrap(await supabase.auth.updateUser({ password: newPassword }));
  },
  async logout(redirectTo) {
    await supabase.auth.signOut();
    if (redirectTo) window.location.href = redirectTo;
  },
  redirectToLogin(returnTo) {
    const path = returnTo ? `/login?returnTo=${encodeURIComponent(new URL(returnTo, window.location.origin).pathname)}` : "/login";
    window.location.href = path;
  },
};

const integrations = {
  Core: {
    async InvokeLLM({ prompt, response_json_schema }) {
      const { data, error } = await supabase.functions.invoke("invoke-llm", {
        body: { prompt, response_json_schema },
      });
      if (error) throw error;
      return data;
    },
    async UploadFile({ file }) {
      const uid = await currentUserId();
      if (!uid) throw new Error("Not authenticated");
      const ext = (file.name?.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${uid}/${crypto.randomUUID()}.${ext}`;
      unwrap(
        await supabase.storage.from("avatars").upload(path, file, {
          contentType: file.type || undefined,
          upsert: false,
        }),
      );
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      return { file_url: data.publicUrl };
    },
  },
};

export const base44 = { entities, auth, integrations };
