package com.wasalny.abonnement.entity;  
  
public enum StatutAbonnement {  
    ACTIF,    // Abonnement en cours d'utilisation  
    EXPIRE,   // Date de fin dépassée  
    ANNULE    // Annulé par le client ou l'admin  
}