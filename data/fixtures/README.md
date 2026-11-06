# Données fictives (Thomas, Lina, Belaid)

Un seul script, sans dépendance (Python 3.10+), remplit PostgreSQL et MongoDB avec des données fictives cohérentes et assez nombreuses pour entraîner et évaluer les modèles de recommandation.

```bash
docker compose up -d                          # PostgreSQL et MongoDB démarrés
python data/fixtures/generate.py --load --confirm-local-reset       # génère puis charge, 1 à 2 min au total
```

`--load --confirm-local-reset` **vide puis remplit** toutes les tables PostgreSQL et les collections MongoDB (`user_interactions`, `maps`, `characters`) de l'environnement local. Si la base n'a pas encore de schéma, `docs/database/schema.sql` est appliqué d'abord.

**Attention :** le chargement refuse désormais les contextes Docker distants et exige la confirmation explicite `--confirm-local-reset`. Il ne faut jamais l'exécuter sur des données réelles. Sans `--load`, le script écrit seulement les fichiers dans `data/fixtures/out/` (ignoré par Git, ≈ 90 Mo) :

| Fichier | Contenu | Chargement manuel |
|---|---|---|
| `seed.sql` | les 42 tables remplies | `docker compose exec -T postgres psql -U epiverse -d epiverse < data/fixtures/out/seed.sql` |
| `user_interactions.jsonl` | les interactions | `mongoimport` dans la collection `user_interactions` de `epiverse_ai` |
| `world_maps.jsonl`, `world_characters.jsonl` | plateforme 2D : 6 cartes, un personnage pour 80 % des comptes actifs | `mongoimport` dans `maps` et `characters` de `epiverse_world` |

## Options

| Option | Défaut | Effet |
|---|---|---|
| `--seed` | 42 | Graine aléatoire |
| `--users` | 3000 | Nombre d'utilisateurs |
| `--scale` | 1.0 | Taille du catalogue (événements, offres, publications, ressources, entreprises, associations) |
| `--reference-date` | aujourd'hui | Dernier jour des données. Même graine et même date = mêmes fichiers, à l'octet près |
| `--no-embeddings` | | Ne remplit pas `content_embedding` (`seed.sql` passe de 48 Mo à 8 Mo) |
| `--defects` | 0 | Part d'anomalies injectées pour tester les contrôles qualité, par exemple `0.05` (voir plus bas) |

## Volumes par défaut

3 000 utilisateurs (dont ≈ 2 600 étudiants) dans 12 écoles, 180 entreprises, 120 associations, 900 événements, 1 000 publications, 600 ressources, 600 offres, ≈ 400 mentors, ≈ 13 000 recommandations passées et ≈ 165 000 interactions sur 12 mois. Plateforme 2D : 6 cartes et ≈ 2 300 personnages avec leur dernière position (`docs/database/Plateforme_2D_MongoDB.md`).

## Ce que les modèles peuvent apprendre

Chaque étudiant a des **goûts cachés** : 2 à 5 thèmes pondérés parmi 18, influencés par son programme. Chaque élément du catalogue a un thème principal et parfois un secondaire. Une interaction dépend de trois choses :

- l'**affinité** entre les goûts de l'étudiant et le thème de l'élément (elle augmente les clics, les enregistrements, les partages et le temps passé, et diminue les rejets) ;
- la **popularité** propre à l'élément ;
- la **proximité** : un étudiant voit surtout les événements, associations et publications de son école.

Les goûts cachés ne sont écrits nulle part dans les bases. Ce que voit un modèle :

- `user_interest` : les centres d'intérêt déclarés, volontairement incomplets et bruités (12 % des profils sont vides) ;
- le texte des éléments, leurs catégories (`post_category`, `resource_category`), le secteur des entreprises ;
- `content_embedding` : vecteurs fictifs (`model_version = 'fixture-v1'`) où les éléments d'un même thème sont proches ;
- les interactions MongoDB, les inscriptions (`user_event`), les adhésions, les demandes de mentorat ;
- `recommendation` : l'historique d'un modèle de référence (`baseline-v0` puis `baseline-v1`, popularité + centres d'intérêt déclarés) avec affichages, clics et avis. Les clics correspondants, et les actions qui les suivent, sont dans MongoDB avec `context.recommendation_id`.

Les passages à l'action sont cohérents entre les deux bases : une interaction `register` a sa ligne `user_event`, une interaction `mentoring_request` sa ligne `mentoring_request`. `apply` (clic sur « postuler ») n'existe que dans MongoDB. Le KPI principal « recos converties » se calcule donc sur ce jeu : il vaut environ 2 %, le modèle de référence fictif étant volontairement médiocre.

## Tester les contrôles qualité (`--defects`)

Par défaut les données sont propres : les contrôles n'ont rien à trouver. Avec `--defects 0.05`, le script abîme volontairement le jeu et écrit la liste exacte de ce qu'il a fait dans `out/defects.json`, pour comparer avec ce que les contrôles détectent :

| Anomalie | Où | Volume avec 0.05 |
|---|---|---|
| Champ vide | `event` (`description`, `location`), `resource` (`description`, `url`), `job_offer` (`description` réduite à une espace, `location`) | ≈ 5 % des lignes, une colonne par ligne |
| Doublon | `event`, `resource`, `job_offer` : copie d'une ligne avec un nouvel `id` | 2,5 % des lignes |
| Élément expiré recommandé | `recommendation` affichée pour un événement passé ou une offre clôturée | ≈ 400 lignes |

Les doublons n'ont ni catégories, ni médias, ni interactions. Ne pas utiliser un jeu avec anomalies pour entraîner ou évaluer un modèle.

Vérification faite sur le jeu par défaut (20 % des éléments positifs de chaque étudiant mis de côté) : un filtrage collaboratif simple fait environ 2,5 fois mieux que la popularité en NDCG@10. Le signal existe, sans être trivial.

Cas limites présents pour tester le repli : nouveaux inscrits et étudiants presque sans activité, profils sans centre d'intérêt, événements passés ou annulés, offres expirées (`archived`), comptes désactivés, supprimés ou anonymisés.

## Données personnelles

- Tout est inventé : écoles, entreprises et personnes fictives, adresses e-mail en `.example`.
- Le consentement est respecté : seuls les utilisateurs ayant un consentement `interaction_tracking` actif ont des interactions, seuls ceux ayant un consentement `recommendations` actif ont des recommandations. Les consentements retirés n'ont aucune donnée.
- MongoDB ne contient que `users.pseudonym_id`.
- `password_hash` vaut `fixture$no-login` : personne ne peut se connecter avec ces comptes. Les comptes de test de l'API restent à créer par le back, avec son algorithme de hachage.

## À savoir

- La table PostgreSQL `user_interaction` est vidée et laissée vide : les interactions vivent dans MongoDB (`docs/ia/Stockage_interactions_MongoDB.md`).
- MongoDB supprime les interactions de plus de 395 jours. Les données couvrent les 12 mois avant la date de référence : avec une date ancienne, ou un jeu chargé depuis plus d'un mois, les plus vieilles interactions disparaissent. Relancer le script suffit.
- Les valeurs des types énumérés et les colonnes suivent `docs/database/schema.sql` : si le schéma change, adapter la liste `TABLES` du script.
