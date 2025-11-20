package com.wasalny.user.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "conducteur_profiles")
public class ConducteurProfile extends UserProfile {

    @Column(nullable = true)
    private String nom;

    @Column(nullable = true)
    private String prenom;

    @Column(nullable = true)
    private String telephone;

    @Column(name = "numero_permis", unique = true, nullable = true)
    private String numeroPermis;

    @Column(name = "date_embauche")
    private LocalDate dateEmbauche;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutConducteur statut;

    public ConducteurProfile() {
        this.statut = StatutConducteur.ACTIF;
        this.dateEmbauche = LocalDate.now();
    }

    // Getters et Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getNumeroPermis() { return numeroPermis; }
    public void setNumeroPermis(String numeroPermis) { this.numeroPermis = numeroPermis; }

    public LocalDate getDateEmbauche() { return dateEmbauche; }
    public void setDateEmbauche(LocalDate dateEmbauche) { this.dateEmbauche = dateEmbauche; }

    public StatutConducteur getStatut() { return statut; }
    public void setStatut(StatutConducteur statut) { this.statut = statut; }
}
