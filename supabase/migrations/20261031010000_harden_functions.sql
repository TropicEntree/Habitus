-- Fixes from the Supabase security advisor (2026-10-31).
-- Trigger functions run from their triggers; nobody needs to call them via the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_owner() from public, anon, authenticated;
revoke execute on function public.touch_updated_date() from public, anon, authenticated;
-- is_admin() is used inside RLS policies by signed-in users only.
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
-- Pin search_path.
alter function public.touch_updated_date() set search_path = public;
