# E-mails de Kultivo (Supabase)

Modèles en français, prêts à coller dans **Supabase → Authentication → Emails** (onglet « Templates »).

| Fichier | Modèle Supabase | Objet à mettre |
|---|---|---|
| `mot-de-passe-oublie.html` | Reset Password | 🔑 Ton nouveau mot de passe Kultivo |
| `changement-adresse.html` | Change Email Address | ✉️ Confirme ta nouvelle adresse Kultivo |
| `bienvenue-confirmation.html` | Confirm signup | 🧠 Bienvenue sur Kultivo ! (inutile tant que « Confirm email » est désactivé) |

Pour chaque modèle : coller l'objet dans « Subject », puis tout le contenu du fichier dans « Message body » (le commentaire
`<!-- … -->` du début peut rester, il ne s'affiche pas), puis « Save ».

## Envoi des e-mails (à faire quand l'adresse appkultivo@gmail.com est créée)

Sans ça, Supabase n'envoie qu'environ 2 e-mails par heure et seulement aux membres du projet : « Mot de passe oublié »
ne marche pas pour les joueurs.

1. Compte Google appkultivo → Sécurité → activer la **validation en 2 étapes**.
2. Toujours dans Sécurité → **Mots de passe des applications** → créer « Supabase » → noter le code de 16 lettres.
3. Supabase → Authentication → Emails → **SMTP Settings** → Enable custom SMTP :
   - Sender email : `appkultivo@gmail.com`
   - Sender name : `Kultivo`
   - Host : `smtp.gmail.com`
   - Port : `465`
   - Username : `appkultivo@gmail.com`
   - Password : le code de 16 lettres
4. Authentication → **Rate Limits** : monter « emails sent per hour » (par ex. 30).
5. Tester : dans le jeu, « Se connecter » → « Mot de passe oublié ? » avec l'adresse d'un compte existant.
