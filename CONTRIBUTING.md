# Contribuer à EpiVerse — règles simples

La source officielle est **GitHub** (code, travail, décisions, preuves). **Teams** sert à échanger et organiser les réunions. Jira et Notion ne sont plus les outils du projet.

## Pour chaque tâche
1. Ouvrir une [issue](https://github.com/epiverse-epitech/epiverse/issues) et lire l'objectif, le responsable, l'estimation en **heures**, les dépendances et le risque.
2. Partir de `develop` dans une branche `feature/numero-sujet`, `fix/sujet` ou `docs/sujet`.
3. Faire le travail, ajouter les tests et vérifier que la fonctionnalité peut être montrée.
4. Ouvrir une **PR vers develop**, relier l'issue, demander une revue à une autre personne.
5. Corriger les retours, faire passer la CI, fusionner.
6. Dans l'issue, renseigner **heures réellement passées**, **reste réestimé**, risques et preuves ; vérifier la [DoD](docs/pilotage/DoD.md).

## Règles obligatoires
- Pas de push direct sur `main` ou `develop`, pas de force-push sur des branches partagées.
- Au moins une relecture indépendante. Pour auth, droits, sécurité, données, déploiement : deux avis selon criticité.
- Ne jamais traiter un job **skipped** comme une exécution de test réussie.
- Aucune donnée personnelle réelle ni secret dans Git, encore plus depuis le passage en **dépôt public**.
- Si le déploiement, une migration ou un script peut supprimer des données : tester en isolation et préparer un retour arrière.
- **Philimon** est lead frontend ; **Thomas** lead Data/IA ; **Soumia** design ; **Ousmane** DevOps ; **Estelle** cheffe de projet.

## Vérifier l'API localement
```bash
docker compose up -d postgres redis
cd apps/api
npm ci
npm run lint
npm run test
npm run test:e2e
npm run build
npm audit --omit=dev --audit-level=high
```

Les contrôles de protection GitHub doivent être vérifiés dans les paramètres du dépôt. Le fichier CODEOWNERS seul ne bloque pas un merge.

## Où trouver les informations
- [Guide de suivi](docs/pilotage/README.md)
- [Équipe et responsabilités](docs/pilotage/equipe.md)
- [Quality gates / DoD](docs/pilotage/DoD.md)
- [Planning et jalons](docs/pilotage/jalons.md)
- [Registre des risques](docs/pilotage/risques.md)
