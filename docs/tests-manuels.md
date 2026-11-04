# Vérifications manuelles

Cette page regroupe les scénarios utiles des anciens guides de démonstration : administration, affectations, conducteur et suivi des bus. Elle utilise les chemins actuels et ne suppose aucun compte, UUID ou jeu de données préchargé. Ces parcours restent à valider ; leurs résultats ne sont pas ajoutés aux tests déjà réussis dans [verification.md](verification.md).

## Préparer une instance de démonstration

Suivre le [démarrage local du README](../README.md#démarrer-en-local). Les contrôles décrits ici modifient les données de cette instance de démonstration.

Prévoir un compte client vérifié, un administrateur, un conducteur, deux stations, une ligne, un bus, une configuration horaire et un trajet du jour. Le premier administrateur n'est pas provisionné automatiquement. Utiliser les identifiants et UUID de cette instance ; les valeurs des anciennes démonstrations ne sont pas des données installées par le projet.

## Scénarios à valider

| Parcours | Manipulation | Résultat à contrôler |
| --- | --- | --- |
| Comptes et profils | Créer un client, vérifier son email dans Mailpit, se connecter et modifier son profil. | Les informations sont conservées après rechargement ; le client ne peut pas accéder au profil d'un tiers ni à l'administration. |
| Bus et stations | Depuis l'administration, créer des stations, une ligne et un bus. | Les données apparaissent après rechargement et les stations de la ligne restent ordonnées. |
| Affectations | Affecter un bus à une ligne puis un conducteur à ce bus sur une période donnée. | Les affectations bus-ligne et bus-conducteur sont cohérentes ; les conflits éventuels sont signalés. |
| Horaires | Définir les horaires et générer les trajets du jour. | Les départs, pauses, arrêts et ressources affectées correspondent à la configuration. |
| Conducteur | Ouvrir `/conducteur/mes-trajets`, consulter le bus et le trajet affectés, démarrer le trajet puis confirmer un passage. | Le conducteur voit ses données et l'avancement du trajet est enregistré. |
| Recherche et ticket | Rechercher un trajet depuis `/trajet/recherche`, sélectionner un résultat et suivre le paiement simulé. | Le ticket émis correspond au client et au trajet ; il apparaît dans `/tickets` et `/mes-trajets`. |
| Localisation | Sélectionner le trajet dans `/mes-trajets`, puis publier deux positions différentes du bus. | Le marqueur de la carte est actualisé via STOMP ; le comportement en cas de déconnexion reste à contrôler. |
| Abonnement | Choisir une offre, suivre la simulation de paiement, consulter puis annuler ou renouveler la souscription. | Les dates, le statut et les événements associés restent cohérents. |
| Notifications | Consulter les notifications après un ticket ou un abonnement. | Elles concernent le bon compte et reflètent les événements effectivement traités. |

Le paiement est simulé. Le changement de mot de passe est désactivé et la suppression d'un profil n'est pas synchronisée avec le compte d'authentification. L'écran de gestion des clients utilise encore des données de démonstration locales ; il ne valide pas les opérations de l'API utilisateurs.

## Repères techniques

- Bus du conducteur : `GET /api/trajets/buses/assigned`.
- Trajets du conducteur : `GET /api/trajets/trips/assigned`.
- Affectation bus-ligne : `POST /api/trajets/bus-assignments`.
- Affectation bus-conducteur : `POST /api/trajets/assignations`.
- Positions : `POST /api/locations`, avec `busId`, `latitude` et `longitude`.
- Connexion SockJS : `/ws`, via l'origine du frontend ; topic STOMP : `/topic/bus/{busId}/location`.

Les API métier nécessitent un JWT valide. Les contrats complets figurent dans les contrôleurs de chaque service. Une [requête HTTP de paiement](../scripts/manual/paiement.http) est conservée comme aide manuelle ; elle n'est pas un test automatisé et n'a pas été exécutée pendant le nettoyage.

Les vérifications automatisées conservées sont les tests JUnit exécutés par Maven et le parcours HTTP [smoke.mjs](../scripts/smoke.mjs), également appelés par la CI.
