import { defineConfig } from 'vite';

export default defineConfig({
  // host: true = écouter aussi sur le réseau local, pour ouvrir le banc d'essai depuis un téléphone
  server: { host: true },
  preview: { host: true },
});
