-- Let a signed-in user change only their own display name.
-- The "users" table has no self-update policy on purpose (role/status are admin-only),
-- so this function updates just full_name for auth.uid().
create or replace function public.update_my_name(new_name text)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  clean text := btrim(coalesce(new_name, ''));
  result public.users;
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if char_length(clean) < 1 or char_length(clean) > 60 then
    raise exception 'name must be 1-60 characters' using errcode = '22023';
  end if;

  update public.users
     set full_name = clean
   where id = auth.uid()
  returning * into result;

  return result;
end;
$$;

revoke execute on function public.update_my_name(text) from public, anon;
grant execute on function public.update_my_name(text) to authenticated;
