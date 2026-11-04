# EpiVerse — référentiel de réalisation professionnelle

Baseline du 4 novembre 2026. Ce référentiel complète les DOC-001 à DOC-019 et les consignes scolaires ; il ne constitue ni une certification, ni une preuve de production.

## Lecture et exécution

1. [Audit factuel](audit-2026-11-04.md) : état observé, corrections et limites.
2. [Plan de réalisation](plan-de-realisation.md) : produit, organisation, UX, sécurité, exploitation, finances et marché.
3. [Politique outils et IA](outils-et-ia.md) : composants utiles, conditions d'activation, coûts et traitement des données.
4. [Registre des contrôles](controls.json) : responsable fonctionnel, critère d'acceptation, statut, preuve et priorité.
5. [Catalogue des 36 domaines](modules.json) : vision conservée, livraison progressive, dépendances et risques.

Exécuter `python3 scripts/check_programme.py` pour vérifier les registres. Le succès signifie que les registres sont structurés ; il ne signifie pas que les contrôles sont mis en œuvre. Le mode `--release` refuse une livraison si un contrôle bloquant n'a pas de preuve validée. Il est volontairement rouge à cette baseline.

## Statuts et preuve

- `open` : non réalisé ou non démontré.
- `in_progress` : réalisation en cours, non validée.
- `verified` : critère satisfait, preuve datée et révision examinée enregistrées.
- `not_applicable` : justification explicite, limitée au périmètre ; interdit pour un contrôle bloquant.

Une preuve comporte une référence consultable, une date et la révision testée. Un test simulé doit rester désigné comme tel. Une PR ouverte ne prouve pas l'intégration. Une CI verte ne prouve pas l'activation d'une règle GitHub, la conformité, la restaurabilité ou l'adoption du produit.

## Gouvernance documentaire

Estelle est l'interlocutrice de direction du projet dans cette demande. Les documents de juin attribuent aussi une direction opérationnelle à Soumia, en contradiction avec des consignes antérieures. Ce conflit doit être arbitré explicitement avant republication d'un organigramme nominatif. Le registre utilise des rôles fonctionnels pour ne pas transformer cette ambiguïté en nouvelle décision.

Tout changement de périmètre, fournisseur, coût récurrent, données collectées ou niveau de service nécessite une décision datée, ses alternatives, ses conséquences et un responsable. Les 36 domaines constituent une vision, pas 36 engagements simultanés.
