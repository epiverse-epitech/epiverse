# Contribuer à EpiVerse

- main : versions validées ; develop : intégration ; changements via une branche et une PR.
- Noms de branches : feature/EPI-N-sujet, fix/sujet, docs/sujet.
- Jamais de push direct sur main ou develop et jamais de force-push sur les branches partagées.
- Chaque PR décrit l'exigence, la portée, les risques, les tests et les migrations éventuelles.
- Une revue indépendante ; deux relecteurs pour la sécurité, les droits, les données ou la plateforme (DOC-013).
- Ne jamais fusionner une CI rouge ni déclarer un déploiement réussi lorsqu'il est skipped.
- Ne pas introduire de secrets réels ni de données personnelles dans les commits.
- Migrer d'abord en environnement isolé ; vérifier le rollback et les incompatibilités de schéma.

## Vérification locale API
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

Les règles GitHub de `main` et `develop` doivent rendre ces contrôles obligatoires
(PR, CI verte, revue CODEOWNER, sans force-push ni suppression). Si elles ne sont
pas actives, aucune fusion ni déploiement ne doit être considéré comme approuvé.
