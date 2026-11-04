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

Ce processus reste une règle d'équipe tant que le forfait GitHub ne permet pas de rendre obligatoires les revues.
