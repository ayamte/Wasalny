package com.wasalny.abonnement.dto;  
  
import com.wasalny.abonnement.entity.TypeAbonnement;  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import java.math.BigDecimal;  
import java.util.UUID;  
  
@Data  
@NoArgsConstructor  
@AllArgsConstructor  
public class TypeAbonnementResponse {  
    private UUID id;  
    private String code;  
    private String nom;  
    private String description;  
    private BigDecimal prix;  
    private Integer dureeJours;  
    private Boolean actif;  
      
    public static TypeAbonnementResponse fromEntity(TypeAbonnement type) {  
        TypeAbonnementResponse response = new TypeAbonnementResponse();  
        response.setId(type.getId());  
        response.setCode(type.getCode());  
        response.setNom(type.getNom());  
        response.setDescription(type.getDescription());  
        response.setPrix(type.getPrix());  
        response.setDureeJours(type.getDureeJours());  
        response.setActif(type.getActif());  
        return response;  
    }  
}