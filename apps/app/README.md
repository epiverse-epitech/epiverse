# apps/app — Application Expo, mobile et web (Philimon, Julien)

Générer le squelette ici : `npx create-expo-app@latest . --no-install` puis `npm install`.
Contrat avec l'infra : voir `infra/README.md`, section 2 (`EXPO_PUBLIC_API_URL`, export web).
La CI ne lance les jobs de l'app qu'une fois `package.json` présent.
