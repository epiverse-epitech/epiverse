# apps/api — API NestJS (Eckson)

Générer le squelette ici : `npx @nestjs/cli new . --package-manager npm --skip-git`.
Contrat avec l'infra : voir `infra/README.md`, section 2 (préfixe `/api`, route `/api/health`, Prisma dans `prisma/`).
La CI ne lance les jobs de l'API qu'une fois `package.json` présent.
