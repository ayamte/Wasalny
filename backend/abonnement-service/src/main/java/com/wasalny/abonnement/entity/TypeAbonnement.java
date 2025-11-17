package com.wasalny.abonnement.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.math.BigDecimal;  
import java.time.LocalDate;  
import java.util.List;  
import java.util.UUID;  
  
@Entity  
@Table(name = "type_abonnement")  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class TypeAbonnement {  
      
    @Id  
    @GeneratedValue(strategy = GenerationType.UUID)  
    private UUID id;  
      
    @Column(nullable = false, unique = true, length = 50)  
    private String code;  
      
    @Column(nullable = false, length = 100)  
    private String nom;  
      
    @Column(length = 500)  
    private String description;  
      
    @Column(nullable = false, precision = 10, scale = 2)  
    private BigDecimal prix;  
      
    @Column(nullable = false)  
    private Integer dureeJours;  
      
    @Column(nullable = false)  
    private Boolean actif = true;  
      
    @OneToMany(mappedBy = "typeAbonnement", cascade = CascadeType.ALL, orphanRemoval = true)  
    private List<LigneAutorisee> lignesAutorisees;  
      
    // Méthode métier pour calculer la date de fin  
    public LocalDate calculerDateFin(LocalDate dateDebut) {  
        return dateDebut.plusDays(dureeJours);  
    }  
      
    // Méthode métier pour vérifier si une ligne est autorisée  
    public boolean verifierLigneAutorisee(UUID ligneId) {  
        if (lignesAutorisees == null || lignesAutorisees.isEmpty()) {  
            return false;  
        }  
        return lignesAutorisees.stream()  
            .anyMatch(ligne -> ligne.getLigneId().equals(ligneId));  
    }  
}