-- ============================================================
-- KULTIVO — protections contre la triche (17/11/2026)
-- À LANCER UNE FOIS dans Supabase → SQL Editor (après classement.sql et defi-du-jour.sql).
--
-- 1) server_now() : le jeu demande la VRAIE heure au lancement. Si l'heure du téléphone est fausse (avancée pour
--    recharger les gouttes, jouer le défi du jour de demain, gonfler la série…), le jeu utilise la bonne heure.
-- 2) Garde-fous sur la table des scores (classement des amis, podium du lundi, défi du jour). Un tricheur qui envoie
--    de faux chiffres directement à Supabase (sans passer par le jeu) est freiné. Les joueurs normaux ne voient rien :
--    les valeurs fausses sont corrigées en silence (pas d'erreur, pour ne jamais bloquer une vraie sauvegarde).
-- ============================================================

-- 1) L'heure du serveur (lisible par tout le monde, même sans compte : ce n'est qu'une heure)
create or replace function public.server_now()
returns timestamptz
language sql
stable
as $$ select now() $$;
revoke all on function public.server_now() from public;
grant execute on function public.server_now() to anon, authenticated;

-- 2) Défi du jour : heure du premier score du jour (le score ne peut plus changer 20 minutes après)
alter table public.scores add column if not exists daily_at timestamptz;

create or replace function public.scores_guard()
returns trigger
language plpgsql
as $$
declare
  today date := (now() at time zone 'Europe/Paris')::date;
begin
  -- Semaine dans le futur : impossible
  if new.week > today + 1 then
    if tg_op = 'UPDATE' then
      new.week := old.week; new.week_xp := old.week_xp; new.prev_week := old.prev_week; new.prev_week_xp := old.prev_week_xp;
    else
      raise exception 'Semaine dans le futur';
    end if;
  end if;

  if tg_op = 'INSERT' then
    -- Un tout nouveau joueur (pas une mise à jour déguisée en « upsert ») : semaine d'avant plafonnée
    if not exists (select 1 from public.scores s where s.user_id = new.user_id) then
      new.prev_week_xp := least(new.prev_week_xp, 5000);
    end if;
  else
    if new.week < old.week then
      -- Retour en arrière (horloge reculée) : on garde la semaine connue
      new.week := old.week; new.week_xp := old.week_xp; new.prev_week := old.prev_week; new.prev_week_xp := old.prev_week_xp;
    elsif new.week = old.week then
      -- Même semaine : les XP de la semaine d'avant (qui décident du podium) ne bougent plus
      new.prev_week := old.prev_week;
      new.prev_week_xp := old.prev_week_xp;
    elsif old.week = new.week - 7 then
      -- Nouvelle semaine : la semaine d'avant = ce qui était connu, + une marge pour les dernières parties pas encore envoyées
      new.prev_week_xp := least(new.prev_week_xp, old.week_xp + 1500);
    else
      -- Plusieurs semaines sans rien envoyer : semaine d'avant plafonnée
      new.prev_week_xp := least(new.prev_week_xp, 3000);
    end if;
  end if;

  -- Défi du jour : seulement aujourd'hui (± 1 jour pour les fuseaux horaires), et figé 20 minutes après le 1er score du jour
  if new.daily_day is not null and (new.daily_day > today + 1 or new.daily_day < today - 1) then
    if tg_op = 'UPDATE' then
      new.daily_day := old.daily_day; new.daily_score := old.daily_score; new.daily_seconds := old.daily_seconds; new.daily_at := old.daily_at;
    else
      new.daily_day := null; new.daily_score := null; new.daily_seconds := null;
    end if;
  end if;
  if new.daily_day is not null then
    if tg_op = 'UPDATE' and new.daily_day is not distinct from old.daily_day and old.daily_at is not null then
      new.daily_at := old.daily_at;
      if now() - old.daily_at > interval '20 minutes' then
        new.daily_score := old.daily_score;
        new.daily_seconds := old.daily_seconds;
      end if;
    elsif tg_op = 'INSERT' or new.daily_day is distinct from old.daily_day or old.daily_at is null then
      new.daily_at := now();
    end if;
    -- 10 questions : au moins 2 secondes par bonne réponse
    if new.daily_score is not null and new.daily_seconds is not null and new.daily_seconds < new.daily_score * 2 then
      new.daily_seconds := new.daily_score * 2;
    end if;
  end if;

  return new;
end $$;

drop trigger if exists scores_guard on public.scores;
create trigger scores_guard before insert or update on public.scores
  for each row execute function public.scores_guard();
