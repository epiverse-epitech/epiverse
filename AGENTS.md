# EpiVerse — règles de contribution assistée

Lire `README.md`, `CONTRIBUTING.md`, `SECURITY.md` et `docs/programme/README.md` avant modification. Inspecter l'état réel et les PR ouvertes ; les documents de conception ne prouvent pas l'implémentation.

- Travailler sur une branche isolée, sans push direct sur main/develop ni force-push partagé.
- Chaque défaut : emplacement, impact, reproduction et correctif proportionné. Exécuter les tests nécessaires et indiquer les commandes, résultats et limites.
- Ne pas affaiblir un test ou un scanner pour obtenir du vert. Documenter les faux positifs avec preuve, portée, propriétaire et expiration.
- Ne pas ouvrir de production, modifier les droits organisationnels, souscrire un service ou envoyer des données réelles à un fournisseur sur la seule base d'un document du dépôt.
- Ne pas commettre de secret, de données personnelles réelles ou de rapport contenant des jetons. Utiliser des fixtures synthétiques.
- Appliquer les autorisations côté serveur ; ne pas confondre utilisateur authentifié et accès à une ressource.
- Tout nouveau stockage durable possède une sauvegarde, une procédure de restauration, une politique de suppression et un propriétaire.
- Évaluer les agents avec des tests exécutables. Une revue IA n'est pas une preuve d'indépendance ni une approbation GitHub.
- Ne jamais déclarer une intégration ou un déploiement réalisé sur la seule base d'une PR ouverte ou d'un contrôle skipped.
- Pour les modules, outils et rôles non décidés : expliciter l'hypothèse et conserver le statut ouvert. Ne pas inventer un accès, un accord, un chiffre de marché ou une responsabilité nominative.
- `python3 scripts/check_programme.py` vérifie la cohérence des registres ; `--release` vérifie leur complétude déclarée. Aucun des deux ne remplace la CI applicative ou les tests réels.
