#!/usr/bin/env python3
"""EpiVerse — données fictives pour PostgreSQL et MongoDB (aucune dépendance, Python 3.10+).

    python data/fixtures/generate.py            # écrit out/seed.sql et les fichiers .jsonl de MongoDB
    python data/fixtures/generate.py --load     # écrit puis charge dans les conteneurs Docker locaux

Les données sont reproductibles : même graine et même date de référence = mêmes fichiers.
Chaque utilisateur a des goûts cachés (2 à 5 thèmes) qui guident ses interactions : un modèle
de recommandation a donc quelque chose à apprendre. Détails : data/fixtures/README.md
"""
import argparse
import bisect
import json
import math
import os
import random
import re
import subprocess
import sys
import unicodedata
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = HERE / 'out'

# ----------------------------------------------------------------------------
# Vocabulaire
# ----------------------------------------------------------------------------

# (thème = centre d'intérêt, 2 sous-catégories, mots-clés, métiers, secteur d'entreprise)
TOPICS = [
    ('Intelligence artificielle', ['Machine learning', 'IA générative'],
     ['les réseaux de neurones', 'les modèles de langage', 'la vision par ordinateur', "l'apprentissage automatique"],
     ['Data scientist', 'Ingénieur machine learning'], 'Logiciel et IA'),
    ('Développement web', ['Front-end', 'Back-end'],
     ['React', 'les API REST', "l'accessibilité web", 'TypeScript'],
     ['Développeur full stack', 'Développeur front-end'], 'Services numériques'),
    ('Cybersécurité', ['Sécurité offensive', 'Protection des données'],
     ["les tests d'intrusion", 'les CTF', 'la cryptographie', 'la conformité RGPD'],
     ['Analyste SOC', 'Consultant cybersécurité'], 'Cybersécurité'),
    ('Data et analyse', ['Data engineering', 'Visualisation de données'],
     ['SQL', 'les pipelines de données', 'les tableaux de bord', 'les statistiques'],
     ['Data analyst', 'Data engineer'], 'Conseil en données'),
    ('Cloud et DevOps', ['Conteneurs', 'Infrastructure'],
     ['Docker', 'Kubernetes', "l'intégration continue", "l'observabilité"],
     ['Ingénieur DevOps', 'Administrateur cloud'], 'Hébergement et cloud'),
    ('Mobile', ['iOS et Android', 'Applications hybrides'],
     ['React Native', 'Swift', 'Kotlin', "l'expérience mobile"],
     ['Développeur mobile', 'Développeur React Native'], "Édition d'applications"),
    ('Jeux vidéo', ['Game design', 'Moteurs de jeu'],
     ['Unity', 'Unreal Engine', 'le level design', 'les game jams'],
     ['Game designer', 'Développeur gameplay'], 'Jeu vidéo'),
    ('Design et UX', ["Design d'interface", 'Recherche utilisateur'],
     ['Figma', 'le prototypage', 'les tests utilisateurs', 'les design systems'],
     ['UX designer', 'Product designer'], 'Design et création'),
    ('Entrepreneuriat', ["Création d'entreprise", 'Financement'],
     ['le business plan', 'la levée de fonds', 'le pitch', "l'incubation de projets"],
     ['Chargé de projet innovation', 'Business developer'], 'Incubation et innovation'),
    ('Finance', ['Finance de marché', 'Gestion'],
     ["l'analyse financière", 'la comptabilité', "l'investissement", 'la fintech'],
     ['Analyste financier', 'Contrôleur de gestion'], 'Banque et finance'),
    ('Marketing et communication', ['Marketing digital', 'Réseaux sociaux'],
     ['le référencement', 'la stratégie de contenu', 'le community management', "l'image de marque"],
     ['Chargé de marketing digital', 'Community manager'], 'Communication et médias'),
    ('Écologie', ['Numérique responsable', 'Transition énergétique'],
     ['la sobriété numérique', 'le bilan carbone', "l'économie circulaire", 'la biodiversité'],
     ['Chargé de mission RSE', 'Consultant en transition écologique'], 'Énergie et environnement'),
    ('Solidarité', ['Bénévolat', 'Égalité des chances'],
     ['le tutorat', 'les collectes solidaires', "l'inclusion", "l'aide aux étudiants"],
     ['Chargé de projet associatif', 'Coordinateur de programmes solidaires'], 'Économie sociale et solidaire'),
    ('Sport', ['Sports collectifs', 'Sports de plein air'],
     ['les tournois inter-écoles', "l'entraînement", 'la course à pied', "l'escalade"],
     ["Chargé d'événementiel sportif", 'Assistant chef de produit sport'], 'Sport et loisirs'),
    ('Musique et arts', ['Musique', 'Arts de la scène'],
     ['les concerts', 'le théâtre', 'la photographie', 'le cinéma'],
     ['Chargé de production culturelle', 'Assistant de programmation'], 'Culture et spectacle'),
    ('International', ['Mobilité internationale', 'Langues'],
     ['les échanges universitaires', "l'anglais professionnel", "les stages à l'étranger", "l'interculturel"],
     ['Chargé de relations internationales', 'Assistant export'], 'Commerce international'),
    ('Robotique et électronique', ['Robotique', 'Objets connectés'],
     ['Arduino', 'les systèmes embarqués', "l'impression 3D", 'les capteurs'],
     ['Ingénieur systèmes embarqués', 'Technicien robotique'], 'Industrie et électronique'),
    ('Santé et bien-être', ['Santé mentale', 'Vie étudiante'],
     ['la gestion du stress', 'le sommeil', "l'alimentation", 'la prévention'],
     ['Chargé de prévention santé', 'Assistant e-santé'], 'Santé'),
]
NT = len(TOPICS)

SCHOOLS = [
    ('Institut du Numérique Lumière', 'Lyon', '69007'), ('École Supérieure Séquana', 'Paris', '75013'),
    ('Campus Atlantique Numérique', 'Nantes', '44000'), ('Institut Garonne Technologies', 'Toulouse', '31000'),
    ('École des Hautes Études du Nord', 'Lille', '59000'), ('Campus Aquitaine Innovation', 'Bordeaux', '33000'),
    ('Institut Méditerranée Digital', 'Marseille', '13002'), ('École Armor Informatique', 'Rennes', '35000'),
    ('Institut Rhénan des Sciences', 'Strasbourg', '67000'), ('Campus Occitan du Numérique', 'Montpellier', '34000'),
    ('École Alpine des Technologies', 'Grenoble', '38000'), ("Institut Azur d'Ingénierie", 'Nice', '06000'),
]
# (nom, niveau bac+, durée, thèmes dominants)
PROGRAMS = [
    ('Programme Grande École', 5, 5, []), ('Bachelor Informatique', 3, 3, [1, 4, 5]),
    ('MSc Data et IA', 5, 2, [0, 3]), ('MSc Cybersécurité', 5, 2, [2, 4]),
    ('Bachelor Design numérique', 3, 3, [7, 6]), ("Mastère Management de l'innovation", 5, 2, [8, 9]),
    ('Bachelor Marketing digital', 3, 3, [10, 8]), ('MSc Cloud et DevOps', 5, 2, [4, 1]),
    ('Bachelor Systèmes embarqués', 3, 3, [16, 0]),
]
COMPANY_PREFIX = ['Nova', 'Atlas', 'Hélio', 'Quanta', 'Orion', 'Lumen', 'Vertex', 'Sillage', 'Pixel', 'Kairn',
                  'Boréal', 'Altéa', 'Cobalt', 'Mistral', 'Zénith', 'Opale', 'Tandem', 'Nimbus', 'Écho', 'Garance']
COMPANY_SUFFIX = ['Tech', 'Labs', 'Conseil', 'Studio', 'Systèmes', 'Groupe', 'Digital', 'Solutions', 'Partners', 'Industries']
ASSO_PREFIX = ['Club', 'Collectif', 'Association', 'Atelier', 'Bureau']
EVENT_FORMATS = ['Conférence', 'Atelier', 'Hackathon', 'Meetup', 'Salon', 'Soirée', 'Tournoi', 'Webinaire',
                 'Afterwork', "Visite d'entreprise", 'Portes ouvertes', 'Concours']
ONLINE_FORMATS = {'Webinaire'}
RESOURCE_TYPES = [('guide', 'Guide'), ('tutorial', 'Tutoriel'), ('course', 'Cours'), ('video', 'Vidéo'),
                  ('tool', 'Outil'), ('template', 'Modèle')]
POST_ANGLES = ["retour d'expérience", "ce qu'il faut retenir", 'les inscriptions sont ouvertes', 'appel à participants',
               'nos conseils pour bien démarrer', 'le programme du semestre', 'trois erreurs à éviter', 'on recrute des bénévoles']
CONTRACTS = [('internship', 'Stage', 45), ('apprenticeship', 'Alternance', 30), ('fixed_term', 'CDD', 8),
             ('permanent', 'CDI', 12), ('freelance', 'Mission freelance', 5)]
FIRST_NAMES = ['Léa', 'Lucas', 'Emma', 'Hugo', 'Chloé', 'Nathan', 'Inès', 'Enzo', 'Manon', 'Louis', 'Camille', 'Jules',
               'Sarah', 'Adam', 'Jade', 'Noah', 'Lina', 'Théo', 'Zoé', 'Yanis', 'Clara', 'Rayan', 'Anaïs', 'Mathis',
               'Eva', 'Maël', 'Nina', 'Sacha', 'Louise', 'Ibrahim', 'Alice', 'Tom', 'Aya', 'Baptiste', 'Fatou', 'Arthur',
               'Mila', 'Kylian', 'Romane', 'Mehdi', 'Juliette', 'Gabriel', 'Salomé', 'Ethan', 'Awa', 'Paul', 'Lou', 'Samuel']
LAST_NAMES = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon',
              'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel',
              'Girard', 'André', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez', 'Benali', 'Diallo',
              'Nguyen', 'Traoré', 'Haddad', 'Schmitt', 'Colin', 'Marchand', 'Renaud', 'Besson', 'Kone', 'Perrin', 'Caron']
ROLES = [('student', 'Étudiant'), ('association_manager', "Responsable d'association"), ('school_staff', "Personnel d'école"),
         ('company_rep', "Représentant d'entreprise"), ('mentor', 'Mentor'), ('moderator', 'Modérateur'), ('admin', 'Administrateur')]
PERMISSIONS = {
    'profile.update': 'Modifier son profil', 'post.create': 'Créer une publication', 'post.publish': 'Publier une publication',
    'post.moderate': 'Modérer les publications', 'event.create': 'Créer un événement', 'event.publish': 'Publier un événement',
    'event.manage_own': 'Gérer ses événements', 'resource.create': 'Proposer une ressource', 'resource.publish': 'Publier une ressource',
    'association.manage': 'Gérer son association', 'job_offer.create': 'Créer une offre', 'job_offer.publish': 'Publier une offre',
    'mentoring.offer': 'Proposer du mentorat', 'mentoring.request': 'Demander un mentor', 'report.create': 'Signaler un contenu',
    'report.handle': 'Traiter un signalement', 'user.manage': 'Gérer les utilisateurs', 'role.assign': 'Attribuer des rôles',
    'audit.read': "Consulter le journal d'audit", 'school.manage': 'Gérer les informations de son école',
}
ROLE_PERMISSIONS = {
    'student': ['profile.update', 'resource.create', 'mentoring.request', 'report.create'],
    'association_manager': ['association.manage', 'post.create', 'post.publish', 'event.create', 'event.publish', 'event.manage_own'],
    'school_staff': ['school.manage', 'post.create', 'post.publish', 'event.create', 'event.publish', 'event.manage_own', 'resource.create', 'resource.publish'],
    'company_rep': ['job_offer.create', 'job_offer.publish', 'event.create', 'event.manage_own', 'post.create'],
    'mentor': ['mentoring.offer', 'profile.update'],
    'moderator': ['post.moderate', 'report.handle', 'resource.publish', 'audit.read'],
    'admin': list(PERMISSIONS),
}
USER_AGENTS = ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0 Safari/537.36',
               'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_5) Safari/605.1.15',
               'EpiVerse/1.0 (iPhone; iOS 19.0) Expo', 'EpiVerse/1.0 (Android 16) Expo']
CHAT_LINES = ['Salut, tu viens à la prochaine réunion ?', 'Oui, je serai là vers 18 h.', 'Tu as le lien du document ?',
              'Je te l\'envoie ce soir.', 'Merci pour ton aide sur le projet !', 'On se retrouve au foyer ?',
              'Quelqu\'un a les notes du cours de ce matin ?', 'Bien reçu, à demain.', 'Tu t\'es inscrit à l\'événement ?',
              'Pas encore, je regarde ça.', 'Super idée, je suis partant.', 'Je serai un peu en retard.']
NOTIF_TITLES = {'message': 'Nouveau message', 'event': 'Un événement approche', 'association': 'Du nouveau dans ton association',
                'mentoring': 'Réponse à ta demande de mentorat', 'job_offer': 'Nouvelle offre qui peut t\'intéresser',
                'moderation': 'Ton signalement a été traité', 'system': 'Bienvenue sur EpiVerse'}
# Sources des interactions spontanées. 'recommendation' est réservé aux clics sur une recommandation
# enregistrée (toujours avec context.recommendation_id).
SOURCES = [('feed', 50), ('search', 25), ('direct', 12), ('notification', 7), ('profile', 6)]
TARGET_TYPES = ['event', 'post', 'resource', 'job_offer', 'association', 'company', 'user']
TYPE_PROPENSITY = {'event': 2.5, 'post': 1.2, 'resource': 0.8, 'job_offer': 0.5, 'association': 0.4, 'company': 0.2, 'user': 0.15}
BACKGROUND = 0.03  # intérêt résiduel pour les thèmes hors des goûts de l'utilisateur
EMBEDDING_DIM = 1536
EMBEDDING_MODEL = 'fixture-v1'
# Plateforme 2D : (identifiant, nom, largeur, hauteur en tuiles, fréquentation)
MAPS = [('campus-hub', 'Hall du campus', 60, 40, 40), ('bibliotheque', 'Bibliothèque', 40, 30, 15),
        ('amphitheatre', 'Amphithéâtre', 50, 30, 10), ('espace-associations', 'Espace associations', 40, 40, 15),
        ('forum-entreprises', 'Forum entreprises', 50, 40, 10), ('cafeteria', 'Cafétéria', 30, 20, 10)]
SPRITES = [f'student-{n:02d}' for n in range(1, 9)]
HAIRS = ['short-brown', 'short-black', 'long-blond', 'long-black', 'curly-red', 'bun-brown']
OUTFITS = ['hoodie-blue', 'hoodie-green', 'shirt-white', 'jacket-black', 'sweater-red', 'tshirt-yellow']
ACCESSORIES = ['glasses', 'cap', 'headphones', 'backpack']
PASSWORD_PLACEHOLDER = 'fixture$no-login'  # pas un vrai hachage : personne ne peut se connecter avec ces comptes


def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def cap(text):
    return text[0].upper() + text[1:]


def weighted(rng, pairs):
    return rng.choices([p[0] for p in pairs], weights=[p[1] for p in pairs])[0]


# ----------------------------------------------------------------------------
# Génération
# ----------------------------------------------------------------------------

class Fixtures:
    def __init__(self, seed, now, n_users, scale, embeddings, defects=0.0):
        self.rng = random.Random(seed)
        self.now = now
        self.launch = now - timedelta(days=360)
        self.n_users = n_users
        self.scale = scale
        self.embeddings = embeddings
        self.t = {}             # table -> lignes
        self.items = []         # éléments recommandables
        self.interactions = []  # documents MongoDB
        self.world = {'maps': [], 'characters': []}
        self.user_events = {}       # (étudiant, événement) -> ligne user_event
        self.mentoring_pairs = {}   # (étudiant, mentor) -> date de la demande
        self.defects = defects      # part d'anomalies injectées (0 = données propres)
        self.drng = random.Random(seed + 1)
        self.defect_log = {'missing_fields': [], 'duplicates': [], 'expired_recommendations': []}
        self.users = []

    # -- utilitaires --
    def uuid(self):
        return str(uuid.UUID(int=self.rng.getrandbits(128), version=4))

    def between(self, start, end):
        if end <= start:
            return start
        return start + (end - start) * self.rng.random()

    def rows(self, table):
        return self.t.setdefault(table, [])

    def media(self, kind, uploader, created, alt, folder):
        rows = self.rows('media')
        mid = len(rows) + 1
        ext, mime = {'image': ('jpg', 'image/jpeg'), 'document': ('pdf', 'application/pdf'), 'video': ('mp4', 'video/mp4')}[kind]
        is_image = kind == 'image'
        rows.append((mid, self.uuid(), uploader, kind, f'{folder}/{created:%Y/%m}/{mid:06d}.{ext}', f'{slugify(alt)[:60]}.{ext}', mime,
                     self.rng.randint(40_000, 4_000_000), 1200 if is_image else None, 800 if is_image else None,
                     alt[:255] if is_image else None, created, None))
        return mid

    def item(self, ttype, tid, t1, t2, school, start, end):
        self.items.append({'type': ttype, 'id': tid, 't1': t1, 't2': t2, 'school': school, 'start': start, 'end': end,
                           'pop': self.rng.lognormvariate(0, 0.8)})

    def two_topics(self, t1=None):
        t1 = self.rng.randrange(NT) if t1 is None else t1
        t2 = self.rng.choice([t for t in range(NT) if t != t1]) if self.rng.random() < 0.3 else None
        return t1, t2

    # -- référentiels --
    def reference(self):
        launch = self.launch
        for i, (name, desc) in enumerate(ROLES, 1):
            self.rows('role').append((i, name, desc, launch))
        self.role_id = {name: i for i, (name, _) in enumerate(ROLES, 1)}
        codes = list(PERMISSIONS)
        for i, code in enumerate(codes, 1):
            self.rows('permission').append((i, code, PERMISSIONS[code]))
        for role, perms in ROLE_PERMISSIONS.items():
            for code in perms:
                self.rows('role_permission').append((self.role_id[role], codes.index(code) + 1))
        for i, topic in enumerate(TOPICS, 1):
            self.rows('interest').append((i, topic[0], launch))
        # catégories : un parent par thème, deux enfants
        self.topic_categories = []
        cid = 0
        for topic in TOPICS:
            cid += 1
            parent = cid
            self.rows('category').append((parent, topic[0], slugify(topic[0]), None))
            children = []
            for sub in topic[1]:
                cid += 1
                self.rows('category').append((cid, sub, slugify(sub), parent))
                children.append(cid)
            self.topic_categories.append((parent, children))
        for i, name in enumerate(EVENT_FORMATS, 1):
            self.rows('event_category').append((i, name, slugify(name)))

    # -- organisations --
    def organisations(self):
        rng, launch = self.rng, self.launch
        self.schools, self.companies, self.associations = [], [], []
        self.programs_by_school = {}
        oid = pid = 0
        for i, (name, city, postal) in enumerate(SCHOOLS):
            oid += 1
            domain = f'{slugify(name)}.example'
            self.rows('organisation').append([oid, self.uuid(), 'school', name, f'Établissement fictif situé à {city}.',
                                              f'https://www.{domain}', f'contact@{domain}', None, f'{rng.randint(1, 120)} rue de la République',
                                              postal, city, 'France', launch, launch])
            self.rows('school').append((oid, domain, f'{690000 + i:07d}{"ABCDEFGHJKLM"[i]}'))
            self.schools.append({'id': oid, 'name': name, 'city': city, 'domain': domain, 'weight': rng.uniform(0.6, 1.6)})
            programs = [PROGRAMS[0]] + rng.sample(PROGRAMS[1:], rng.randint(3, 5))
            self.programs_by_school[oid] = []
            for pname, level, duration, hints in programs:
                pid += 1
                self.rows('program').append((pid, self.uuid(), oid, pname, f'{slugify(pname)[:20].upper()}-{oid}',
                                             f'{pname} : formation en {duration} ans.', level, duration, True, launch, launch))
                self.programs_by_school[oid].append({'id': pid, 'duration': duration, 'hints': hints})
        names = rng.sample([f'{p} {s}' for p in COMPANY_PREFIX for s in COMPANY_SUFFIX], round(180 * self.scale))
        for i, name in enumerate(names):
            oid += 1
            topic = rng.randrange(NT)
            city = rng.choice(SCHOOLS)[1]
            domain = f'{slugify(name)}.example'
            created = self.between(launch, self.now - timedelta(days=30))
            kw = rng.sample(TOPICS[topic][2], 2)
            self.rows('organisation').append([oid, self.uuid(), 'company', name,
                                              f'Entreprise fictive du secteur {TOPICS[topic][4].lower()}, spécialisée dans {kw[0]} et {kw[1]}.',
                                              f'https://www.{domain}', f'recrutement@{domain}', None, f'{rng.randint(1, 80)} avenue des Entrepreneurs',
                                              None, city, 'France', created, created])
            self.rows('company').append((oid, domain, f'{90000000000000 + i * 7919:014d}', TOPICS[topic][4]))
            self.companies.append({'id': oid, 'name': name, 'topic': topic, 'city': city, 'domain': domain, 'created': created, 'reps': []})
            self.item('company', oid, topic, None, None, created, self.now)
        for school in self.schools:
            for n, topic in enumerate(rng.sample(range(NT), round(10 * self.scale) or 1)):
                oid += 1
                label = TOPICS[topic][0]
                name = f'{rng.choice(ASSO_PREFIX)} {label}'
                created = self.between(launch, launch + timedelta(days=120))
                kw = rng.sample(TOPICS[topic][2], 2)
                self.rows('organisation').append([oid, self.uuid(), 'association', name,
                                                  f"Association étudiante de {school['name']} autour de {kw[0]} et {kw[1]}.",
                                                  None, f'{slugify(name)}@{school["domain"]}', None, None, None, school['city'], 'France', created, created])
                self.rows('association').append((oid, school['id'], f'W{oid:09d}', (created - timedelta(days=rng.randint(200, 3000))).date(), rng.random() > 0.05))
                self.associations.append({'id': oid, 'name': name, 'topic': topic, 'school': school['id'], 'created': created, 'manager': None, 'members': []})
                self.item('association', oid, topic, None, school['id'], created, self.now)

    # -- utilisateurs --
    def make_users(self):
        rng, now, launch = self.rng, self.now, self.launch
        n = self.n_users
        kinds = ['admin'] * 2 + ['moderator'] * 6 + ['school_staff'] * round(n * 0.025) + ['company_rep'] * round(n * 0.05) + ['alumni'] * round(n * 0.06)
        kinds += ['student'] * (n - len(kinds))
        school_weights = [s['weight'] for s in self.schools]
        for uid, kind in enumerate(kinds, 1):
            first, last = rng.choice(FIRST_NAMES), rng.choice(LAST_NAMES)
            early = kind != 'student' or rng.random() < 0.5
            created = self.between(launch, launch + timedelta(days=60)) if early else self.between(launch, now - timedelta(days=1))
            user = {'id': uid, 'kind': kind, 'created': created, 'school': None, 'company': None, 'program': None, 'year': None,
                    'pseudonym': self.uuid(), 'public_id': self.uuid(), 'first': first, 'last': last, 'roles': set(), 'pref': [0.0] * NT, 'declared': [], 'tracked': False, 'reco': False,
                    'platform': weighted(rng, [('web', 40), ('ios', 30), ('android', 30)]), 'deleted': False}
            domain = 'mail.example'
            if kind in ('student', 'school_staff'):
                school = rng.choices(self.schools, weights=school_weights)[0]
                user['school'], domain = school['id'], school['domain']
            if kind == 'company_rep':
                company = rng.choice(self.companies)
                user['company'], domain = company['id'], company['domain']
                company['reps'].append(uid)
            if kind == 'student':
                user['roles'].add('student')
                program = rng.choice(self.programs_by_school[user['school']])
                user['program'], user['year'] = program, rng.randint(1, program['duration'])
                user['final_year'] = user['year'] == program['duration']
            else:
                user['roles'].add({'alumni': 'mentor'}.get(kind, kind))
            # goûts cachés (thèmes pondérés) puis centres d'intérêt déclarés, incomplets et bruités
            if kind in ('student', 'alumni'):
                hints = user['program']['hints'] if user['program'] else []
                topics = [rng.choice(hints)] if hints and rng.random() < 0.6 else []
                for t in rng.sample(range(NT), 5):
                    if t not in topics and len(topics) < rng.choice([2, 3, 3, 4, 4, 5]):
                        topics.append(t)
                decay = [1, 0.6, 0.4, 0.25, 0.15][:len(topics)]
                for t, w in zip(topics, decay):
                    user['pref'][t] = w / sum(decay)
                if rng.random() > 0.12:
                    user['declared'] = [t for t in topics if rng.random() < 0.9]
                    if rng.random() < 0.5:
                        extra = rng.randrange(NT)
                        if extra not in user['declared']:
                            user['declared'].append(extra)
                user['topics'] = topics
            deleted = anonymized = None
            if kind == 'student' and rng.random() < 0.01:
                user['deleted'] = True
                deleted = self.between(created, now)
                if rng.random() < 0.5:
                    anonymized = min(now, deleted + timedelta(days=30))
                    first, last, domain = 'Utilisateur', 'supprimé', 'anonymized.invalid'
            email = f'{slugify(first)}.{slugify(last)}{uid}@{domain}'
            active = not user['deleted'] and rng.random() < 0.97
            user['active'] = active
            last_login = self.between(max(created, now - timedelta(days=45)), now) if active and rng.random() < 0.85 else None
            self.rows('users').append([uid, user['public_id'], user['pseudonym'], first, last, email,
                                       created + timedelta(minutes=rng.randint(2, 600)) if rng.random() < 0.92 else None,
                                       PASSWORD_PLACEHOLDER, user['school'], user['company'], None, active,
                                       weighted(rng, [('private', 55), ('school', 30), ('public', 15)]), last_login, created,
                                       deleted or last_login or created, deleted, anonymized])
            user['last_seen'] = last_login or created
            self.users.append(user)
            if kind == 'student':
                school = next(s for s in self.schools if s['id'] == user['school'])
                grad = now.year + (1 if now.month >= 9 else 0) + user['program']['duration'] - user['year']
                bio = None
                if user['declared'] and rng.random() < 0.6:
                    bio = f"Étudiant en {user['year']}e année, curieux de {TOPICS[user['declared'][0]][2][0]}."
                self.rows('student_profile').append((uid, user['program']['id'], user['year'], grad,
                                                     school['city'] if rng.random() < 0.85 else rng.choice(SCHOOLS)[1], bio, created))
            for t in user['declared']:
                self.rows('user_interest').append((uid, t + 1, created))
            if active and rng.random() < 0.4:
                avatar = self.media('image', uid, created, f'Photo de profil de {first}', 'avatars')
                self.rows('_avatar').append((uid, avatar))
            # consentements : rien par défaut
            if kind in ('student', 'alumni') and not user['deleted']:
                if rng.random() < 0.78:
                    granted = created + timedelta(minutes=rng.randint(1, 5000))
                    withdrawn = self.between(granted, now) if rng.random() < 0.06 else None
                    self.rows('consent').append([None, uid, 'interaction_tracking', granted, withdrawn, '1.0'])
                    user['tracked'] = withdrawn is None
                if rng.random() < (0.85 if user['tracked'] else 0.1):
                    granted = created + timedelta(minutes=rng.randint(1, 5000))
                    withdrawn = self.between(granted, now) if rng.random() < 0.04 else None
                    self.rows('consent').append([None, uid, 'recommendations', granted, withdrawn, '1.0'])
                    user['reco'] = withdrawn is None
        self.students = [u for u in self.users if u['kind'] == 'student' and not u['deleted']]
        self.staff = {}
        for u in self.users:
            if u['kind'] == 'school_staff':
                self.staff.setdefault(u['school'], []).append(u['id'])
        self.moderators = [u['id'] for u in self.users if u['kind'] in ('moderator', 'admin')]

    def mentors(self):
        rng = self.rng
        self.mentor_users = [u for u in self.users if u['kind'] == 'alumni']
        self.mentor_users += [u for u in self.students if u['final_year'] and rng.random() < 0.2]
        for u in self.mentor_users:
            u['roles'].add('mentor')
            topic = u['topics'][0]
            created = u['created'] + timedelta(days=rng.randint(0, 20))
            job = rng.choice(TOPICS[topic][3])
            self.rows('mentor_profile').append((u['id'], f'{job} — {TOPICS[topic][0]}',
                                                f"J'accompagne des étudiants sur {TOPICS[topic][2][0]} et {TOPICS[topic][2][1]}.",
                                                rng.random() < 0.8, rng.randint(1, 5), created, created))
            self.item('user', u['id'], topic, u['topics'][1], None, created, self.now)

    def memberships(self):
        rng = self.rng
        by_school = {}
        for a in self.associations:
            by_school.setdefault(a['school'], []).append(a)
        for u in self.students:
            assos = by_school[u['school']]
            weights = [BACKGROUND + u['pref'][a['topic']] for a in assos]
            for a in {id(x): x for x in rng.choices(assos, weights=weights, k=rng.choice([0, 0, 1, 1, 1, 2, 3]))}.values():
                a['members'].append(u)
        for a in self.associations:
            for rank, u in enumerate(a['members']):
                role = 'manager' if rank == 0 else 'board' if rank < 4 else 'member'
                if rank == 0:
                    a['manager'] = u['id']
                    u['roles'].add('association_manager')
                self.rows('association_member').append((u['id'], a['id'], role, max(u['created'], a['created']) + timedelta(days=rng.randint(0, 30))))
        for u in self.users:
            for role in sorted(u['roles']):
                self.rows('user_role').append((u['id'], self.role_id[role], u['created']))

    # -- contenus --
    def contents(self):
        rng, now, launch = self.rng, self.now, self.launch
        scale = self.scale
        school_by_id = {s['id']: s for s in self.schools}
        any_staff = [uid for ids in self.staff.values() for uid in ids]

        def organiser():
            kind = weighted(rng, [('association', 55), ('school', 20), ('company', 20), ('platform', 5)])
            if kind == 'association':
                a = rng.choice(self.associations)
                return a['id'], a['manager'] or rng.choice(any_staff), a['school'], a['name'], a['topic'], school_by_id[a['school']]['city']
            if kind == 'school':
                s = rng.choice(self.schools)
                return s['id'], rng.choice(self.staff.get(s['id']) or any_staff), s['id'], s['name'], None, s['city']
            if kind == 'company':
                c = rng.choice(self.companies)
                return c['id'], rng.choice(c['reps'] or self.moderators), None, c['name'], c['topic'], c['city']
            return None, rng.choice(self.moderators), None, 'EpiVerse', None, rng.choice(SCHOOLS)[1]

        for eid in range(1, round(900 * scale) + 1):
            org, creator, school, org_name, topic, city = organiser()
            t1, t2 = self.two_topics(topic)
            fmt = rng.randrange(len(EVENT_FORMATS))
            online = EVENT_FORMATS[fmt] in ONLINE_FORMATS or rng.random() < 0.08
            start = self.between(launch + timedelta(days=15), now + timedelta(days=90)).replace(minute=0, second=0, microsecond=0)
            created = max(launch, start - timedelta(days=rng.randint(10, 45)))
            status = weighted(rng, [('published', 88), ('draft', 6), ('cancelled', 6)])
            kw = rng.sample(TOPICS[t1][2] + (TOPICS[t2][2][:1] if t2 is not None else []), 2)
            name = f'{EVENT_FORMATS[fmt]} : {kw[0]}'
            self.rows('event').append((eid, self.uuid(), name,
                                       f"{EVENT_FORMATS[fmt]} sur {kw[0]} et {kw[1]}, proposé par {org_name}. Pour les étudiants intéressés par le thème « {TOPICS[t1][0]} ».",
                                       fmt + 1, creator, org, start, start + timedelta(hours=rng.choice([1, 2, 2, 3, 4, 8])),
                                       'En ligne' if online else f'{org_name}, {city}', online, rng.choice([None, 30, 50, 80, 120, 300]),
                                       status, created, created))
            if rng.random() < 0.6:
                self.rows('event_media').append((eid, self.media('image', creator, created, f'Affiche : {name}', 'events'), 0))
            if status == 'published':
                self.item('event', eid, t1, t2, None if online else school, created, start)

        for pid in range(1, round(1000 * scale) + 1):
            org, author, school, org_name, topic, _ = organiser()
            t1, t2 = self.two_topics(topic)
            status = weighted(rng, [('published', 85), ('draft', 10), ('archived', 5)])
            created = self.between(launch, now - timedelta(days=1))
            published = created + timedelta(hours=rng.randint(1, 72)) if status != 'draft' else None
            kw = rng.sample(TOPICS[t1][2], 2)
            title = f'{cap(kw[0])} : {rng.choice(POST_ANGLES)}'
            text = f"{org_name} revient sur {kw[0]} et {kw[1]}. Un sujet au cœur du thème « {TOPICS[t1][0]} »."
            body = {'type': 'doc', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': text}]}]}
            self.rows('post').append((pid, self.uuid(), title, body, author, org, status, published, created, published or created))
            parent, children = self.topic_categories[t1]
            for cid in {parent, rng.choice(children)} | ({self.topic_categories[t2][0]} if t2 is not None else set()):
                self.rows('post_category').append((pid, cid))
            if rng.random() < 0.3:
                self.rows('post_media').append((pid, self.media('image', author, created, title, 'posts'), 0))
            if status == 'published':
                self.item('post', pid, t1, t2, school, published, min(now, published + timedelta(days=45)))

        for rid in range(1, round(600 * scale) + 1):
            t1, t2 = self.two_topics()
            rtype, label = rng.choice(RESOURCE_TYPES)
            school = rng.choice(self.schools) if rng.random() < 0.35 else None
            creator = rng.choice(self.staff.get(school['id']) or any_staff) if school else rng.choice(self.moderators + [u['id'] for u in rng.sample(self.students, 20)])
            status = weighted(rng, [('published', 88), ('draft', 8), ('archived', 4)])
            created = self.between(launch, now - timedelta(days=2))
            kw = rng.sample(TOPICS[t1][2], 2)
            name = f'{label} : {kw[0]}'
            self.rows('resource').append((rid, self.uuid(), name, f"{label} pour progresser sur {kw[0]} et {kw[1]} (thème « {TOPICS[t1][0]} »).",
                                          f'https://ressources.epiverse.example/{slugify(name)}-{rid}', rtype, creator,
                                          school['id'] if school else None, status, created, created))
            parent, children = self.topic_categories[t1]
            for cid in {parent, rng.choice(children)}:
                self.rows('resource_category').append((rid, cid))
            if rtype in ('guide', 'template', 'course') and rng.random() < 0.6:
                self.rows('resource_media').append((rid, self.media('document', creator, created, name, 'resources'), 0))
            if status == 'published':
                self.item('resource', rid, t1, t2, None, created, now)

        for jid in range(1, round(600 * scale) + 1):
            company = rng.choice(self.companies)
            t1 = company['topic'] if rng.random() < 0.75 else rng.randrange(NT)
            contract, label, _ = rng.choices(CONTRACTS, weights=[c[2] for c in CONTRACTS])[0]
            created = self.between(max(launch, company['created']), now - timedelta(days=1))
            published = created + timedelta(hours=rng.randint(1, 48))
            expires = published + timedelta(days=rng.randint(30, 90))
            status = 'draft' if rng.random() < 0.05 else 'archived' if expires < now else 'published'
            kw = rng.sample(TOPICS[t1][2], 2)
            title = f'{rng.choice(TOPICS[t1][3])} ({label})'
            remote = rng.random() < 0.25
            self.rows('job_offer').append((jid, self.uuid(), company['id'], rng.choice(company['reps'] or self.moderators), title,
                                           f"{company['name']} recherche un profil {label.lower()} pour travailler sur {kw[0]} et {kw[1]}.",
                                           contract, 'Télétravail' if remote else company['city'], remote,
                                           f'https://www.{company["domain"]}/carrieres/{jid}', status,
                                           None if status == 'draft' else published, expires, created, created))
            if status != 'draft':
                self.item('job_offer', jid, t1, None, None, published, min(now, expires))

        for org in self.rows('organisation'):
            if rng.random() < 0.7:
                self.rows('_logo').append((org[0], self.media('image', None, org[12], f'Logo de {org[3]}', 'logos')))

    # -- comportements --
    def build_sampler(self):
        self.buckets, self.type_total = {}, {}
        for idx, it in enumerate(self.items):
            self.buckets.setdefault((it['type'], it['t1']), []).append(idx)
        self.bucket_cum = {}
        for key, idxs in self.buckets.items():
            cum, total = [], 0.0
            for idx in idxs:
                total += self.items[idx]['pop']
                cum.append(total)
            self.bucket_cum[key] = cum
            self.type_total[key[0]] = self.type_total.get(key[0], 0.0) + total

    def sample_items(self, user, pref, k, type_weights):
        """k éléments distincts : thème selon les goûts, popularité, puis proximité (école de l'utilisateur)."""
        rng = self.rng
        keys, cum, total = [], [], 0.0
        for key, idxs in self.buckets.items():
            total += type_weights[key[0]] * (BACKGROUND + pref[key[1]]) * self.bucket_cum[key][-1] / self.type_total[key[0]]
            keys.append(key)
            cum.append(total)
        picked, attempts = {}, 0
        while len(picked) < k and attempts < k * 8:
            attempts += 1
            key = keys[bisect.bisect_left(cum, rng.random() * total)]
            bucket = self.bucket_cum[key]
            idx = self.buckets[key][bisect.bisect_left(bucket, rng.random() * bucket[-1])]
            it = self.items[idx]
            if it['type'] == 'user' and it['id'] == user['id']:
                continue
            if it['school'] is None:
                accept = 0.35 if user['school'] else 1.0
            else:
                accept = 1.0 if it['school'] == user['school'] else 0.05
            if rng.random() < accept:
                picked[idx] = it
        return list(picked.values())

    def affinity(self, user, it):
        m = user['pref'][it['t1']] + (0.5 * user['pref'][it['t2']] if it['t2'] is not None else 0)
        return min(1.0, m / 0.5)

    def interact(self, user, it, action, when, source, extra=None):
        context = {'source': source, 'platform': user['platform']}
        if source in ('feed', 'search', 'recommendation'):
            context['position'] = min(30, int(self.rng.expovariate(0.35)))
        if extra:
            context.update(extra)
        self.interactions.append((when, user['pseudonym'], it['type'], it['id'], action, context))

    def convert(self, user, it, m, when, source, extra=None):
        """Passage à l'action après un clic : inscription, candidature ou demande de mentorat."""
        rng, action = self.rng, None
        if user['kind'] != 'student':
            return False
        if it['type'] == 'event' and rng.random() < 0.15 + 0.4 * m:
            action, status = 'register', 'registered'
            if it['end'] < self.now:
                status = weighted(rng, [('attended', 70), ('registered', 22), ('cancelled', 8)])
            self.user_events[(user['id'], it['id'])] = (user['id'], it['id'], status, when, when)
        elif it['type'] == 'job_offer' and rng.random() < 0.05 + 0.25 * m:
            action = 'apply'  # clic sur « postuler » : la candidature se fait sur le site de l'entreprise
        elif it['type'] == 'user' and (user['id'], it['id']) not in self.mentoring_pairs and rng.random() < 0.06 + 0.25 * m:
            action = 'mentoring_request'
            self.mentoring_pairs[(user['id'], it['id'])] = when
        if action and user['tracked']:
            self.interact(user, it, action, when, source, extra)
        return action is not None

    def behaviours(self):
        rng, now = self.rng, self.now
        self.build_sampler()
        for user in self.users:
            if user['kind'] not in ('student', 'alumni') or user['deleted'] or not user['active']:
                continue
            tenure = (now - user['created']).days
            k = min(400, int(rng.lognormvariate(math.log(45), 0.9) * min(1.0, tenure / 180)))
            if rng.random() < 0.08:
                k = rng.randint(0, 4)
            weights = {t: w * rng.lognormvariate(0, 0.4) for t, w in TYPE_PROPENSITY.items()}
            if user.get('final_year'):
                weights['job_offer'] *= 3
                weights['user'] *= 1.5
            for it in self.sample_items(user, user['pref'], k, weights):
                start, end = max(it['start'], user['created']), min(it['end'], now)
                if end <= start:
                    continue
                m = self.affinity(user, it)
                when = self.between(start, end)
                source = weighted(rng, SOURCES)
                clicked = rng.random() < 0.15 + 0.6 * m
                saved = clicked and rng.random() < 0.08 + 0.45 * m
                if user['tracked']:
                    dwell = {'dwell_ms': int(rng.lognormvariate(math.log(4000 + 20000 * m), 0.6))}
                    self.interact(user, it, 'view', when, source, dwell)
                    if clicked:
                        self.interact(user, it, 'click', when + timedelta(seconds=rng.randint(2, 40)), source)
                        if saved:
                            self.interact(user, it, 'save', when + timedelta(seconds=rng.randint(45, 300)), source)
                        if rng.random() < 0.03 + 0.1 * m:
                            self.interact(user, it, 'share', when + timedelta(seconds=rng.randint(60, 600)), source)
                        if rng.random() < 0.25:
                            again = self.between(when, end)
                            self.interact(user, it, 'view', again, 'direct', {'dwell_ms': int(rng.lognormvariate(math.log(8000), 0.6))})
                    elif source == 'feed' and rng.random() < 0.15 * (1 - m):
                        self.interact(user, it, 'dismiss', when + timedelta(seconds=rng.randint(1, 15)), source)
                # inscriptions et demandes : données métier, enregistrées même sans consentement de suivi
                if clicked:
                    converted = self.convert(user, it, m, when + timedelta(seconds=rng.randint(60, 900)), source)
                    if saved and not converted and it['type'] == 'event' and user['kind'] == 'student':
                        self.user_events[(user['id'], it['id'])] = (user['id'], it['id'], 'interested', when, when)

    def recommendations(self):
        """Recommandations passées d'un modèle de référence (popularité + centres d'intérêt déclarés)."""
        rng, now = self.rng, self.now
        rid = 0
        for user in self.users:
            if not user['reco'] or not user['active']:
                continue
            declared = [0.0] * NT
            for t in user['declared']:
                declared[t] = 1 / len(user['declared'])
            for it in self.sample_items(user, declared, rng.randint(12, 30), TYPE_PROPENSITY):
                generated = self.between(max(user['created'], now - timedelta(days=120)), now - timedelta(days=1))
                expired = False
                if not it['start'] <= generated <= it['end']:
                    # anomalie injectée : un élément expiré est quand même recommandé
                    if not (it['type'] in ('event', 'job_offer') and generated > it['end'] and self.drng.random() < self.defects):
                        continue
                    expired = True
                rid += 1
                m = self.affinity(user, it)
                model = 'baseline-v0' if generated < now - timedelta(days=60) else 'baseline-v1'
                match = it['t1'] in user['declared']
                score = round(min(1.0, 0.2 + (0.45 if match else 0) + 0.35 * rng.random()), 4)
                reason = f"Parce que tu t'intéresses à : {TOPICS[it['t1']][0]}" if match else 'Populaire en ce moment'
                shown = min(now, generated + timedelta(hours=rng.randint(1, 72))) if rng.random() < 0.85 else None
                clicked = feedback = None
                if shown:
                    if expired:
                        self.defect_log['expired_recommendations'].append(rid)
                    extra = {'recommendation_id': rid, 'model_version': model}
                    if rng.random() < 0.03 + 0.3 * m:
                        clicked = shown + timedelta(seconds=rng.randint(2, 90))
                        if user['tracked']:
                            self.interact(user, it, 'click', clicked, 'recommendation', extra)
                            if rng.random() < 0.05 + 0.3 * m:
                                self.interact(user, it, 'save', clicked + timedelta(seconds=rng.randint(30, 300)), 'recommendation', extra)
                        self.convert(user, it, m, clicked + timedelta(seconds=rng.randint(60, 900)), 'recommendation', extra)
                    elif user['tracked'] and rng.random() < 0.12 * (1 - m):
                        self.interact(user, it, 'dismiss', shown + timedelta(seconds=rng.randint(1, 20)), 'recommendation', extra)
                    if rng.random() < 0.12:
                        feedback = 'like' if rng.random() < 0.35 + 0.6 * m else 'dislike'
                self.rows('recommendation').append((rid, user['id'], it['type'], it['id'], score, model, reason, generated, shown, clicked, feedback))

    def mentoring(self):
        rng, now = self.rng, self.now
        mentors = {u['id']: u for u in self.mentor_users}
        for (mentee_id, mentor_id), created in sorted(self.mentoring_pairs.items(), key=lambda pair: pair[1]):
            mentor = mentors[mentor_id]
            status = weighted(rng, [('pending', 25), ('accepted', 40), ('declined', 15), ('cancelled', 5), ('completed', 15)])
            responded = None if status in ('pending', 'cancelled') else min(now, created + timedelta(days=rng.randint(1, 10)))
            topic = TOPICS[mentor['topics'][0]]
            self.rows('mentoring_request').append([None, mentee_id, mentor_id,
                                                   f"Bonjour, j'aimerais échanger avec vous sur {topic[2][0]} et sur votre parcours.",
                                                   status, created, responded, responded or created])

    # -- le reste de la plateforme --
    def platform(self):
        rng, now = self.rng, self.now
        active = [u for u in self.users if u['active']]
        for u in active:
            for _ in range(rng.choice([0, 1, 1, 2])):
                created = self.between(max(u['created'], now - timedelta(days=60)), now)
                revoked = self.between(created, now) if rng.random() < 0.1 else None
                self.rows('user_session').append([None, u['id'], f'fixture-session-{self.uuid()}', f'192.0.2.{rng.randint(1, 254)}',
                                                  rng.choice(USER_AGENTS), created, self.between(created, now), created + timedelta(days=30), revoked])
            if rng.random() < 0.1:
                kind = rng.choice(['password_reset', 'email_verification'])
                created = self.between(u['created'], now)
                self.rows('auth_token').append([None, u['id'], kind, f'fixture-token-{self.uuid()}', created + timedelta(hours=1 if kind == 'password_reset' else 48),
                                                created + timedelta(minutes=rng.randint(1, 50)) if rng.random() < 0.7 else None, created])
            if rng.random() < 0.3:
                for kind in NOTIF_TITLES:
                    self.rows('notification_preference').append((u['id'], kind, rng.random() < 0.9, rng.random() < 0.3, u['created']))

        # messagerie
        by_school = {}
        for u in self.students:
            if u['active']:
                by_school.setdefault(u['school'], []).append(u)
        cid = mid = 0
        conversations = []
        for _ in range(round(len(self.students) * 0.2)):
            pair = rng.sample(rng.choice(list(by_school.values())), 2)
            conversations.append(('direct', None, pair))
        for a in rng.sample(self.associations, min(len(self.associations), round(50 * self.scale) or 1)):
            members = [u for u in a['members'] if u['active']][:12]
            if len(members) >= 3:
                conversations.append(('group', a['name'], members))
        for kind, title, members in conversations:
            cid += 1
            created = self.between(max(u['created'] for u in members), now)
            when, first_mid = created, mid + 1
            for _ in range(rng.randint(3, 20)):
                mid += 1
                when = min(now, when + timedelta(minutes=rng.randint(1, 3000)))
                reply = rng.randint(first_mid, mid - 1) if mid > first_mid and rng.random() < 0.1 else None
                self.rows('message').append((mid, cid, rng.choice(members)['id'], rng.choice(CHAT_LINES), reply, when,
                                             when + timedelta(minutes=2) if rng.random() < 0.03 else None, when if rng.random() < 0.01 else None))
            self.rows('conversation').append((cid, kind, title, members[0]['id'], when, created, when))
            for rank, u in enumerate(members):
                self.rows('conversation_participant').append((cid, u['id'], 'admin' if kind == 'group' and rank == 0 else 'member',
                                                              self.between(created, now) if rng.random() < 0.8 else None, rng.random() < 0.05, created, None))

        # notifications : une partie renvoie vers un élément du catalogue
        by_type = {}
        for it in self.items:
            by_type.setdefault(it['type'], []).append(it)
        for u in active:
            for _ in range(rng.choice([0, 1, 2, 3, 5])):
                kind = weighted(rng, [('event', 30), ('job_offer', 15), ('association', 15), ('message', 20), ('mentoring', 8), ('moderation', 2), ('system', 10)])
                created = self.between(u['created'], now)
                target = rng.choice(by_type[kind]) if kind in ('event', 'job_offer', 'association') else None
                self.rows('notification').append([None, u['id'], kind, NOTIF_TITLES[kind], None, target['type'] if target else None,
                                                  target['id'] if target else None, self.between(created, now) if rng.random() < 0.6 else None, created])

        # signalements et journal d'audit
        for _ in range(round(120 * self.scale)):
            target = rng.choice(by_type[rng.choice(['post', 'event', 'resource', 'user'])])
            created = self.between(self.launch + timedelta(days=30), now)
            status = weighted(rng, [('open', 20), ('in_review', 10), ('resolved', 50), ('dismissed', 20)])
            handled = status in ('resolved', 'dismissed')
            self.rows('report').append([None, rng.choice(self.students)['id'], target['type'], target['id'],
                                        weighted(rng, [('spam', 30), ('inappropriate', 30), ('misinformation', 20), ('harassment', 10), ('other', 10)]),
                                        'Signalement de démonstration.', status,
                                        ('Contenu retiré.' if status == 'resolved' else 'Signalement non fondé.') if handled else None,
                                        rng.choice(self.moderators) if handled else None,
                                        min(now, created + timedelta(hours=rng.randint(1, 96))) if handled else None, created])
        actions = [('user.login', 'users', 'info', 60), ('post.update', 'post', 'info', 10), ('event.publish', 'event', 'info', 10),
                   ('role.assign', 'users', 'warning', 5), ('report.resolve', 'report', 'info', 8), ('user.login_failed', 'users', 'warning', 5),
                   ('event.delete', 'event', 'warning', 2)]
        for _ in range(round(len(self.users) * 1.2)):
            action, entity, level, _w = rng.choices(actions, weights=[a[3] for a in actions])[0]
            u = rng.choice(active)
            self.rows('audit_log').append([None, level, u['id'], action, entity, rng.randint(1, 500), None, {'source': 'fixtures'},
                                           f'198.51.100.{rng.randint(1, 254)}', rng.choice(USER_AGENTS), self.between(u['created'], now)])

    def world_2d(self):
        """Plateforme 2D : les cartes, et un personnage par utilisateur qui s'y est déjà connecté."""
        rng = self.rng
        date = lambda d: {'$date': d.strftime('%Y-%m-%dT%H:%M:%S.000Z')}
        for map_id, name, width, height, _ in MAPS:
            self.world['maps'].append({'_id': map_id, 'name': name, 'width': width, 'height': height, 'tile_size': 32,
                                       'spawn': {'x': width // 2, 'y': height - 2, 'direction': 'up'}, 'is_active': True,
                                       'created_at': date(self.launch)})
        for u in self.users:
            if not u['active'] or rng.random() > 0.8:
                continue
            map_id, _, width, height, _ = rng.choices(MAPS, weights=[m[4] for m in MAPS])[0]
            appearance = {'sprite': rng.choice(SPRITES), 'hair': rng.choice(HAIRS), 'outfit': rng.choice(OUTFITS)}
            if rng.random() < 0.3:
                appearance['accessory'] = rng.choice(ACCESSORIES)
            created = u['created'] + timedelta(minutes=rng.randint(5, 20000))
            seen = max(created, u['last_seen'])
            self.world['characters'].append({
                'user_public_id': u['public_id'], 'display_name': f"{u['first']} {u['last'][0]}.", 'appearance': appearance,
                'position': {'map_id': map_id, 'x': round(rng.uniform(1, width - 1), 2), 'y': round(rng.uniform(1, height - 1), 2),
                             'direction': rng.choice(['up', 'down', 'left', 'right'])},
                'last_seen_at': date(seen), 'created_at': date(created), 'updated_at': date(seen)})

    def inject_defects(self):
        """Anomalies volontaires pour tester les contrôles qualité : champs vides et doublons."""
        rng, log = self.drng, self.defect_log
        # table -> colonnes vidées (index -> valeur « vide »)
        targets = {'event': {3: None, 9: None}, 'resource': {3: None, 4: None}, 'job_offer': {5: ' ', 7: None}}
        for table, blanks in targets.items():
            rows, columns = self.t[table], dict(TABLES)[table].split(', ')
            originals = list(rows)
            for i, row in enumerate(originals):
                if rng.random() < self.defects:
                    col = rng.choice(list(blanks))
                    rows[i] = row[:col] + (blanks[col],) + row[col + 1:]
                    log['missing_fields'].append({'table': table, 'id': row[0], 'column': columns[col]})
            for row in rng.sample(originals, round(len(originals) * self.defects / 2)):
                copy_id = len(rows) + 1
                rows.append((copy_id, str(uuid.UUID(int=rng.getrandbits(128), version=4))) + row[2:])
                log['duplicates'].append({'table': table, 'id': copy_id, 'duplicate_of': row[0]})

    def embedding_rows(self):
        """Vecteurs fictifs mais structurés : les éléments d'un même thème sont proches."""
        rng = random.Random(self.rng.random())
        centroids = [[rng.gauss(0, 1) for _ in range(EMBEDDING_DIM)] for _ in range(NT)]
        for it in self.items:
            c1 = centroids[it['t1']]
            c2 = centroids[it['t2']] if it['t2'] is not None else None
            vec = [a + (0.5 * c2[i] if c2 else 0) + rng.gauss(0, 0.7) for i, a in enumerate(c1)]
            norm = math.sqrt(sum(v * v for v in vec))
            yield (it['type'], it['id'], EMBEDDING_MODEL, '[' + ','.join(f'{v / norm:.4f}' for v in vec) + ']', self.now)

    def build(self):
        self.reference()
        self.organisations()
        self.make_users()
        self.mentors()
        self.memberships()
        self.contents()
        self.behaviours()
        self.recommendations()
        self.t['user_event'] = list(self.user_events.values())
        self.mentoring()
        self.platform()
        self.world_2d()
        if self.defects:
            self.inject_defects()
        return self


# ----------------------------------------------------------------------------
# Écriture
# ----------------------------------------------------------------------------

# Ordre de chargement (clés étrangères) et colonnes. None dans la colonne id = laissé à la séquence.
TABLES = [
    ('role', 'id, name, description, created_at'),
    ('permission', 'id, code, description'),
    ('role_permission', 'role_id, permission_id'),
    ('interest', 'id, label, created_at'),
    ('category', 'id, name, slug, parent_id'),
    ('event_category', 'id, name, slug'),
    ('organisation', 'id, public_id, type, name, description, website_url, contact_email, logo_media_id, address, postal_code, city, country, created_at, updated_at'),
    ('school', 'id, domain, uai_code'),
    ('company', 'id, domain, siret, industry'),
    ('association', 'id, school_id, rna_number, founded_on, is_active'),
    ('program', 'id, public_id, school_id, name, code, description, degree_level, duration_years, is_active, created_at, updated_at'),
    ('users', 'id, public_id, pseudonym_id, first_name, last_name, email, email_verified_at, password_hash, school_id, company_id, avatar_media_id, is_active, visibility, last_login_at, created_at, updated_at, deleted_at, anonymized_at'),
    ('media', 'id, public_id, uploaded_by, type, storage_key, original_name, mime_type, size_bytes, width, height, alt_text, created_at, deleted_at'),
    ('student_profile', 'user_id, program_id, year_level, graduation_year, city, bio, updated_at'),
    ('user_interest', 'user_id, interest_id, created_at'),
    ('user_role', 'user_id, role_id, granted_at'),
    ('consent', 'id, user_id, purpose, granted_at, withdrawn_at, policy_version'),
    ('user_session', 'id, user_id, token_hash, ip_address, user_agent, created_at, last_used_at, expires_at, revoked_at'),
    ('auth_token', 'id, user_id, type, token_hash, expires_at, used_at, created_at'),
    ('association_member', 'user_id, association_id, role, joined_at'),
    ('mentor_profile', 'user_id, headline, bio, is_available, max_mentees, created_at, updated_at'),
    ('mentoring_request', 'id, mentee_id, mentor_id, message, status, created_at, responded_at, updated_at'),
    ('post', 'id, public_id, title, body, author_id, organisation_id, status, published_at, created_at, updated_at'),
    ('resource', 'id, public_id, name, description, url, resource_type, created_by, organisation_id, status, created_at, updated_at'),
    ('event', 'id, public_id, name, description, event_category_id, created_by, organisation_id, datetime_start, datetime_end, location, is_online, capacity, status, created_at, updated_at'),
    ('job_offer', 'id, public_id, company_id, created_by, title, description, contract_type, location, is_remote, apply_url, status, published_at, expires_at, created_at, updated_at'),
    ('post_category', 'post_id, category_id'),
    ('resource_category', 'resource_id, category_id'),
    ('post_media', 'post_id, media_id, position'),
    ('resource_media', 'resource_id, media_id, position'),
    ('event_media', 'event_id, media_id, position'),
    ('user_event', 'user_id, event_id, status, created_at, updated_at'),
    ('conversation', 'id, type, title, created_by, last_message_at, created_at, updated_at'),
    ('conversation_participant', 'conversation_id, user_id, role, last_read_at, is_muted, joined_at, left_at'),
    ('message', 'id, conversation_id, sender_id, body, reply_to_id, created_at, edited_at, deleted_at'),
    ('recommendation', 'id, user_id, target_type, target_id, score, model_version, reason, generated_at, shown_at, clicked_at, feedback'),
    ('content_embedding', 'target_type, target_id, model_version, embedding, updated_at'),
    ('notification', 'id, user_id, type, title, body, target_type, target_id, read_at, created_at'),
    ('notification_preference', 'user_id, type, in_app, email, updated_at'),
    ('report', 'id, reporter_id, target_type, target_id, reason, details, status, decision, handled_by, handled_at, created_at'),
    ('audit_log', 'id, level, user_id, action, entity_type, entity_id, message, payload, ip_address, user_agent, created_at'),
]
# Vidée mais non remplie : les interactions vivent dans MongoDB (docs/ia/Stockage_interactions_MongoDB.md).
EMPTY_TABLES = ['user_interaction']


def sql_value(v):
    if v is None:
        return '\\N'
    if v is True:
        return 't'
    if v is False:
        return 'f'
    if isinstance(v, datetime):
        return v.strftime('%Y-%m-%d %H:%M:%S+00')
    if isinstance(v, (dict, list)):
        v = json.dumps(v, ensure_ascii=False)
    return str(v).replace('\\', '\\\\').replace('\t', '\\t').replace('\n', '\\n').replace('\r', '\\r')


def write_sql(fx, path):
    counts = {}
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        def copy(table, columns, rows):
            n = 0
            f.write(f'COPY {table} ({columns}) FROM stdin;\n')
            for n, row in enumerate(rows, 1):
                # id à None : numéroté dans l'ordre d'écriture
                values = (n if i == 0 and v is None and columns.startswith('id,') else v for i, v in enumerate(row))
                f.write('\t'.join(sql_value(v) for v in values) + '\n')
            f.write('\\.\n\n')
            return n

        f.write(f'-- EpiVerse : données fictives générées par data/fixtures/generate.py (date de référence {fx.now:%Y-%m-%d}).\n')
        f.write('-- Ne pas modifier à la main. À charger sur une base qui a déjà le schéma (docs/database/schema.sql).\n\n')
        f.write('\\set ON_ERROR_STOP on\nBEGIN;\n\n')
        names = [name for name, _ in TABLES] + EMPTY_TABLES
        f.write(f'TRUNCATE TABLE {", ".join(names)} RESTART IDENTITY CASCADE;\n\n')
        for table, columns in TABLES:
            rows = fx.embedding_rows() if table == 'content_embedding' else fx.t.get(table, [])
            if table == 'content_embedding' and not fx.embeddings:
                rows = []
            counts[table] = copy(table, columns, rows)
            if table == 'media':
                # références circulaires users/organisation <-> media : complétées après coup
                for tmp, target, column in (('_avatar', 'users', 'avatar_media_id'), ('_logo', 'organisation', 'logo_media_id')):
                    f.write(f'CREATE TEMP TABLE {tmp} (id INTEGER, media_id INTEGER) ON COMMIT DROP;\n')
                    copy(tmp, 'id, media_id', fx.t.get(tmp, []))
                    f.write(f'UPDATE {target} SET {column} = {tmp}.media_id FROM {tmp} WHERE {target}.id = {tmp}.id;\n\n')
        for table, columns in TABLES:
            if columns.startswith('id,') and table not in ('school', 'company', 'association'):
                f.write(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), (SELECT max(id) FROM {table}));\n")
        f.write('\nCOMMIT;\nANALYZE;\n')
    return counts


def write_interactions(fx, path):
    fx.interactions.sort(key=lambda doc: doc[0])
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        for when, pseudonym, target_type, target_id, action, context in fx.interactions:
            f.write(json.dumps({'user_pseudonym_id': pseudonym, 'target_type': target_type, 'target_id': target_id, 'action': action,
                                'context': context, 'created_at': {'$date': when.strftime('%Y-%m-%dT%H:%M:%S.000Z')}},
                               ensure_ascii=False, separators=(',', ':')) + '\n')
    return len(fx.interactions)


def write_world(fx):
    for name, docs in fx.world.items():
        with open(OUT / f'world_{name}.jsonl', 'w', encoding='utf-8', newline='\n') as f:
            for doc in docs:
                f.write(json.dumps(doc, ensure_ascii=False, separators=(',', ':')) + '\n')


# ----------------------------------------------------------------------------
# Chargement dans les conteneurs locaux
# ----------------------------------------------------------------------------

PSQL = 'psql -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
MONGO_AUTH = '-u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin'


def compose(service, command, stdin=None):
    with (open(stdin, 'rb') if stdin else open(subprocess.os.devnull, 'rb')) as source:
        done = subprocess.run(['docker', 'compose', 'exec', '-T', service, 'sh', '-c', command], cwd=ROOT, stdin=source,
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
    if done.returncode != 0:
        sys.exit(f'Échec sur le service {service} :\n{done.stderr.strip() or done.stdout.strip()}\n'
                 'Les conteneurs sont-ils démarrés ? (docker compose up -d)')
    return done.stdout.strip()


def load(sql_path, jsonl_path, world):
    if not compose('postgres', PSQL + " -tAc \"SELECT to_regclass('public.users')\""):
        print('Schéma absent : application de docs/database/schema.sql')
        compose('postgres', PSQL, ROOT / 'docs' / 'database' / 'schema.sql')
    print('Chargement de PostgreSQL...')
    compose('postgres', PSQL, sql_path)
    print('Chargement de MongoDB...')
    compose('mongo', f'mongosh --quiet {MONGO_AUTH} "$MONGO_INITDB_DATABASE" --eval "db.user_interactions.deleteMany({{}})"')
    compose('mongo', f'mongoimport --quiet {MONGO_AUTH} -d "$MONGO_INITDB_DATABASE" -c user_interactions --numInsertionWorkers 4', jsonl_path)
    users = compose('postgres', PSQL + ' -tAc "SELECT count(*) FROM users"')
    docs = compose('mongo', f'mongosh --quiet {MONGO_AUTH} "$MONGO_INITDB_DATABASE" --eval "db.user_interactions.countDocuments()"')
    for name in world:
        compose('mongo', f'mongosh --quiet {MONGO_AUTH} epiverse_world --eval "db.{name}.deleteMany({{}})"')
        compose('mongo', f'mongoimport --quiet {MONGO_AUTH} -d epiverse_world -c {name}', OUT / f'world_{name}.jsonl')
    characters = compose('mongo', f'mongosh --quiet {MONGO_AUTH} epiverse_world --eval "db.characters.countDocuments()"')
    print(f'Chargé : {users} utilisateurs dans PostgreSQL, {docs} interactions et {characters} personnages dans MongoDB.')
    return int(docs), int(characters)


def main():
    parser = argparse.ArgumentParser(description='Données fictives EpiVerse (PostgreSQL + MongoDB).')
    parser.add_argument('--seed', type=int, default=42, help='graine aléatoire (42)')
    parser.add_argument('--users', type=int, default=3000, help="nombre d'utilisateurs (3000)")
    parser.add_argument('--scale', type=float, default=1.0, help='multiplicateur du catalogue : événements, offres, publications... (1.0)')
    parser.add_argument('--reference-date', help="date de fin des données, AAAA-MM-JJ (aujourd'hui). À fixer pour un jeu de données figé")
    parser.add_argument('--no-embeddings', action='store_true', help='ne pas générer content_embedding (fichier SQL bien plus léger)')
    parser.add_argument('--defects', type=float, default=0.0, metavar='PART',
                        help="part d'anomalies injectées pour tester les contrôles qualité, ex. 0.05 (0 = données propres)")
    parser.add_argument('--load', action='store_true', help='charger dans les conteneurs Docker locaux après la génération (efface les données précédentes)')
    parser.add_argument('--confirm-local-reset', action='store_true',
                        help='confirmation explicite de la suppression des données PostgreSQL/MongoDB locales')
    args = parser.parse_args()
    if args.load:
        if not args.confirm_local_reset:
            parser.error('--load efface les données existantes ; fournir --confirm-local-reset après vérification de la cible')
        if os.environ.get('NODE_ENV') == 'production' or os.environ.get('APP_ENV') == 'production':
            parser.error('chargement destructif interdit avec NODE_ENV/APP_ENV=production')
        # Docker Compose may point to a remote daemon through DOCKER_HOST/DOCKER_CONTEXT.
        # Refuse network transports even if the remote context happens to be named "default".
        docker_host = os.environ.get('DOCKER_HOST', '')
        if docker_host and not docker_host.startswith(('unix://', 'npipe://')):
            parser.error('DOCKER_HOST doit utiliser une socket Docker locale pour --load')
        context = subprocess.run(
            ['docker', 'context', 'inspect', '--format', '{{.Endpoints.docker.Host}}'],
            capture_output=True, text=True, check=False,
        )
        if context.returncode != 0 or not context.stdout.strip().startswith(('unix://', 'npipe://')):
            parser.error('contexte Docker distant ou inconnu : --load est réservé à une socket locale')
    sys.stdout.reconfigure(encoding='utf-8')

    day = datetime.strptime(args.reference_date, '%Y-%m-%d') if args.reference_date else datetime.now(timezone.utc)
    now = datetime(day.year, day.month, day.day, tzinfo=timezone.utc)
    fx = Fixtures(args.seed, now, args.users, args.scale, not args.no_embeddings, args.defects).build()

    OUT.mkdir(exist_ok=True)
    sql_path, jsonl_path = OUT / 'seed.sql', OUT / 'user_interactions.jsonl'
    counts = write_sql(fx, sql_path)
    interactions = write_interactions(fx, jsonl_path)
    write_world(fx)
    defects_path = OUT / 'defects.json'
    defects_path.unlink(missing_ok=True)
    if args.defects:
        defects_path.write_text(json.dumps(fx.defect_log, ensure_ascii=False, indent=1), encoding='utf-8')
    for table, n in counts.items():
        print(f'  {table:<26}{n:>8}')
    print(f'  {"user_interactions (Mongo)":<26}{interactions:>8}')
    for name, docs in fx.world.items():
        print(f'  {name + " (Mongo)":<26}{len(docs):>8}')
    print(f'{sql_path.relative_to(ROOT)} : {sql_path.stat().st_size / 1e6:.1f} Mo')
    print(f'{jsonl_path.relative_to(ROOT)} : {jsonl_path.stat().st_size / 1e6:.1f} Mo')
    if args.defects:
        print('Anomalies injectées (liste dans out/defects.json) : ' + ', '.join(f'{k} = {len(v)}' for k, v in fx.defect_log.items()))
    if args.load:
        if load(sql_path, jsonl_path, fx.world) != (interactions, len(fx.world['characters'])):
            sys.exit('MongoDB a refusé une partie des documents : vérifier la validation des collections.')


if __name__ == '__main__':
    main()
