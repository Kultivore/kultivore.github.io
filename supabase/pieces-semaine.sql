-- ============================================================
-- KULTIVO — Pièces gagnées par joueur sur les 7 derniers jours (17/11/2026)
-- À coller dans Supabase → SQL Editor → Run. Lecture seule : ne modifie rien.
-- ============================================================

-- REQUÊTE 1 — DÈS AUJOURD'HUI (estimation) : XP gagnée sur 7 jours, pièces estimées (1 🪙 pour 8 XP),
-- et solde de pièces aujourd'hui comparé à celui d'il y a 7 jours (copie la plus ancienne de saves_history).
-- « solde_change » = pièces gagnées MOINS pièces dépensées : il sous-estime ceux qui ont acheté des choses.
select
  s.pseudo,
  (select coalesce(round(sum(value::numeric)), 0) from jsonb_each_text(s.data->'activeDays')
     where key >= to_char((now() at time zone 'Europe/Paris')::date - 6, 'YYYY-MM-DD'))      as xp_7_jours,
  (select coalesce(round(sum(value::numeric)), 0) from jsonb_each_text(s.data->'activeDays')
     where key >= to_char((now() at time zone 'Europe/Paris')::date - 6, 'YYYY-MM-DD')) / 8 as pieces_xp_estimees,
  s.coins                                                                                    as pieces_aujourdhui,
  s.coins - (select round((h.data->>'coins')::numeric) from public.saves_history h
             where h.user_id = s.user_id order by h.day asc limit 1)                         as solde_change
from public.saves s
order by xp_7_jours desc;

-- REQUÊTE 2 — PRÉCISE, à partir du 24/11 environ : le jeu note maintenant chaque jour les pièces gagnées (w) et
-- dépensées (s) dans la sauvegarde (coinLog, depuis le 17/11). Plus il y a de jours notés, plus c'est juste.
select
  s.pseudo,
  sum((l.value->>'w')::numeric) as pieces_gagnees_7_jours,
  sum((l.value->>'s')::numeric) as pieces_depensees_7_jours,
  count(*)                  as jours_notes
from public.saves s
cross join lateral jsonb_each(coalesce(s.data->'coinLog', '{}'::jsonb)) l
where l.key >= to_char((now() at time zone 'Europe/Paris')::date - 6, 'YYYY-MM-DD')
group by s.pseudo
order by pieces_gagnees_7_jours desc;
