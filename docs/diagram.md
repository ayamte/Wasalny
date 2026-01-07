```mermaid
graph TD
  User --> UserProfile
  UserProfile --> Client
  UserProfile --> Conducteur
  UserProfile --> Admin
  Client --> Ticket
  Ticket --> Trajet
  Client --> Abonnement
  Abonnement --> TypeAbonnement
  TypeAbonnement --> Ligne
  Ligne --> Trip
  Trip --> Station
  Bus --> Trip
  Bus --> Location
  User --> Notification
