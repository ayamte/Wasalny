package com.wasalny.paiement.entity;  
  
import jakarta.persistence.Column;  
import jakarta.persistence.Embeddable;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
  
@Embeddable  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class InfoPaiementCarte {  
      
    @Column(length = 19)  
    private String numeroCarte;  
      
    @Column(length = 100)  
    private String nomTitulaire;  
      
    @Column(length = 7)  
    private String dateExpiration;  
      
    @Column(length = 3)  
    private String cvv;  
}