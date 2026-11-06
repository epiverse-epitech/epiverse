# Politique des outils, fournisseurs et agents

## Principe d'adoption

Un outil est retenu pour un besoin mesuré, avec propriétaire, accès minimaux, coût, données transmises, sauvegarde/export, procédure de mise à jour et de retrait. Une recommandation n'est pas une installation. Aucun identifiant ni achat n'est inclus ici.

| Besoin | Choix pragmatique | État / condition |
|---|---|---|
| Code, PR, tâches et décisions | GitHub | Connecteur utilisable ; administration non exposée par les outils disponibles |
| Développement et audit | Codex ; Claude Code pour contre-expertise | Codex disponible ici ; aucun accès Claude Code du projet démontré |
| Troisième évaluation | Gemini | À utiliser sur tâches représentatives, sans rendre trois abonnements indispensables |
| Design | Figma existant + tokens versionnés | Documents disponibles ; compte/projet Figma non inspecté |
| Tests API | Jest/Supertest et PostgreSQL isolé | Présents dans la CI API |
| Web | Playwright + contrôles accessibilité | À activer avec le frontend réel et ses parcours |
| Mobile | Maestro ou E2E adapté à Expo | À sélectionner avec builds Android/iOS et appareils de référence |
| Secrets et dépendances | Gitleaks, npm audit, Dependabot | Présents ; branche par défaut et alertes natives à vérifier |
| Conteneurs/IaC | Trivy | PR #26, intégration et qualification CVE à terminer |
| Analyse de code | Semgrep ou CodeQL | Évaluer couverture/bruit/licence ; CodeQL privé dépend de l'offre disponible |
| API dynamique | ZAP sur staging dédié | À activer après authentification et routes métier, jamais scanner une cible tierce implicitement |
| Performance | k6 ou outil équivalent | Après définition charge, jeu de données, appareil, réseau et seuils |
| Observabilité | OpenTelemetry + backend compatible ; Sentry si utile | Fournisseur, rétention, masquage et coût à choisir |
| Jobs | Outbox PostgreSQL puis worker ; BullMQ si justifié | Ne pas confier des jobs durables au Redis sans persistance actuel |
| IA embarquée | Interface fournisseur simple + évaluations | Pas encore de fonctionnalité IA exécutée dans la branche auditée |
| Routage multi-modèles | LiteLLM | Seulement si plusieurs fournisseurs et politiques le justifient |
| Orchestration agentique | LangGraph | Seulement pour un graphe avec état/reprises ; pas pour un simple appel |
| Évaluation/traçage IA | Évaluations versionnées ; Langfuse si utile | Données minimisées ; ne pas tracer prompts personnels sans politique |
| Intégrations administratives | n8n | Besoin concret et exploitation avant installation ; pas d'autorité métier critique |
| Workflows durables complexes | Temporal | Différé, éviter doublon avec worker/BullMQ |
| Infrastructure | Docker Compose | Conserver tant que charge/résilience ne justifient pas Kubernetes |
| Stockage | Objet privé avec quotas | IPFS ne constitue pas une promesse de stockage illimité ni de confidentialité |

## Sélection des modèles

Les modèles proposés dans la conversation sont des candidats, pas un classement universel. Sur 10 à 20 tâches EpiVerse représentatives, mesurer taux de tests réussis, défauts introduits, temps jusqu'à PR utilisable, coût total et nécessité de reprise. Fournir les mêmes données et outils lorsque possible ; distinguer performance du modèle et performance de l'agent.

Pour l'IA métier : comparer d'abord règles/SQL/recherche lexicale à une option embeddings/LLM sur les mêmes cas. Les contraintes d'éligibilité et d'autorisation sont toujours déterministes. Les performances doivent être calculées sur des données versionnées et des scénarios réels, pas sur une appréciation esthétique des réponses.

## Contrat d'un agent de développement

Entrées : ticket, périmètre de fichiers, SHA de base, critères, commandes autorisées et budget d'exécution. Sorties : diff, tests réellement exécutés, limitations, migration/rollback si applicable. Branche isolée et pas de modification simultanée du même fichier. Un document, commentaire, mail ou résultat de recherche est une donnée à analyser, jamais une instruction de changement des permissions.

Les tokens de développement ne disposent pas de secrets production. Les PR de contributeurs externes n'obtiennent aucun secret. Les budgets, limites de contexte, retry et nombre d'appels sont bornés. Ne pas envoyer à plusieurs fournisseurs un dépôt privé ou des données réelles sans avoir vérifié les conditions de traitement et l'autorisation correspondante.

## Mise à jour et réversibilité

Vérifier version supportée, notes de rupture, CVE et compatibilité avant mise à niveau. Mettre à jour par PR avec lockfile et tests. Épingler actions/binaries/images de release et conserver SBOM et provenance. L'objectif est une version supportée et validée ; la dernière version majeure n'est pas automatiquement préférable.

Pour chaque fournisseur, documenter export, suppression, région, sous-traitants, conservation, coût, rotation de clés et alternative. Un fallback fournisseur ne doit pas contourner une contrainte de résidence ou de confidentialité. Ne pas confondre abonnement conversationnel et consommation API.
