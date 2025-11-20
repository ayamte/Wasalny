package com.wasalny.user.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "client_profiles")
public class ClientProfile extends UserProfile {

    @Column(nullable = true)
    private String nom;

    @Column(nullable = true)
    private String prenom;

    @Column(nullable = true)
    private String telephone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutClient statut;

    @Column(name = "date_inscription")
    private LocalDate dateInscription;

    public ClientProfile() {
        this.statut = StatutClient.ACTIF;
        this.dateInscription = LocalDate.now();
    }

    // Getters et Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public StatutClient getStatut() { return statut; }
    public void setStatut(StatutClient statut) { this.statut = statut; }

    public LocalDate getDateInscription() { return dateInscription; }
    public void setDateInscription(LocalDate dateInscription) { this.dateInscription = dateInscription; }
}
