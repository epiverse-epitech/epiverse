# EpiVerse — politique de sécurité

## Signaler une vulnérabilité
- Ne jamais publier de secrets, données personnelles ou détails d'exploitation dans une issue.
- Le dépôt EpiVerse est **privé** : les GitHub Security Advisories et le formulaire de signalement privé sont réservés aux dépôts publics. GitHub ne propose pas de messages privés entre comptes. Transmettre le signalement à **@estellegiroud** ou **@bayeousmane1** via un canal privé de l'équipe préalablement convenu (messagerie professionnelle chiffrée ou autre canal interne sécurisé).
- Si le canal sécurisé n'est pas connu, demander uniquement les coordonnées du contact sécurité dans une issue **sans aucun détail sensible**, puis transmettre les preuves en privé. Ne pas publier de secret, preuve d'exploitation ou donnée personnelle.
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

Les paramètres d'organisation (MFA, protection des branches, dépendances, scan de secrets) doivent être audités séparément par les propriétaires GitHub. Les branches `main` et `develop` doivent être protégées avant toute fusion : PR obligatoire, contrôles CI requis, revue CODEOWNER requise, force-push et suppression interdits.
