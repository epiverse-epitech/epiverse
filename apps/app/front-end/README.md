# Epiverse — Front-end

Base web Vite + React **18.3.1** + TypeScript strict, avec ESLint.
Adaptation web responsive du design mobile fourni : palette bleu marine / cyan / bleu clair, onboarding en deux colonnes sur desktop et dashboard avec navigation latérale. Sur mobile, le dashboard utilise une barre de navigation inférieure.

## Parcours disponibles

- Accueil et exploration directe de la démo.
- Inscription, connexion et vérification email simulées.
- Sélection du rôle, profil, au moins trois centres d’intérêt, notifications.
- Confirmation de demande pour les rôles mentor et association.
- Dashboard étudiant, recherche d’événements, détails et agenda.
- Stages filtrables par catégorie et liste des stages enregistrés.
- Profils mentors de démonstration et préférences du profil.

Les données sont fictives et les états restent en mémoire : un rechargement réinitialise la démo. Aucun compte n’est créé, aucun email ni demande n’est envoyé. Utiliser des données fictives dans les formulaires. Le mot de passe est effacé de l’état après soumission.

Référence : [Figma mobile](https://www.figma.com/design/h3dEq1jxGALilFNKoPRhTg/smth?node-id=0-1). Adaptation réalisée à partir de la capture fournie, le fichier Figma n’étant pas accessible via les outils disponibles.

## Démarrage

Prérequis : Node.js 20.19+ ou 22.12+ et npm (Node 24 utilisé par la CI).

```bash
cd apps/front-end
npm ci
npm run dev
```

Ouvrir l’URL affichée par Vite, généralement http://localhost:5173.

## Commandes

```bash
npm run lint        # ESLint
npm run typecheck   # Vérification TypeScript
npm run build       # Vérification TypeScript et génération de dist/
npm run preview     # Servir le build localement
```

## Structure

```text
src/main.tsx       Point d’entrée React (StrictMode)
src/App.tsx        Parcours onboarding et dashboard
src/App.css        Styles responsive et composants
src/index.css      Styles globaux
public/           Fichiers statiques
vite.config.ts    Configuration Vite
```

Ce front-end démarre indépendamment du backend. Aucune connexion API ni fonctionnalité IA ou 3D n’est encore implémentée.

La CI dédiée `front-end.yml` vérifie le lint, les types et le build. Les workflows et images Docker historiques ciblent encore Expo dans `apps/app` ; leur adaptation au déploiement Vite reste à coordonner avec l’équipe infrastructure.
