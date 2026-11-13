# Matrice des exigences actives et de leur réalisation

**Périmètre visé :** préproduction du **5 février 2027** avec parcours étudiants, événements, ressources/mentorat, recrutement et monde social 2.5D. Il s'agit d'un **objectif à démontrer**, pas d'un état acquis.

Le projet conserve ses exigences d'origine, corrigées individuellement sur GitHub :
- **54 issues `type:exigence` ouvertes**, avec responsables, tests attendus et liens de réalisation.
- **19 tickets techniques ou de pilotage `type:archive` fermés comme doublons**, avec leurs remplaçants.
- Les travaux sont suivis dans les issues `type:tache`, avec heures prévues/réelles/restantes et risques. Les heures ne sont pas additionnées deux fois.

## Parcours métier
| Références historiques | Résultat attendu | Réalisation suivie |
|---|---|---|
| #47–#50 | Profil, compétences, projets, confidentialité et droits | #118, #156, #132 |
| #51–#54 | Fiches associations, activités, adhésions, gestionnaires | #157, #158, #177 |
| #55–#58 | Événements, recherche, réservation et rappels | #125–#127, #174–#175 |
| #59–#61 | Publier, découvrir, consulter une ressource autorisée | #159, #160 |
| #62 et #69 | Recherche globale avec filtrage par permissions | #176 |
| #63–#65 | Mentor, recherche, demande et réponse | #161, #162 |
| #66–#68 | Profil talent, recruteur, offres, candidatures privées | #156, #163–#168 |
| #70–#71 | Centre et préférences des notifications | #174, #175 |
| #72 | Push natif optionnel après lancement web | #187 (futur) |
| #73–#78 | Administration et modération avec audit et permissions | #177, #178, #152 |
| #79–#85 | Campus isométrique, multijoueur, alternative accessible et FPS | #121–#124, #148–#153, #169–#173 |

## Contrôles transversaux
| Références | Vérification | Réalisation |
|---|---|---|
| #92 | Réactivité API p95, erreurs, conditions reproductibles | #134 |
| #93, #83 | Accessibilité WCAG 2.2 AA et alternative monde | #133, #122 |
| #94, #50 | RGPD, consentements, suppression et visibilité | #132, #144 |
| #95 | DoD, CI, documentation et code review | #110, #146, #179 |
| #96 | Navigateurs et systèmes réellement testés | #113, #146 |
| #97 | 50 utilisateurs simultanés au total et dégradation | #181 |
| #99 | Design Figma, parcours et composants | #114, #138 |
| #100 | Démonstration de bout en bout en staging | #120, #146 |
| #101 | Pilote campus fermé après préproduction | #140, #181 (future) |

## Contrôles ajoutés après le cadrage historique
- Compte recruteur externe soumis à **validation manuelle** avant publication #163.
- Candidature avec CV/message, statuts privés, entretiens et visio dédiée #164–#168.
- Salon social, accès invité, synchronisation de présence et médias de proximité #148, #149, #169–#172.
- Chambre, espaces et images personnalisables avec contrôles d'accès #150, #173.
- Aucune des exigences ici ne signifie à elle seule une fonctionnalité déjà réalisée.

## Hors engagement février
- IA avancée #86–#91 et #130 : préparation autorisée, entraînement sur vraies données non promis.
- Stores et push natifs #72/#187, fonctionnalités sensibles des 36 modules #98/#145.
- Pilote réel avec vrais étudiants #101 : aucune institution partenaire/autorisation n'est attestée.

## Comment déclarer « réalisé »
Le ticket d'exigence se ferme uniquement lorsque ses tickets de réalisation ont la **DoD**, des tests/démos reliés, et la validation d'Estelle. Une PR ouverte, une maquette ou une CI verte backend ne suffisent pas.
