# ADR-0002 — Interface Expo web/mobile et moteur Phaser 2.5D

**Date :** cadrage révisé au 13/11/2026. **Statut :** choix cible, intégration non prouvée.

## Question
Comment proposer l'application sur ordinateur et téléphone tout en offrant un monde virtuel isométrique sans multiplier les codes ?

## Décision
- Privilégier une **interface Expo / React Native Web**, avec des parcours utilisables d'abord sur les navigateurs desktop et mobile.
- Utiliser le module **Phaser 2.5D**, séparé du front, monté dans la partie web.
- Garder une **alternative non spatiale accessible** pour tous les services essentiels.
- Faire communiquer le monde avec l'API et le serveur de salons temps réel en respectant identité, rôles et droits.

## Limites constatées
Le backend est présent sur `develop`, mais `apps/app` ne contient encore qu'un README. Le prototype campus Phaser se trouve sur `feature/EPI-459-avatar-poc`, non intégré. Ce document **ne prouve pas** que le mobile et les salons fonctionnent.

## Conséquences
Test navigateur desktop/mobile, charge réelle, permissions, WebRTC, coût bande passante et récupération après coupure avant la soutenance.

**Issues :** #113, #121, #122, #148, #149, #153, #169–#171.
