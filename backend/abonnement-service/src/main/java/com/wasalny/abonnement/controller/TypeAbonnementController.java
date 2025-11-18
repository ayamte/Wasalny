package com.wasalny.abonnement.controller;  
  
import com.wasalny.abonnement.dto.TypeAbonnementRequest;
import com.wasalny.abonnement.dto.TypeAbonnementResponse;
import com.wasalny.abonnement.entity.TypeAbonnement;
import com.wasalny.abonnement.service.AbonnementService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/abonnements/types")
@RequiredArgsConstructor
@Slf4j
public class TypeAbonnementController {  
      
    private final AbonnementService abonnementService;  
      
    /**  
     * Récupérer tous les types d'abonnement disponibles  
     *  
     */  
    @GetMapping  
    public ResponseEntity<List<TypeAbonnementResponse>> getAllTypesAbonnement() {  
        log.info("Récupération de tous les types d'abonnement");  
        List<TypeAbonnement> types = abonnementService.getAllTypesAbonnement();  
        List<TypeAbonnementResponse> responses = types.stream()  
            .map(TypeAbonnementResponse::fromEntity)  
            .collect(Collectors.toList());  
        return ResponseEntity.ok(responses);  
    }  
      
    /**  
     * Récupérer un type d'abonnement par son ID  
     *   
     */  
    @GetMapping("/{id}")  
    public ResponseEntity<TypeAbonnementResponse> getTypeAbonnementById(@PathVariable UUID id) {  
        log.info("Récupération du type d'abonnement: {}", id);  
        TypeAbonnement type = abonnementService.getTypeAbonnementById(id);  
        return ResponseEntity.ok(TypeAbonnementResponse.fromEntity(type));  
    }  
      
    /**  
     * Récupérer les types d'abonnement actifs uniquement  
     *   
     */  
    @GetMapping("/actifs")  
    public ResponseEntity<List<TypeAbonnementResponse>> getTypesAbonnementActifs() {  
        log.info("Récupération des types d'abonnement actifs");  
        List<TypeAbonnement> types = abonnementService.getTypesAbonnementActifs();  
        List<TypeAbonnementResponse> responses = types.stream()  
            .map(TypeAbonnementResponse::fromEntity)  
            .collect(Collectors.toList());  
        return ResponseEntity.ok(responses);  
    }  

    /**
     * Créer un nouveau type d'abonnement
     * Accessible par ADMIN uniquement
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TypeAbonnementResponse> creerTypeAbonnement(
            @RequestBody @Valid TypeAbonnementRequest request) {  
        log.info("Création d'un nouveau type d'abonnement: {}", request.getNom());  
        
        TypeAbonnement typeAbonnement = abonnementService.creerTypeAbonnement(request);  
        return ResponseEntity.status(HttpStatus.CREATED)  
                .body(TypeAbonnementResponse.fromEntity(typeAbonnement));  
    }
}