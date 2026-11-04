# EpiVerse — politique de sécurité

## Signaler une vulnérabilité
- Ne jamais publier de secrets, données personnelles ou détails d'exploitation dans une issue.
- Contacter les responsables du dépôt par un canal privé de l'équipe, ou utiliser **Security → Advisories → Report a vulnerability** si cette fonction est activée.
- Fournir par canal privé : commit, préconditions, reproduction avec données fictives, impact, correctif proposé.
- Les responsables évaluent la sévérité et l'exposition avant toute divulgation.

## Règles
- Aucun secret dans Git, les variables d'exemple, les fixtures, les tests ou les journaux.
- Contrôles d'accès, schémas SQL, infrastructure et CI/CD : deux relecteurs conformément au DOC-013.
- Logs sans informations personnelles ou jetons ; services et identités à privilèges minimaux.
- Vérifier les refus d'accès, les échecs et les erreurs 5xx dans les tests.
- En cas de fuite, révoquer et renouveler les secrets avant tout nettoyage d'historique.

## Conditions d'ouverture du pilote
CI verte, revue indépendante, séparation des secrets et environnements, sauvegardes hors serveur testées, supervision et rollback compatible avec les migrations.

Les paramètres d'organisation (MFA, protection des branches, dépendances, scan de secrets) doivent être audités séparément par les propriétaires GitHub.
