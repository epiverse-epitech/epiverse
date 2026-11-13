# Le produit EpiVerse et le périmètre retenu

## Résumé en langage simple
EpiVerse est un réseau social étudiant accessible sur ordinateur et téléphone. Il aide à créer un profil, découvrir des événements et y participer. Un monde virtuel **2.5D**, inspiré des interactions d'Habbo et de VRChat, propose un avatar et une carte de campus. L'objectif académique est d'en livrer une partie **réellement fonctionnelle et testée**, sans prétendre que toutes les idées sont terminées.

## Trois périmètres distincts
| Niveau | Ce qu'on veut | Décision |
|---|---|---|
| **MVP de démonstration** | Web/mobile Expo, connexion et profil, événements et inscription, socle API, sécurité, CI et tests | **P0**, chemin critique |
| **POC campus 2.5D** | Avatar personnalisable simple, carte, déplacements, interface alternative accessible | **P0/P1** selon intégration ; un prototype **n'est pas** encore du multijoueur |
| **Évolutions** | Associations, ressources, mentorat, carrières, notifications, IA, social étendu, 3D/XR et autres modules | **Hors engagement MVP**, prioriser pour après la démo |

## Parcours principal à démontrer
1. L'étudiant ouvre EpiVerse sur le web ou sur mobile.
2. Il crée un compte et accepte les conditions, puis se connecte.
3. Il complète un profil de base, avec contrôle de confidentialité.
4. Il consulte les événements et peut s'inscrire ou se désinscrire.
5. Il ouvre la scène campus 2.5D dans le navigateur et déplace un avatar.
6. Les erreurs, permissions et retours utilisateur sont testés.

## Limites explicites
- Les **36 modules** sont la vision, **pas** 36 fonctionnalités garanties en février 2027.
- Les avatars visibles ne prouvent pas le multijoueur, la messagerie ou la modération.
- L'IA de recommandation s'appuie d'abord sur des règles et données synthétiques ; pas d'entraînement personnalisé avant collecte légitime et volume utile.
- Une application web rendue dans Expo ne démontre pas seule l'usage mobile natif ; tester sur appareil.

Décision de périmètre approuvée par Estelle dans la reconstruction du 13/11 ; arbitrer tout ajout contre délai, qualité et risque.
