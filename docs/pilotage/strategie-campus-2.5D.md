# Monde social isométrique 2.5D — stratégie de livraison

**Vision :** un vrai campus social inspiré des interactions d'Habbo/Gather/VRChat, pas uniquement une carte à visiter. Il faut distinguer le POC déjà poussé, l'intégration et le multijoueur réel.

## État observé
La branche [`feature/EPI-459-avatar-poc`](https://github.com/epiverse-epitech/epiverse/tree/feature/EPI-459-avatar-poc/packages/campus) contient un module Phaser (carte, caméra, avatar, personnalisation et banc Vite). Ce code n'était **pas intégré dans develop** lors du dernier contrôle. L'existence du POC n'atteste pas de la présence, du chat ou de la vidéo.

## Livrables attendus et tickets
| Fonction | Responsable | Tickets |
|---|---|---|
| POC Phaser testable / intégration web | Julien | #121, #122 |
| Synchronisation des salons avec contrôle d'accès | Eckson | #148, #172 |
| Avatars de plusieurs utilisateurs visibles | Julien | #149 |
| Apparence avatar et sauvegarde | Thomas + Julien | #123 |
| Chambre/maison visitable et aménageable | Thomas + Julien | #150, #173 |
| Interactions et texte | Lina + Eckson | #151, #166 |
| Audio de proximité | Julien + Ousmane | #169, #171 |
| Vidéo de proximité | Julien + Ousmane | #170, #171 |
| Sécurité, blocage et modération | Estelle + Belaid | #152, #178 |
| Mesure FPS, latence et test de deux clients | Julien + Ousmane | #124, #153, #181 |

## Tests indispensables
- Deux étudiants sur **deux navigateurs différents** se voient et peuvent se déplacer dans le même salon.
- Connexion/déconnexion/reconnexion et entrée refusée dans un salon privé testées.
- Micro/caméra **désactivés par défaut** ; permissions explicites ; les refus n'empêchent pas le reste du campus de fonctionner.
- Cible d'essai : **50 utilisateurs simultanés au total**, avec mesure de charge et du coût.
- Compatibilité navigateurs desktop/mobile, déplacement tactile, sortie et liste alternative accessible.

## FPS utilisables
Mesurer une scène **définie**, résolution, appareil/OS, navigateur, nombre d'avatars, réseau, médias actifs et **60 secondes**. Relever FPS médian et FPS p5, avec deux mesures comparables. Les cibles 30 FPS mobile / 60 FPS desktop sont indicatives et doivent être confrontées à ces conditions.

## Ne pas confondre
Avatar seul ≠ multijoueur ; flux RTC local ≠ audio de proximité ; POC Vite ≠ intégration Expo ; CI verte ≠ performance réelle sur téléphone.
