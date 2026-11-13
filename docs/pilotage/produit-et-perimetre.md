# EpiVerse — produit et périmètre au 13 novembre 2026

## Présentation courte
EpiVerse est une plateforme sociale pour étudiants de plusieurs établissements. Elle réunit profils et projets, événements, ressources, mentorat et recrutement dans une application utilisable depuis un navigateur ordinateur ou mobile. Elle comprend aussi un **campus virtuel isométrique 2.5D**, avec avatars et espaces aménageables, présence multijoueur et échanges texte, audio/vidéo de proximité. Les recruteurs et mentors extérieurs disposent de droits limités.

**Objectif pédagogique :** préproduction fonctionnelle et testée pour la soutenance du **5 février 2027**. Ce délai est un objectif, **pas** une preuve que tout sera réalisé.

## Parcours de préproduction retenus
| Parcours | Ce qu'un utilisateur doit pouvoir faire | Conditions |
|---|---|---|
| Étudiant | Compte vérifié, profil, compétences et projets, confidentialité | Campus/établissement et droits contrôlés |
| Vie de campus | Voir/créer événements, s'inscrire, associations et ressources, demandes de mentorat | Gestion des contenus et signalements |
| Recrutement | Recruteur externe validé manuellement, offres, candidatures privées, CV/message, états et entretiens vidéo | Visibilité choisie par l'étudiant, permissions strictes |
| Monde virtuel | Avatar, lieux et chambre personnalisables, présence avec plusieurs utilisateurs, salons, texte et audio/vidéo de proximité | Accès et modération, limitations réseau, mobile, accessibilité |

## Règles transversales indispensables
- Accessible sur navigateurs desktop et mobile ; application native/stores **non obligatoire** à la soutenance.
- La cible de charge est **50 utilisateurs simultanés au total** dans le pilote/test de préproduction, pas 50 par salle.
- Le monde n'est pas un simple plan 2D statique, mais le POC actuel n'est **pas encore** un monde multijoueur livré.
- Prévoir une interface alternative accessible aux interactions spatiales.
- Pas d'ouverture publique ni de pilotes avec vraies données avant conformité et sécurité minimales.

## Hors engagement de la préproduction de février
Les autres domaines de la vision à 36 modules (finance, logement, santé, DAO, XR/VR, stockage illimité, etc.), les stores mobiles, les imports libres de modèles 3D et un moteur IA avancé entraîné sur données réelles. Ils restent visibles dans la roadmap mais **ne doivent pas être déclarés terminés**.

## Développement constaté
- `develop` : socle API NestJS/Prisma, Docker, Mongo/Redis, tests backend et CI.
- `apps/app` : pas d'application intégrée vérifiée, uniquement README sur `develop`.
- Campus : POC Phaser/avatars dans une branche distincte.
- Plusieurs PR backend et sécurité restent ouvertes.

**Risque majeur :** charge prévisionnelle et dépendances. La capacité et les heures disponibles de chacun doivent être vérifiées avant de garantir le périmètre de février.

Sources : compte rendu consolidé du 04/11/2026, consignes ESP/BUILD, décisions d'équipe du 13/11 et dépôt GitHub.
