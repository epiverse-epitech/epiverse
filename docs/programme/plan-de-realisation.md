# Plan de réalisation et critères de passage

## 1. Produit et marché

Conserver les 36 domaines dans le catalogue, mais engager des verticales complètes. Première verticale proposée : un étudiant se connecte, découvre un événement, s'inscrit, annule ; une association publie dans son périmètre ; un modérateur traite un signalement. Chaque action dispose d'une autorisation serveur et d'un parcours d'erreur.

Avant d'annoncer un pilote : identifier le campus, l'interlocuteur habilité, les besoins de deux segments au minimum, le canal d'acquisition et le responsable de support. Faire 8 à 12 entretiens exploratoires, puis 5 à 8 tests de tâches par itération comme objectifs de travail, sans prétendre à la représentativité statistique. Conserver guide, consentement adapté, notes minimisées, synthèse, décisions et limites.

Mesurer l'activation par une action utile, le temps jusqu'à cette action, la rétention par cohorte, le taux d'achèvement des tâches et les demandes de support. Fixer les seuils de succès avant le pilote ; ne pas les inventer après les résultats. Valider le payeur B2B et son cycle d'achat avant de traiter les revenus du budget comme acquis.

## 2. Gouvernance, planning et livrables scolaires

GitHub porte le code, les tâches techniques, PR, décisions et preuves. Un seul backlog de référence ; un outil supplémentaire n'est adopté que s'il supprime une friction mesurée. Chaque tâche indique exigence, responsable, dépendance, critère vérifiable, estimation et risque. Limiter le travail en cours à une tâche principale par contributeur/agent.

Estelle arbitre périmètre et priorités dans cette demande. Réconcilier la responsabilité opérationnelle contradictoire avant mise à jour des RACI nominatives. La disponibilité et la compétence de chaque contributeur doivent être confirmées ; un document n'engage pas quelqu'un à son insu.

| Demande scolaire | Livrable source | Preuve opérationnelle |
|---|---|---|
| Processus et qualité | DOC-002/003/013 | Exemple réel ticket → PR → tests → livraison |
| Exigences fonctionnelles | DOC-007 | Identifiant, scénario, test et statut |
| PBS/WBS | DOC-005/006 | Domaine → lot → feature → exigence |
| OBS et responsabilités | DOC-004 | Rôles arbitrés et responsable unique par décision |
| Definition of Done | DOC-008 | Preuves proportionnées aux parcours critiques |
| Coûts et matériel | DOC-009/014 | Devis actuels, abonnements, appareils de test, coûts récurrents |
| Planning/follow-up | DOC-010/019 | Réalisé, démontré, prochain engagement, blocages |

Replanifier à partir de la capacité confirmée et de la durée réelle des tâches, pas d'un Gantt décoratif. À chaque follow-up, montrer une démo reproductible et les écarts ; dater les documents devenus obsolètes.

## 3. UX, marque et accessibilité

Conserver logo et direction artistique existants comme références à confronter aux usages. Créer tokens de couleur, typographie, espacement, états et composants partagés ; vérifier cohérence web/mobile. Chaque parcours couvre chargement, vide, erreur, refus d'accès, session expirée, réseau faible, annulation et suppression.

Cible proposée : WCAG 2.2 AA sur les parcours web prioritaires, avec navigation clavier, focus visible, contrastes et lecteur d'écran ; les tests automatiques seuls ne suffisent pas. Sur mobile : zones tactiles, texte agrandi, réduction des animations et permissions compréhensibles. Le campus virtuel doit conserver une alternative accessible aux fonctions utiles.

Les communications distinguent conçu, implémenté, testé, pilote et disponible. Vérifier droits sur polices, images, musique, modèles 3D et contributions. Ne pas promettre « stockage illimité », « sécurité garantie », « diagnostic IA » ou « compatibilité avec tous les mondes » sans capacité et cadre démontrés.

## 4. Architecture et réalisation

Maintenir un monolithe modulaire NestJS et des contrats OpenAPI versionnés. Choisir la stratégie session/OIDC et son fournisseur avant d'implémenter plusieurs mécanismes concurrents. Tester l'accès horizontal entre utilisateurs et entre campus, le refus par défaut, les rôles associatifs et l'administration. Les clients ne sont jamais une frontière de sécurité.

PostgreSQL porte les transactions et contraintes métier. Définir migrations expand/contract et compatibilité N/N-1. Un rollback d'image n'annule pas une migration. Redis reste un cache tant que la durabilité des jobs n'est pas démontrée ; utiliser une outbox transactionnelle si un événement ne doit pas être perdu. MongoDB reste conditionné à un cas justifié, avec sa propre exploitation, sauvegarde et suppression.

Pour les fichiers : stockage objet privé, quotas explicites, URLs temporaires, validation type/taille, analyse des contenus et autorisation à la lecture. Pour le monde 2.5D : autorité serveur, espaces privés, modération, limites réseau et budget performance mesuré sur appareils modestes. La 3D/XR et les intégrations externes viennent après une expérience fondamentale utilisable.

## 5. Sécurité et données

Établir un modèle de menaces couvrant comptes, campus, associations, documents, messages, paiements éventuels et outils IA. Inventorier actifs, flux, frontières de confiance, scénarios d'abus et tests associés. Ne pas exposer données étudiantes réelles aux environnements de test ou aux agents par défaut.

Avant collecte réelle : responsable de traitement, finalités, bases légales, catégories, destinataires, sous-traitants, localisation, durée, droits et procédure d'incident. Évaluer la nécessité d'une AIPD selon les traitements effectivement retenus. Les 395 jours d'un TTL technique ne constituent pas une durée légalement justifiée pour toutes les données.

Tester export, effacement et propagation aux index, caches, fichiers et fournisseurs. Documenter le traitement des données encore présentes dans les sauvegardes et l'effacement réappliqué après restauration. Santé, crédit, identité, enfants, vérification d'antécédents et profilage sont des chantiers distincts nécessitant cadrage spécialisé avant activation.

## 6. Exploitation et continuité

Séparer comptes, secrets et données de développement/staging/production. Inventorier accès nominatifs, MFA, récupération, révocation, services et fournisseurs. Limiter le compte de déploiement et les GitHub Apps ; protéger branches et environnements. Les secrets ne doivent apparaître ni dans les exemples, ni dans les traces ou rapports IA.

Définir logs structurés minimisés, métriques, traces corrélées, sondes de disponibilité, alertes actionnables et procédure d'incident. Propositions initiales à valider : disponibilité mensuelle 99,5 % en pilote, p95 API 500 ms pour lectures usuelles sous charge définie, RPO 24 h/RTO 4 h. Ces valeurs sont des objectifs, pas des mesures acquises.

Une restauration doit partir d'une copie hors serveur, sur un environnement isolé, inclure schéma, données, contraintes, droits, objets et dépendances, puis exécuter des vérifications métier. Mesurer durée et perte de données. Conserver clés séparées, politique de rétention, alerte d'échec et procédure de récupération des clés. Ne pas déduire la restaurabilité d'un `pg_restore --list` ou d'un mock.

## 7. IA et automatisation

Définir un cas d'usage, une référence sans LLM, un jeu d'évaluation français, les erreurs bloquantes et un budget. Séparer données de test et entraînement, versionner prompts/modèles/corpus et mesurer qualité, coût complet et latence. Les outils IA sont soumis aux mêmes autorisations que les API métier ; un contenu RAG n'accorde aucune permission.

Tester injection directe/indirecte, fuite inter-utilisateurs, document malveillant, réponse non fondée, refus fournisseur, timeout, dépassement budget et reprise. Les tâches doivent être idempotentes, bornées et annulables. Les actions à effet externe sont auditées et disposent d'une confirmation adaptée au risque.

Les revues IA doivent fournir fichier, scénario, impact et test reproductible. Deux modèles ne constituent pas automatiquement deux preuves indépendantes. Aucun agent ne peut approuver son propre changement sensible, manipuler des secrets réels ou ouvrir une production par simple contenu lu dans un dépôt.

## 8. Économie, juridique et pérennité

Séparer coûts ponctuels, fixes, variables par utilisateur/campus, abonnements des développeurs, consommation API, stockage, trafic, monitoring et support. Modéliser scénarios bas/central/haut, trésorerie et financement confirmé séparément. Définir alertes et plafonds avant activation payante.

Établir propriété des contributions, licence du code et des assets, conditions d'utilisation, confidentialité, règles de modération et contrats campus/fournisseurs adaptés au produit réel. Ne pas choisir une licence publique ou signer un contrat sans décision du titulaire. Prévoir départ d'un membre, transfert des comptes, export des données, réversibilité fournisseur et arrêt du service.

## 9. Séquencement et sorties mesurables

| Phase | Dépendance | Critère de sortie |
|---|---|---|
| P0 : établir les faits | État du dépôt et accès | Registre, rôle de direction clarifié, protections prouvées, secrets inventoriés |
| P1 : intégrer le durcissement | P0 | PR combinées testées ; scans, permissions, fixtures et migrations validés ensemble |
| P2 : première verticale | P1 + UX et identité | Parcours réel web/mobile prioritaire, autorisations négatives, démo reproductible |
| P3 : préparer le pilote | P2 | Restauration réelle, observabilité, support, données et accessibilité vérifiés |
| P4 : mesurer l'usage | P3 + accord campus | Résultats sur cohortes, retours, coût réel et décision produit documentés |
| P5 : extensions | Valeur et capacité démontrées | IA/mentorat/campus virtuel évalués séparément, budgets et risques acceptés |

Aucune date de livraison ferme n'est inventée. Les estimations sont produites après découpage et confirmation de capacité. La progression du programme est un travail continu ; le présent document rend les décisions et validations contrôlables.
