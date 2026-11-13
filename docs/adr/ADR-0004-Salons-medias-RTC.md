# ADR-0004 — Salons temps réel et média de proximité

**Date :** 13/11/2026. **Statut :** **à décider techniquement**, non validé.

## Besoin
Deux avatars dans un campus doivent voir leurs mouvements et échanger sans permettre l'accès à un salon privé. Des interactions audio/vidéo de proximité et des entretiens sur invitation sont prévus.

## Options à évaluer
- Positions et présence : WebSocket (Socket.IO ou alternative compatible avec NestJS).
- Média : WebRTC avec signalisation, STUN/TURN et politique d'autorisation explicite.
- Selon charge et réseau, architecture pair-à-pair limitée ou serveur média SFU. **Ne pas retenir une solution sans test de coût/latence.**

## Décision attendue
Comparer un prototype de deux clients puis un test jusqu'à **50 utilisateurs simultanés au total** : latence, erreurs, coût minute/flux, bande passante, CPU, permission caméra/micro, comportement dégradé, mobile.

## Sécurité
Exiger session et rôle valides, limitation de débit, retrait d'autorisation, mute/bloquer/signaler, confidentialité du salon et absence de publication de secrets.

**Issues :** #148, #149, #169–#172, #181. **La décision finale fournisseur/architecture est encore ouverte.**
