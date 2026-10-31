-- Per-user daily limit for AI calls, so one account cannot run up the API bill.
create table public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default current_date,
  calls integer not null default 0,
  primary key (user_id, day)
);

-- RLS on with no policies: the table is reachable only through the function below.
alter table public.ai_usage enable row level security;

-- Counts one call for the signed-in user. Returns false once the limit is reached.
create or replace function public.consume_ai_quota()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  daily_limit constant integer := 30;
  used integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  insert into public.ai_usage (user_id, day, calls)
  values (auth.uid(), current_date, 1)
  on conflict (user_id, day) do update
    set calls = public.ai_usage.calls + 1
    where public.ai_usage.calls < daily_limit
  returning calls into used;

  return used is not null;
end;
$$;

revoke execute on function public.consume_ai_quota() from public, anon;
grant execute on function public.consume_ai_quota() to authenticated;

-- Flagged by the Supabase performance advisor.
create index if not exists habit_logs_habit_id_idx on public.habit_logs (habit_id);
