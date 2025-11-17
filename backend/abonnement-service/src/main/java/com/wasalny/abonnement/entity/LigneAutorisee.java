package com.wasalny.abonnement.entity;  
  
import jakarta.persistence.*;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.util.UUID;  
  
@Entity  
@Table(name = "ligne_autorisee")  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class LigneAutorisee {  
      
    @Id  
    @GeneratedValue(strategy = GenerationType.UUID)  
    private UUID id;  
      
    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "type_abonnement_id", nullable = false)  
    private TypeAbonnement typeAbonnement;  
      
    @Column(nullable = false)  
    private UUID ligneId;  
      
    @Column(length = 100)  
    private String nomLigne;  
}