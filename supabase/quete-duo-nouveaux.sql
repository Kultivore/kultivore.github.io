-- ============================================================
-- KULTIVO — QUÊTE EN DUO : PAS DE QUÊTE LA SEMAINE OÙ LE COMPTE EST CRÉÉ (2026-11-15) — à lancer UNE fois
-- (peut être relancé sans risque : il remplace la fonction quest_join de quete-duo-objectif.sql)
-- • Un compte créé cette semaine (heure de Paris) ne rejoint pas la quête : sa 1re quête commence le lundi suivant.
-- • Il ne peut pas non plus être choisi comme partenaire par un ami avant ce lundi.
-- Le reste ne change pas : 1) un ami libre qui a joué cette semaine ou la précédente, 2) un joueur qui attend,
-- 3) personne : on attend, et Kulti devient partenaire au bout de 24 h.
-- ============================================================

create or replace function public.quest_join() returns setof public.quests
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  wk date := date_trunc('week', now() at time zone 'Europe/Paris')::date;
  q public.quests;
  mate uuid;
begin
  if me is null then return; end if;
  -- compte créé cette semaine : pas de quête avant lundi prochain
  if exists (select 1 from auth.users u where u.id = me and (u.created_at at time zone 'Europe/Paris')::date >= wk) then return; end if;
  perform pg_advisory_xact_lock(hashtext('kultivo-quest-' || wk::text));

  select * into q from public.quests where week = wk and (a = me or b = me);
  if found then
    if q.b is null and not q.kulti and q.created_at < now() - interval '24 hours' then
      update public.quests set kulti = true, goal = public.quest_goal(q.a, null, wk) where id = q.id returning * into q;
    end if;
    return next q; return;
  end if;

  -- 1) un ami libre, qui a joué cette semaine ou la semaine d'avant, et dont le compte date d'avant cette semaine
  select f.uid into mate
  from (select case when requester = me then addressee else requester end as uid
        from public.friendships where status = 'accepted' and me in (requester, addressee)) f
  join public.scores s on s.user_id = f.uid
  join auth.users u on u.id = f.uid
  where not exists (select 1 from public.quests x where x.week = wk and (x.a = f.uid or x.b = f.uid))
    and ((s.week >= wk - 7 and s.week_xp > 0) or (s.prev_week >= wk - 7 and s.prev_week_xp > 0))
    and (u.created_at at time zone 'Europe/Paris')::date < wk
  order by random() limit 1;
  if mate is not null then
    insert into public.quests (week, a, b, goal) values (wk, me, mate, public.quest_goal(me, mate, wk)) returning * into q;
    return next q; return;
  end if;

  -- 2) un joueur qui attend déjà un partenaire
  select * into q from public.quests
  where week = wk and b is null and not kulti and a <> me
  order by created_at limit 1;
  if found then
    update public.quests set b = me, goal = public.quest_goal(q.a, me, wk) where id = q.id returning * into q;
    return next q; return;
  end if;

  -- 3) personne : on attend
  insert into public.quests (week, a, goal) values (wk, me, public.quest_goal(me, null, wk)) returning * into q;
  return next q;
end $$;

revoke all on function public.quest_join() from public, anon;
grant execute on function public.quest_join() to authenticated;
