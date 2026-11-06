# Plan de réalisation et critères de passage

## Échéance et périmètre de semestre — arbitrage utilisateur

Échéance : **Defense ESP du 5 février 2027**, selon le calendrier fourni par Estelle. Livraison visée : **version complète en préproduction, démontrable et testée**, sans ouverture publique ni mise en production impliquée.

Obligatoire : les quatre parcours, navigateurs ordinateur/mobile, gestion multicampus et vérification étudiante, cible de 50 sessions simultanées, texte/audio/vidéo de proximité, avatars, chambres et espaces associatifs aménageables, catalogue et images personnelles contrôlées. Les imports de modèles 3D personnels passent explicitement en bonus au semestre suivant. Les obligations scolaires restent à rapprocher du rubric ; ce périmètre produit ne les remplace pas.

La préproduction utilise des données synthétiques et des comptes de test ; toute invitation de personnes réelles exige les contrôles de données et d'accès adaptés. La vérification étudiante peut être démontrée par un scénario contrôlé, sans prétendre qu'un SSO institutionnel indisponible est intégré.

### Calendrier scolaire communiqué

| Activité | Date ou fenêtre |
|---|---|
| Kick-off ESP | 11 septembre 2026 |
| T-LAW séminaire | 11 septembre au 27 novembre 2026 |
| T-LAW rapport et keynote | 5 octobre au 18 décembre 2026 |
| Follow-up 1 ESP | 9 octobre 2026 |
| Follow-up 2 ESP | 13 novembre 2026 |
| Follow-up 3 ESP | 18 décembre 2026 au 8 janvier 2027 ; créneau exact non communiqué |
| Defense ESP | 5 février 2027 |

### Rétroplanning proposé, capacité à confirmer

| Jalon | Sortie attendue |
|---|---|
| 13 novembre 2026 — follow-up 2 | Périmètre et backlog vérifiables, état honnête des PR et protections, architecture des quatre parcours, première démonstration disponible sans fonctionnalité inventée |
| 27 novembre 2026 — jalon interne | Identité et droits multicampus, base frontend et événements/inscriptions utilisables ; prototype média et monde pour lever les risques techniques tôt |
| 18 décembre 2026 — début de fenêtre follow-up 3 | Profils/projets/entraide, ressources/mentorat et campus intégrés dans une première version ; état des lacunes et preuves ; échéance T-LAW traitée séparément |
| 8 janvier 2027 — gel fonctionnel proposé | Les quatre parcours et options obligatoires sont implémentés ; pas de nouvel ajout fonctionnel non indispensable |
| 22 janvier 2027 — version candidate | Régression E2E, droits négatifs, tests de charge et appareils, restauration réelle isolée, documentation et preuves ; aucun défaut critique ouvert |
| 29 janvier 2027 — répétition générale | Version identifiée et déployée en préproduction, scénario de démonstration complet, comptes prêts, solution de secours et livrables alignés |
| 5 février 2027 — soutenance | Démonstration de la version validée et présentation honnête des preuves et limites |

Les jalons internes sont proposés et ne constituent pas une garantie de faisabilité. Prévoir l'alternance, T-LAW, congés et disponibilité réelle. Tout glissement doit déclencher un arbitrage explicite du périmètre, sans sacrifier les contrôles d'accès, l'intégrité des données ou les tests critiques. Le semestre suivant vise les bonus ; maintenance, vulnérabilités nouvelles et régressions resteront à traiter.

### Organisation hebdomadaire — capacité collective confirmée

Estelle confirme que toute l'équipe participe avec une répartition hebdomadaire suivie. Cela confirme le mode d'organisation, pas un volume d'heures : les disponibilités individuelles, congés et affectations restent à renseigner. Estelle dirige et arbitre ; Soumia intervient au frontend sans rôle de direction.

Organisation proposée :
- Début de semaine : chaque membre déclare sa capacité disponible, choisit un engagement principal avec résultat testable, estimation et dépendances ; Estelle arbitre les priorités.
- Milieu de semaine : vérifier les blocages et l'intégration. Tout blocage de plus d'un jour ouvré est signalé avec cause, tentative et besoin concret.
- Fin de semaine : démonstration, PR et tests associés, mise à jour des documents concernés. Un travail non intégré reste distinct d'un livrable terminé.
- Une tâche principale en cours par personne ; sous-tâches possibles, pas d'accumulation de chantiers. Les agents IA assistent sur des branches et tâches délimitées, sans être comptés comme des personnes à temps plein.
- Réserver initialement 25 % de la capacité déclarée à intégration, tests, revue, documentation et imprévus ; ajuster selon les observations des deux premières semaines. Il s'agit d'une hypothèse de planification.
- Comparer chaque semaine engagements et résultats validés, puis réestimer le reste ; aucune réduction silencieuse du périmètre ou des critères de sécurité.

| Lot de travail | Sortie vérifiable | Dépendances |
|---|---|---|
| Produit, UX et livrables | Parcours, critères et documents scolaires cohérents ; arbitrage Estelle | Exigences scolaires et périmètre décidé |
| Frontend et parcours web/mobile | Écrans connectés à l'API, états d'erreur et tests de parcours | Contrats API et composants partagés |
| API, identité et droits | Comptes, appartenance multicampus, autorisations et transactions testés | Modèle de données et politique de vérification |
| Campus et médias | Monde, aménagements persistants, texte/audio/vidéo et reconnexion | Identité, accès et transport média |
| Données et ressources | Migrations, fixtures, stockage d'images, mentorat et suppression | Droits et stockage privé |
| Infrastructure, sécurité et qualité | CI, préproduction, scans, charge et restauration prouvés | Versions intégrées et accès effectifs |

Ces lots ne créent pas six équipes obligatoires : les responsabilités sont réparties selon les personnes réellement disponibles. Chaque lot doit avoir un responsable nommé avant engagement ; ne pas inventer une affectation depuis un ancien document.

Modèle de suivi à remplir dans le backlog existant :
| Semaine | Personne | Heures disponibles | Livrable principal / ticket | Critère d'acceptation | Dépendance | PR / preuve | Résultat et reste |
|---|---|---:|---|---|---|---|---|
| À renseigner | À confirmer | À déclarer | Un résultat démontrable | Test ou scénario précis | Blocage identifié | Lien après exécution | Terminé / partiel / bloqué |

Priorité de la première semaine : consolider l'état réel des PR, rapprocher les exigences scolaires des quatre parcours, nommer les responsables et fournir une petite verticale exécutable. Le prototype monde + audio/vidéo démarre tôt pour vérifier les risques mobiles avant de multiplier les écrans.

### Définition de terminé pour la soutenance

- Quatre parcours exécutés de bout en bout sur la révision livrée, données persistantes et scénarios d'erreur testés.
- CI applicable réussie, aucun contrôle requis évité ; traces des tests de sécurité et limites connues.
- Autorisations testées entre utilisateurs, campus, associations et espaces ; médias révocables et imports d'images contrôlés.
- Déploiement préproduction reproductible, secrets séparés, supervision, sauvegarde et restauration réellement éprouvées.
- Matrice navigateur/appareil, charge 50 sessions et qualité des médias documentées ; objectifs non atteints explicitement signalés.
- Documentation utilisateur, exploitation, architecture, coûts et livrables scolaires cohérents ; démonstration répétée et preuves référencées.
- Aucun statut « livré » déduit d'une documentation, d'une PR ouverte ou d'un mock.

## Décisions produit — 4 novembre 2026

Choix explicites de la porteuse du projet :
- Budget mensuel : à établir après chiffrage ; aucun plafond ni achat autorisé par cette décision.
- Première version testable : les quatre parcours profils/projets/entraide, campus virtuel/avatars, événements/inscriptions, ressources/mentorat sont inclus.
- Supports : navigateur sur ordinateur et mobile d'abord. Les applications distribuées dans les stores ne sont pas un prérequis de cette version.
- Direction unique : Estelle. Soumia intervient au frontend, sans rôle de direction.

La livraison des quatre parcours peut être incrémentale, mais une démonstration d'un seul parcours ne valide pas la première version complète. Tous restent à réaliser et à éprouver ; cette décision n'atteste aucune fonctionnalité livrée. Le catalogue est aligné sur ces parcours ; le stade mvp vise uniquement leur périmètre décrit, pas toutes les fonctions de la vision à 36 domaines.

Critères proposés pour découper les parcours :
| Parcours | Démonstration attendue |
|---|---|
| Profils, projets, entraide | Éditer son profil, publier un projet, demander et proposer une aide ; visibilité et modifications autorisées côté serveur |
| Événements, inscriptions | Publier, consulter, s'inscrire et annuler ; capacité contrôlée, absence de double inscription |
| Ressources, mentorat | Partager une ressource autorisée, trouver un mentor, envoyer puis accepter/refuser une demande |
| Campus, avatars | Entrer dans un espace, personnaliser son avatar et interagir ; reconnexion, contrôle des accès et alternative accessible |

### Campus : décisions confirmées

- Cible du premier pilote : jusqu'à 50 personnes simultanées. Hypothèse de dimensionnement : 50 au total sur le pilote ; inclure un scénario de concentration dans un même espace. Ce chiffre est un objectif à mesurer, pas une capacité démontrée.
- Communications : chat texte, audio et vidéo de proximité dès la première version (vidéo ajoutée par décision explicite du 4 novembre 2026).
- Personnalisation : avatars, chambres personnelles et espaces associatifs aménageables.
- Budget : chiffrer séparément hébergement, stockage, sauvegardes, audio (minutes participants et trafic), supervision et outils partagés. La simultanéité seule ne permet pas de calculer un coût mensuel.
- Aucun fournisseur, moteur, abonnement ou hébergement payant n'est sélectionné par ces décisions.

### Critères de validation à implémenter

| Domaine | Critère de sortie proposé |
|---|---|
| Capacité | Test reproductible de 50 sessions actives, avec déplacements, chat et audio ; publier durée, appareils, réseau, latences, erreurs et consommation. Distinguer test synthétique et essai audio sur appareils réels. |
| Microphone | Activation explicite, état visible, commande muet et arrêt de la capture en quittant l'audio ; parcours utilisable si permission refusée. Aucun enregistrement audio dans cette version. |
| Proximité | Le serveur détermine les abonnements audio autorisés ; quitter une zone ou un espace révoque les flux. Baisser seulement le volume côté client ne constitue pas une isolation. |
| Accès | Un utilisateur non autorisé ne peut ni entrer, ni écouter, ni modifier un espace ; tester aussi jeton expiré, révocation et reconnexion. |
| Modération | Couper un participant, bloquer, signaler et exclure selon les droits ; limites de fréquence du chat, sans journaliser le contenu audio. |
| Aménagement | Sauvegarder puis recharger une disposition ; propriétaire ou éditeur autorisé uniquement, validation serveur des objets, positions et quotas, gestion des modifications concurrentes. |
| Navigateur mobile | Vérifier tactile, clavier virtuel, permissions micro, interruptions audio et reconnexion sur Safari iOS et Chrome Android, puis navigateurs desktop ciblés. |
| Accessibilité | Les quatre parcours restent accessibles hors déplacement dans le monde ; chat texte disponible pour participer sans audio. |

Propositions techniques à évaluer, non décisions produit : catalogue d'objets contrôlé pour commencer, quotas par espace et plafond de flux audio reçus simultanément. Un plafond doit être visible et ne pas être présenté comme 50 voix simultanément audibles.

### Pilote multicampus et imports — décisions confirmées

- Accès : étudiants vérifiés de plusieurs campus. La cible de 50 connexions simultanées reste globale au pilote, et non 50 par campus.
- Contenus obligatoires au 5 février 2027 : catalogue fourni et images personnelles. Imports de modèles 3D personnels reportés en bonus au semestre suivant.
- Horaires : campus ouvert toute la journée, fréquentation variable. Ce choix n'est ni une promesse de disponibilité absolue ni une permanence humaine de support.
- Rendu confirmé : vue isométrique 2,5D, caméra cadrée, personnages et espaces aménageables. Vérifier le coût mobile avec un prototype représentatif.

Exigences proposées pour réalisation :
1. Définir le niveau de vérification étudiante. Une adresse académique vérifiée prouve le contrôle de cette adresse, pas nécessairement une inscription actuelle. Prévoir statut en attente, source et date de vérification, expiration, révocation et recours ; SSO institutionnel uniquement si un accès officiel est disponible.
2. Modéliser les appartenances à plusieurs campus. Distinguer espaces communs et espaces réservés ; tester lecture, édition, fichiers et audio entre campus, associations et chambres. Une appartenance ne donne pas de droit d'administration.
3. Placer les imports en quarantaine privée avant publication. Vérifier type réel, taille et complexité après décodage ; traiter dans un worker isolé sans accès réseau ni secrets. Refuser les ressources externes, scripts et formats non pris en charge.
4. Images réencodées avec suppression des métadonnées inutiles. Pour le bonus ultérieur d'import 3D : proposition de format GLB autonome avec liste d'extensions autorisées. Limiter triangles, textures, dimensions, animations et coût total par scène, pas uniquement les octets du fichier. Les seuils seront fixés par mesure mobile.
5. Prévoir quotas utilisateur/espace, droits sur les œuvres, signalement, retrait et suppression des objets dérivés. Tests négatifs : fichier trompeur, ressource externe, image ou modèle démesuré, écriture dans l'espace d'un tiers.
6. Autoriser le campus sans connexion audio permanente. Rejoindre et quitter explicitement l'audio ; ne pas supposer qu'un microphone muet arrête la facturation d'une connexion WebRTC.
7. Prévoir alertes d'incident, procédure de reprise, surveillance des dépenses et dégradation visible vers le texte si l'audio devient indisponible. L'ouverture du service ne vaut pas engagement d'assistance 24 h/24.

### Pré-chiffrage audio : scénarios, pas fréquentation mesurée

Base de calcul : mois de 30 jours, moyenne des connexions WebRTC actives sur les 24 heures. Minutes participants = moyenne × 60 × 24 × 30.

| Scénario hypothétique | Moyenne de connexions audio | Minutes participants/mois |
|---|---:|---:|
| Faible | 2 | 86 400 |
| Central de travail | 5 | 216 000 |
| Soutenu | 15 | 648 000 |
| Maximum théorique continu | 50 | 2 160 000 |

Exemple de référence commerciale, sans sélection ni souscription : LiveKit Cloud Ship affiche 50 USD/mois, 150 000 minutes WebRTC et 250 Go sortants inclus ; dépassements de 0,0005 USD/minute et 0,12 USD/Go. Source officielle consultée le 4 novembre 2026 : https://livekit.com/pricing (rubriques Participants / Media transport). Ne pas appliquer les tarifs des agents vocaux IA à une conversation humaine.

Avec cette grille, composante abonnement + minutes uniquement : 50 / 83 / 299 / 1 055 USD par mois pour les quatre scénarios. Ajouter transfert au-delà du quota, taxes éventuelles, change et tous les autres services. Le scénario extrême n'est pas une recommandation de plan tarifaire ; comparer les offres et l'auto-hébergement pour ce volume.

Formule indicative Ship : 50 + max(0, minutes - 150000) × 0,0005 + max(0, Go_sortants - 250) × 0,12 USD/mois, hors autres options et fiscalité. Le débit, les flux reçus, TURN, le fournisseur et la région restent à qualifier. Le choix de localisation des données doit être vérifié avant toute sélection commerciale.

Le budget complet reste à établir : API et monde temps réel, bases, stockage d'assets et dérivés, trafic CDN, traitement isolé des imports, sauvegardes, logs, supervision, emails, GitHub et exploitation humaine. Aucun total global ni achat n'est validé par ce pré-chiffrage.

## Décisions complémentaires confirmées — 4 novembre 2026

Ces décisions complètent le périmètre obligatoire de février et priment sur les propositions antérieures incompatibles. Elles ne constituent pas une preuve d'implémentation.

- Campus : vue isométrique 2,5D, caméra cadrée, avatars et espaces aménageables.
- Mentorat : étudiants vérifiés, anciens élèves et professionnels invités ; accès limités.
- Recrutement : comptes recruteurs, annonces, candidatures avec CV et message, suivi des statuts, messagerie candidat–recruteur, planification d'entretiens et visioconférence dédiée.
- Admission recruteur : demande d'inscription, validation manuelle avant activation.
- Intervenants externes : espaces dédiés et rendez-vous sur invitation ; profils visibles sur accord étudiant.
- Les imports de modèles 3D personnels restent un bonus ultérieur. Synchronisation Google/Outlook, enregistrement et analyse automatique des CV ne sont pas implicitement inclus.
- Le périmètre de préproduction est confirmé ; sa faisabilité reste à estimer à partir des disponibilités nominatives.

Critères d'acceptation à décliner en tests :
1. Un recruteur non validé ne publie pas d'annonce et ne consulte pas de candidature.
2. L'accès aux candidatures est limité à l'organisation destinataire et aux membres autorisés ; tester les refus entre organisations.
3. Une candidature transmet les informations choisies à son destinataire sans rendre le profil globalement visible.
4. Un entretien possède un horaire, des participants autorisés et une salle privée ; tester les invitations invalides et les accès non autorisés.
5. Un intervenant externe ne peut accéder librement aux chambres ou espaces privés étudiants.
6. Documenter séparément visibilité du profil, données déjà transmises par candidature et politique de suppression ; ne pas promettre une révocation des copies déjà reçues.

## Vérification documentaire complémentaire — 4 novembre 2026

- Sources scolaires : documents 700/800 et, reçu le 4 novembre 2026, sujet END-OF-STUDY PROJECT BUILD v4.1.1 (Project_ESP-build.zip). Ce dernier définit les attendus de l'itération BUILD ; le retour pédagogique transmis est distingué d'une grille de notation exhaustive.
- T-ESP-800 demande notamment plan qualité, description fonctionnelle avec OBS/PBS/WBS et exigences, Definition of Done, besoins matériels et coûts. Relier chaque exigence à une preuve ; ne pas multiplier les documents sans nécessité.
- Les DOC-002/004/010/018 v1.0 fournis attribuent encore coordination et planning à Soumia : incohérence à corriger selon la décision déjà confirmée.
- Composition actuelle corrigée par Estelle le 4 novembre 2026 — neuf membres : Baye Ousmane Beye, Belaid Ioudjaoudene, Eckson Glitho, Estelle Giroud, Julien Lefebvre, Lina Laddada, Philimon Rusom, Soumia Michel, Thomas Pradeau. Hugo ne figure pas dans la liste actuelle. Disponibilités très variables, à chiffrer individuellement ; les responsabilités techniques restent à confirmer, sans transfert automatique du rôle historique de Hugo à Julien.
- Le 5 février 2027 est la soutenance du semestre selon le calendrier communiqué ; ne pas la confondre avec la soutenance finale de cursus mentionnée en S10 dans la documentation générale.
- Les objectifs de charge, de performance et de livraison restent des cibles tant que leurs tests et versions de référence ne sont pas disponibles.

## 1. Produit et marché

Conserver les 36 domaines dans le catalogue, mais engager des verticales complètes. Première verticale proposée : un étudiant se connecte, découvre un événement, s'inscrit, annule ; une association publie dans son périmètre ; un modérateur traite un signalement. Chaque action dispose d'une autorisation serveur et d'un parcours d'erreur.

Avant d'annoncer un pilote : identifier le campus, l'interlocuteur habilité, les besoins de deux segments au minimum, le canal d'acquisition et le responsable de support. Faire 8 à 12 entretiens exploratoires, puis 5 à 8 tests de tâches par itération comme objectifs de travail, sans prétendre à la représentativité statistique. Conserver guide, consentement adapté, notes minimisées, synthèse, décisions et limites.

Mesurer l'activation par une action utile, le temps jusqu'à cette action, la rétention par cohorte, le taux d'achèvement des tâches et les demandes de support. Fixer les seuils de succès avant le pilote ; ne pas les inventer après les résultats. Valider le payeur B2B et son cycle d'achat avant de traiter les revenus du budget comme acquis.

## 2. Gouvernance, planning et livrables scolaires

GitHub porte le code, les tâches techniques, PR, décisions et preuves. Un seul backlog de référence ; un outil supplémentaire n'est adopté que s'il supprime une friction mesurée. Chaque tâche indique exigence, responsable, dépendance, critère vérifiable, estimation et risque. Limiter le travail en cours à une tâche principale par contributeur/agent.

Estelle assure seule la direction du projet et arbitre périmètre et priorités. Soumia intervient au frontend, sans rôle de direction. Corriger en conséquence les documents Word et RACI contradictoires ; leur réconciliation reste à réaliser. La disponibilité et la compétence de chaque contributeur doivent être confirmées ; un document n'engage pas quelqu'un à son insu.

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
| P2 : première version en quatre incréments | P1 + UX et identité | Quatre parcours choisis utilisables dans les navigateurs ordinateur/mobile, autorisations négatives et démonstrations reproductibles |
| P3 : préparer le pilote | P2 | Restauration réelle, observabilité, support, données et accessibilité vérifiés |
| P4 : mesurer l'usage | P3 + accord campus | Résultats sur cohortes, retours, coût réel et décision produit documentés |
| P5 : extensions | Valeur et capacité démontrées | IA avancée, extensions du mentorat et du campus évaluées séparément, budgets et risques acceptés |

L'échéance scolaire fournie est le 5 février 2027. Le rétroplanning ci-dessous est une cible de travail ; sa faisabilité reste à confirmer par découpage et capacité réelle de l'équipe. La progression du programme est un travail continu ; le présent document rend les décisions et validations contrôlables.

## Objectifs de qualité et vidéo — décision du 4 novembre 2026

La vidéo fait partie du périmètre initial. L'ambition est de maximiser la qualité utile sous contraintes mesurées de confidentialité, compatibilité, fluidité et coût ; aucun résultat maximal n'est déclaré acquis.

### Exigences vidéo

- Caméra éteinte à l'entrée ; activation explicite distincte du microphone, prévisualisation, état de diffusion et destinataires compréhensibles. Refus de permission et absence de caméra ne bloquent pas les parcours.
- Accès aux pistes vidéo contrôlé côté serveur selon espace, proximité et blocage ; test avec client modifié essayant de s'abonner à un tiers interdit. Désabonnement côté client seul insuffisant.
- Arrêter la capture à la sortie ou à la désactivation ; aucune réactivation automatique après reconnexion sans respect du choix utilisateur. Aucun enregistrement audio/vidéo par défaut.
- Proposition d'architecture : SFU, abonnements sélectifs, couches de qualité adaptatives, priorité aux participants visibles et arrêt de réception des pistes inutiles. Ne pas utiliser une maille complète entre 50 navigateurs.
- Propositions de départ à mesurer : vidéo conversationnelle 720p/30 fps lorsque le réseau et l'appareil le permettent ; miniatures en résolution réduite, repli 360p puis audio puis texte. 1080p uniquement si les mesures et le contexte d'affichage le justifient.
- Budget initial de réception à tester : jusqu'à 4 vidéos distantes sur mobile et 9 sur ordinateur, ajustables selon capacité. Tous les participants peuvent activer leur caméra, sans imposer la réception de tous les flux par chaque appareil.
- Le partage d'écran, l'enregistrement, la transcription et les effets vidéo ne sont pas implicitement inclus dans cette décision.

### Objectifs mesurables proposés, non performances certifiées

| Axe | Objectif initial et protocole attendu |
|---|---|
| Monde virtuel | Au moins 30 FPS sur les appareils mobiles de référence et cible 60 FPS desktop ; mesurer les temps de trame p95/p99, pas seulement la moyenne, avec scène et médias représentatifs |
| Première utilisation | p75 LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 sur l'interface web ; mesurer séparément temps jusqu'à entrée interactive dans le monde |
| Média | Connexion média p95 ≤ 5 s et latence conversationnelle de bout en bout p95 ≤ 300 ms sur réseau de référence documenté ; tests réels requis |
| Charge | 50 sessions simultanées globales, scénario réparti puis concentré ; tests avec 50 publications vidéo et abonnements limités, puis mesure sur appareils réels |
| Endurance | Session d'au moins 60 minutes avec déplacements et médias ; mesurer mémoire, déconnexions, consommation et dégradation thermique mobile |
| Résilience | Tester perte réseau, changement Wi-Fi/mobile, permission refusée, serveur média indisponible ; préserver session métier et retour au texte |
| Sécurité | Aucun accès inter-espace non autorisé dans les scénarios de test ; révocation des pistes existantes et des nouvelles souscriptions |
| Coûts | Mesurer minutes connectées, Go sortants, stockage, traitement des imports et coût par utilisateur actif ; alertes et plafonds explicites |
| Accessibilité | Parcours utilisables sans caméra, micro ou navigation spatiale ; tester clavier, lecteur d'écran, zoom et réduction des animations |

Ces seuils sont des objectifs de conception à confirmer sur un prototype, avec appareils, navigateurs, réseau et jeu d'assets versionnés. Un test synthétique n'atteste ni la qualité perçue ni la compatibilité générale.

### Incidence sur le budget

Le pré-chiffrage audio précédent est conservé comme scénario historique audio seul. Il ne constitue plus une estimation du périmètre complet. La vidéo ajoute notamment du trafic sortant et de la charge de décodage ; ne pas doubler arbitrairement les minutes de connexion d'un participant qui publie audio et vidéo.

Ordre de grandeur calculé, non débit garanti : 1 Mbit/s reçu en continu pendant 1 heure représente 0,45 Go décimal hors surcoûts protocolaires. Avec 5 participants moyens, 4 flux reçus à 0,5 Mbit/s chacun pendant 720 heures, le trafic serait de 3 240 Go/mois. À 25 % de temps avec vidéo, ce serait 810 Go avant audio, surcoûts et autres trafics. Mesurer le facteur d'activité et les couches réellement reçues avant tout achat.

Source technique consultée le 4 novembre 2026 : https://docs.livekit.io/transport/media/subscribe/ (abonnements sélectifs et qualité adaptative). LiveKit reste une option étudiée, pas un fournisseur retenu. Le budget complet et les garanties de localisation restent à comparer.


## Attendus BUILD v4.1.1 et retour pédagogique — 4 novembre 2026

Source scolaire reçue : `Project_ESP-build.zip/Project/endStudyProject_build-project.pdf`, version 4.1.1. Le sujet exige un premier incrément exécutable v0.1 ; la version complète en préproduction au 5 février reste une ambition produit distincte, non une exigence de complétude démontrée par ce sujet.

### Livrables et preuves obligatoires

| Attendu | Preuve à produire | État |
|---|---|---|
| Incrément v0.1 fonctionnel respectant la DoD | Révision identifiée, scénario métier exécutable et résultats de tests | Non démontré dans cette vérification |
| Installation à froid par un tiers | Clone, configuration, installation, build et exécution depuis le README, sur environnement propre ; auteur, date, durée, erreurs et révision | À réaliser |
| ADR renseignés | Répertoire /docs/adr/ ; décisions structurelles, raisons, alternatives et conséquences | À inventorier puis compléter |
| Delta Log consolidé | /reporting/ ; action prescrite, friction réelle, correction et source modifiée avec commit | À établir à partir d'exécutions réelles |
| Tableau de bord de gouvernance et KPI | PDR, écart estimé/réel, ETC par tâche active, couverture, résultats CI et durée d'onboarding à froid | À instrumenter |
| Roadmap actualisée | Estimations révisées et arbitrages fondés sur les mesures | À recalculer |
| Rétrospective | Efficacité des rituels, répartition, outils ; actions avec responsable individuel et échéance | À réaliser collectivement |
| Contribution et compréhension | Branches explicites, commits conventionnels, contributions équilibrées et compréhension des ADR/KPI par chaque membre | À vérifier ; ne pas assimiler nombre de commits et effort |

Le PDR demandé est : actions ou ajustements manuels non prescrits / actions prescrites dans la procédure de référence × 100. Définir une unité d'action et figer la référence de chaque essai. Si le dénominateur est nul, indiquer non calculable. Conserver les essais échoués ; une procédure corrigée doit être rejouée à froid.

Pour chaque tâche active : responsable, estimation initiale en heures, heures réelles, ETC (reste à faire réestimé), risque, dépendances, échéance, preuve. Prévision totale = heures réelles + ETC ; écart prévisionnel = prévision totale - estimation initiale. Ne pas utiliser automatiquement estimation initiale - heures réelles comme ETC.

### Retour pédagogique communiqué par Estelle

- Correction explicite d'Estelle : Patrick Brugiere n'est plus membre et a rejoint une autre école. La liste initialement transmise était donc obsolète sur ce point. La raison de la remarque pédagogique « il manque Patrick » est inconnue ; ne pas demander sa réintégration. Ses anciennes affectations doivent être retirées des responsabilités actuelles et réattribuées explicitement ; les contributions historiques restent conservées. Les accès résiduels éventuels sont à inventorier, sans présumer leur présence ni leur révocation.
- Dépôt scolaire confirmé explicitement par Estelle : EpitechMscProPromo2027/T-ESP-901-LYN-9-1-T-ESP-901-2. La référence -15 du retour pédagogique n'est pas la destination du groupe. Le dernier contrôle du connecteur renvoie 404 : accès et synchronisation restent à vérifier ; cela ne prouve ni l'absence du dépôt ni l'absence de push.
- Le constat de non-push est un retour pédagogique historique transmis, pas une mesure actuelle indépendante.
- README : résumé compréhensible, architecture réelle, état du produit, procédure exécutable et vérifiée par un tiers.
- KPI : compléter API/gestion avec réactivité, accessibilité et expérience globale. Le sujet BUILD impose aussi les indicateurs procéduraux ci-dessus.
- « 60 FPS » seul est insuffisant : préciser appareil, OS, navigateur, scène, population, médias, réseau, durée et mesure des temps de trame. Aucun objectif chiffré n'est un résultat acquis.
- DoD : relier validation fonctionnelle et technique au suivi des estimations, heures réelles, ETC et risques ; éviter de transformer l'estimation initiale en preuve de livraison.

### Résumé produit de référence

EpiVerse est un réseau social de campus destiné aux étudiants de plusieurs établissements. Il associe profils et projets, événements, ressources, mentorat et recrutement à un campus virtuel isométrique 2,5D avec avatars et espaces personnalisables. Texte, audio et vidéo permettent les échanges ; les mentors externes et recruteurs disposent d'accès limités. La cible de février est une préproduction testée pour 50 utilisateurs simultanés, et non une capacité déjà mesurée.

Les adresses personnelles de contact fournies ne sont pas recopiées dans ce référentiel technique. La liste de membres ne prouve pas leurs droits GitHub ou leur inscription scolaire.
