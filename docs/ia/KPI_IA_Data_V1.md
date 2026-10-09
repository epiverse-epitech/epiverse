# KPI IA / Data V1

Proposition de l'équipe Data & IA (Thomas, Lina, Belaid), 08/10/2026.

Périmètre : recommandations construites à partir du profil, des centres d'intérêt, des compétences et de l'activité retenue (EPI-116), sur 7 catégories : stages et mentors (sprint 5), puis événements, écoles, associations, ressources et entreprises (sprint 6, entreprises si confirmées comme distinctes des offres). Rafraîchissement par lots, pas en temps réel (EPI-111). Solution de repli obligatoire pour les nouveaux utilisateurs, les profils incomplets et les pannes (EPI-37).

## 1. Qualité des recommandations (hors ligne, par catégorie)

Référence de comparaison : popularité et correspondance sur les centres d'intérêt.

| KPI | Cible |
|---|---|
| NDCG@10 par rapport à la référence | au moins 15 % de mieux |
| Qualité pour les nouveaux utilisateurs et profils incomplets (NDCG@10) | au moins égale à la référence |
| Couverture du catalogue (part des éléments recommandés au moins une fois) | ≥ 60 % |
| Precision@5, Recall@10, diversité | suivis, sans cible ferme |

## 2. Engagement des étudiants (en ligne)

| KPI | Cible |
|---|---|
| **Part des enregistrements, inscriptions, candidatures et demandes de mentorat issus d'une recommandation** (KPI principal : mesure directement le problème « les étudiants passent à côté des opportunités ») | ≥ 25 % |
| Taux de clic sur les recommandations | ≥ 8 % |
| Taux d'action après recommandation (enregistrer, s'inscrire, candidater, demander un mentor) | ≥ 3 % |
| Part de « j'aime » sur l'ensemble des avis (j'aime + je n'aime pas) | ≥ 70 % |
| Taux de rejet (`dismiss`) | ≤ 15 % |

Sources : `recommendation` (`shown_at`, `clicked_at`, `feedback`) et `user_interaction`.

## 3. Qualité des données

| KPI | Cible |
|---|---|
| Champs obligatoires renseignés dans le catalogue | ≥ 95 % |
| Doublons | ≤ 1 % |
| Éléments expirés (événements passés, offres clôturées) dans les recommandations servies | 0 |
| Délai de prise en compte d'un changement du catalogue | ≤ 24 h |
| Étudiants avec au moins 3 centres d'intérêt et 1 compétence | ≥ 70 % |
| Imports de données réussis | ≥ 99 % |

## 4. Service

| KPI | Cible |
|---|---|
| Étudiants recevant au moins 5 suggestions par catégorie (repli compris) | 100 % |
| Temps de réponse de l'API de recommandation (p95) | ≤ 300 ms |
| Taux d'erreur | ≤ 1 %, avec affichage du repli à chaque erreur |

## 5. Confidentialité et IA responsable

| KPI | Cible |
|---|---|
| Données d'activité supprimées après la durée de conservation (NFR-PRIV-001) | 100 % |
| Recommandations affichant une raison à l'étudiant (`reason`) | ≥ 90 % |
| Évaluation reproductible (jeu de données versionné, graine fixe, `model_version`) | oui |