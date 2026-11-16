-- ============================================================
-- KULTIVO — suppression de son compte par le joueur (16/11/2026, exigé par Google Play)
-- À LANCER UNE FOIS dans Supabase → SQL Editor.
--
-- Le joueur appelle delete_my_account() depuis l'appli (Profil → Mon compte → Supprimer mon compte).
-- Supprimer la ligne de auth.users efface en cascade TOUT ce qui lui appartient : sauvegarde (saves), historique
-- (saves_history), pseudo (profiles), scores, amitiés, duels, quêtes, cadeaux en attente (toutes ces tables ont
-- « on delete cascade »). Les signalements et les statistiques sont anonymes : rien à effacer.
-- Quête entre duo : son partenaire ne perd pas sa quête de la semaine, Kulti prend la place du joueur supprimé.
-- ============================================================

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  me uuid := auth.uid();
begin
  if me is null then
    raise exception 'Pas connecté';
  end if;

  -- Quêtes entre duo : le partenaire garde sa quête, avec Kulti à la place
  if to_regclass('public.quests') is not null then
    update public.quests set b = null, kulti = true where b = me;
    update public.quests set a = b, a_xp = b_xp, b = null, b_xp = 0, kulti = true
      where a = me and b is not null;
  end if;

  delete from auth.users where id = me;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
