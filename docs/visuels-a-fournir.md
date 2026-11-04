# Visuels du projet

Le README présente principalement l'implémentation et ses vérifications. Les captures de la vidéo illustrent l'interface de la version filmée ; les diagrammes du rapport restent des compléments conceptuels.

## Captures de l'application

Les trois captures sont extraites du fichier `demo.mp4` fourni par l'équipe.

| Capture | Passage de la vidéo | Contenu |
| --- | --- | --- |
| [Recherche de trajets](assets/recherche-trajets.png) | 01:25 | Résultats après une recherche entre deux stations, avec horaires, tarifs et places proposées. |
| [Suivi d'un bus](assets/suivi-bus.png) | 01:44 | Vue « Mes trajets », ticket sélectionné et carte Leaflet. |
| [Administration des horaires](assets/admin-horaires.png) | 00:31 | Liste des configurations horaires et actions de gestion. |

Les PNG conservent la résolution native de la zone sélectionnée : **1920 × 918 pixels**. Le recadrage retire les 100 pixels de la barre du navigateur en haut de la vidéo, sans agrandissement. Les trois images ont été examinées visuellement après extraction.

Ces captures ne constituent pas une nouvelle validation des parcours métier de la version corrigée. Le périmètre des tests est précisé dans [verification.md](verification.md).

## Diagrammes de conception

Les trois images de la [page de conception](conception.md) sont des copies exactes des fichiers fournis, vérifiées par SHA-256.

| Visuel intégré | Fichier original | Référence du rapport | Page PDF |
| --- | --- | --- | --- |
| [Parcours passager](assets/parcours-passager.png) | `activity_diagram_userglobal.png` | Figure 1.8 : Parcours Utilisateur Global | 11 |
| [Achat d'un ticket](assets/sequence-achat-ticket.png) | `sequence_achat.png` | Figure 1.12 : Processus d'Achat de Ticket | 15 |
| [Suivi d'un bus](assets/sequence-suivi-bus.png) | `sequence_suivi.png` | Figure 1.15 : Suivi de Bus en Temps Réel | 18 |

La pagination PDF compte la couverture. Les numéros imprimés correspondants sont 10, 14 et 17. Ces modèles documentent la conception initiale et peuvent différer de l'implémentation actuelle.

## Logo

Le [logo Wasalny](assets/wasalny-logo.png) est une copie inchangée du fichier `logo_complet_SB.png` fourni par l'équipe.
