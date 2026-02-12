CAHIER DES CHARGES FONCTIONNEL ET TECHNIQUE
Nom du Projet : Application de suivi des enfants (KidTrack)
Version : 2.0
Date : 12 Février 2026
Auteur : - DONGMO KINGZOH Clarel
         - TAYO TIDO Fraisnelle

1. Contexte et Objectifs
1.1 Contexte
Actuellement, le suivi des enfants en crèche ou école primaire repose souvent sur des carnets de liaison papier. Ce système présente plusieurs défauts : perte d'informations, manque de réactivité en cas d'urgence, et absence de visibilité pour les parents durant la journée.

1.2 Objectifs du Projet
Développer une solution SaaS (Software as a Service) multi-plateformes (Web & Mobile) permettant :

Dématérialisation : Suppression du carnet papier.

Temps Réel : Transmission instantanée des événements (repas, sieste, soins).

Sécurité : Centralisation sécurisée des données de santé (allergies, régimes).

Administration : Gestion simplifiée des effectifs et du personnel pour la direction.

2. Analyse des Besoins et Acteurs
2.1 Les Acteurs (Personas)
L'Administrateur (Directeur) : Possède tous les droits. Crée les comptes (éducateurs, parents), gère les classes et accède aux statistiques globales.

L'Éducateur / Enseignant : Utilisateur principal de l'application mobile/tablette. Il saisit les données "terrain".

Le Parent : Utilisateur final. Il consulte les données en lecture seule et reçoit les notifications.

2.2 Diagramme des Cas d'Utilisation (Use Case Diagram)
Ce diagramme synthétise qui a le droit de faire quoi.

[ESPACE RÉSERVÉ : DIAGRAMME DE CAS D'UTILISATION]

À dessiner :

Admin : "Gérer Utilisateurs", "Gérer Classes", "Voir Dashboard".

Éducateur : "Pointer Présence", "Saisir Repas", "Saisir Sieste", "Uploader Photo", "Envoyer Message".

Parent : "Consulter Timeline", "Voir Menu Cantine", "Signaler Absence", "Mettre à jour fiche médicale".

3. Spécifications Fonctionnelles Détaillées
3.1 Module 1 : Gestion Administrative (Back-Office)
CRUD Enfants : Ajout d'un enfant avec champs obligatoires (Nom, Prénom, Date de naissance, Groupe Sanguin, Allergies Alimentaires, Contact d'urgence).

Gestion des Classes : Création de groupes (ex: "Les Petits", "Moyenne Section") et assignation d'éducateurs à ces groupes.

3.2 Module 2 : Le "Cahier de Vie" (Interface Éducateur)
L'interface doit être optimisée pour une saisie rapide (boutons larges, peu de texte).

Pointage de Présence : Liste des enfants de la classe → Checkbox "Présent/Absent/Retard".

Suivi Alimentaire :

Sélection multiple d'enfants possible.

Entrée : Entrée / Plat / Dessert.

Quantité : "Rien", "Un peu", "Moyen", "Tout".

Suivi Physiologique (Crèche) :

Sieste : Heure début / Heure fin (calcul automatique de la durée).

Change/Soins : Heure, Type (Urine/Selle), Observation (érythème, etc.).

Médiathèque : Prise de photo in-app ou upload galerie. Contrainte : Floutage automatique des visages des autres enfants (Optionnel/Avancé) ou validation manuelle.

3.3 Module 3 : Portail Famille (Interface Parent)
Fil d'actualité (Timeline) : Affichage chronologique inversé des événements de la journée.

Calendrier : Vue mensuelle des événements (Sorties, Fêtes, Réunions).

Messagerie : Chat privé avec l'éducateur référent (possibilité pour l'école de désactiver les réponses hors horaires ouvrés).

4. Architecture et Données
4.1 Modèle Conceptuel de Données (MCD / Diagramme de Classe)
Ce diagramme est le plan de votre base de données.

[ESPACE RÉSERVÉ : DIAGRAMME DE CLASSE]

Entités suggérées :

User (id, email, password_hash, role)

Child (id, first_name, last_name, birth_date, medical_info, parent_id_FK, class_id_FK)

Classroom (id, name, teacher_id_FK)

ActivityLog (id, type [MEAL, NAP, PHOTO], timestamp, value, comment, child_id_FK)

Media (id, url_s3, uploaded_at, activity_log_id_FK)

4.2 Diagrammes de Séquence
Ces diagrammes montrent l'enchaînement technique des actions.

Scénario A : Enregistrement d'un incident (ex: Fièvre)
[ESPACE RÉSERVÉ : DIAGRAMME DE SÉQUENCE - INCIDENT]
Flux à illustrer :

Éducateur sélectionne "Incident Santé" sur l'app.

App envoie POST /api/logs au Backend.

Backend enregistre en BDD.

Backend détecte la criticité "Haute".

Backend déclenche le service de Notification (Firebase).

Téléphone du Parent reçoit la Push Notification.

Scénario B : Consultation du rapport journalier
[ESPACE RÉSERVÉ : DIAGRAMME DE SÉQUENCE - RAPPORT]
Flux à illustrer :

Parent ouvre l'app (Authentification Token JWT).

App demande GET /api/children/{id}/daily-logs.

API vérifie que le Parent est bien lié à l'Enfant (Sécurité).

API requête la BDD pour récupérer repas + siestes + photos.

API renvoie le JSON structuré.

App affiche la Timeline.

5. Contraintes Techniques et Choix Technologiques
5.1 Stack Technique (Préconisation)
Frontend (App & Web) : React Native (pour un code unique iOS/Android) ou React.js (Web Responsive).

Backend (API) : Node.js avec NestJS ou Express (JavaScript/TypeScript).

Base de Données : PostgreSQL (Relationnel indispensable pour lier Enfants/Parents/Classes de manière stricte).

Stockage Fichiers : AWS S3 ou Cloudinary (ne pas stocker les images en Base de Données directement).

5.2 Sécurité (Critique)
Authentification : JWT (JSON Web Tokens) avec expiration courte.

Hachage : Mots de passe hachés avec Bcrypt ou Argon2.

HTTPS : Obligatoire pour tous les échanges.

RGPD : Droit à l'oubli (suppression des photos/données sur demande). Les données de santé sont stockées de manière chiffrée si possible.

5.3 Performance
Les images uploadées doivent être compressées côté serveur pour ne pas dépasser 200Ko (économie de bande passante pour les parents en 4G).

L'API doit pouvoir supporter 50 requêtes concurrentes (pic d'activité à 16h30 lors de la sortie des classes).

6. Gestion de Projet et Livrables
6.1 Méthodologie
Utilisation de la méthode Agile Kanban (via GitHub Projects).

Versioning du code avec Git (Branches : main, develop, feature/nom-fonctionnalité).

6.2 Planning Prévisionnel
Semaine 1 : Conception BDD et Maquettes (Figma).

Semaine 2 : Mise en place du serveur (Backend) et Authentification.

Semaine 3 : Développement fonctionnalité "Gestion Enfants" (CRUD).

Semaine 4 : Développement fonctionnalité "Journalier" (Repas/Siestes).

Semaine 5 : Intégration des notifications et Tests.
