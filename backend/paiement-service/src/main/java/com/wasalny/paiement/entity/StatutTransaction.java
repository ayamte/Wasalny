package com.wasalny.paiement.entity;  
  
public enum StatutTransaction {  
    EN_ATTENTE,    // Paiement initié, en cours de traitement  
    REUSSIE,       // Paiement confirmé  
    ECHOUEE        // Paiement refusé  
}