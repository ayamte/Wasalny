package com.wasalny.ticket.entity;  
  
public enum StatutTicket {  
    ACHETE,  // Ticket acheté, pas encore utilisé 
    UTILISE,  // Ticket validé par le conducteur
    ANNULE,  // Ticket annulé avant utilisation
    REMBOURSE  // Ticket remboursé après annulation
}