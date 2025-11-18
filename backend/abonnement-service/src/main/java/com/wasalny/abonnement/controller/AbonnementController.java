package com.wasalny.abonnement.controller;  
  
import com.wasalny.abonnement.dto.AbonnementResponse;
import com.wasalny.abonnement.entity.Abonnement;
import com.wasalny.abonnement.service.AbonnementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/abonnements")
@RequiredArgsConstructor
@Slf4j
public class AbonnementController {  
      
    private final AbonnementService abonnementService;  
      
    /**
     * Récupérer un abonnement par ID
     * Accessible par CLIENT (son propre abonnement) ou ADMIN
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<AbonnementResponse> getAbonnement(@PathVariable UUID id) {  
        log.info("GET /abonnements/{}", id);  
        Abonnement abonnement = abonnementService.getAbonnement(id);  
        return ResponseEntity.ok(AbonnementResponse.fromEntity(abonnement));  
    }  
      
    /**
     * Récupérer tous les abonnements d'un client
     * Accessible par CLIENT (ses propres abonnements) ou ADMIN
     */
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<List<AbonnementResponse>> getAbonnementsClient(@PathVariable UUID clientId) {  
        log.info("GET /abonnements/client/{}", clientId);  
        List<Abonnement> abonnements = abonnementService.getAbonnementsClient(clientId);  
        List<AbonnementResponse> responses = abonnements.stream()  
            .map(AbonnementResponse::fromEntity)  
            .collect(Collectors.toList());  
        return ResponseEntity.ok(responses);  
    }  
      
    /**
     * Récupérer l'abonnement actif d'un client
     * Accessible par CLIENT (son propre abonnement actif) ou ADMIN
     */
    @GetMapping("/client/{clientId}/actif")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<AbonnementResponse> getAbonnementActif(@PathVariable UUID clientId) {  
        log.info("GET /abonnements/client/{}/actif", clientId);  
        Abonnement abonnement = abonnementService.getAbonnementActif(clientId);  
        if (abonnement == null) {  
            return ResponseEntity.notFound().build();  
        }  
        return ResponseEntity.ok(AbonnementResponse.fromEntity(abonnement));  
    }  
      
    /**
     * Vérifier si un client peut utiliser une ligne
     * PUBLIC - Accessible sans authentification pour validation aux bornes
     */
    @GetMapping("/client/{clientId}/peut-utiliser-ligne/{ligneId}")
    public ResponseEntity<Boolean> peutUtiliserLigne(  
            @PathVariable UUID clientId,  
            @PathVariable UUID ligneId) {  
        log.info("GET /abonnements/client/{}/peut-utiliser-ligne/{}", clientId, ligneId);  
        boolean peutUtiliser = abonnementService.peutUtiliserLigne(clientId, ligneId);  
        return ResponseEntity.ok(peutUtiliser);  
    }  
      
    /**
     * Renouveler un abonnement
     * Accessible par CLIENT (son propre abonnement)
     */
    @PutMapping("/{id}/renouveler")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<AbonnementResponse> renouvelerAbonnement(@PathVariable UUID id) {  
        log.info("PUT /abonnements/{}/renouveler", id);  
        Abonnement abonnement = abonnementService.renouvelerAbonnement(id);  
        return ResponseEntity.ok(AbonnementResponse.fromEntity(abonnement));  
    }  
      
    /**
     * Annuler un abonnement
     * Accessible par CLIENT (son propre abonnement) ou ADMIN
     */
    @PutMapping("/{id}/annuler")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<AbonnementResponse> annulerAbonnement(@PathVariable UUID id) {  
        log.info("PUT /abonnements/{}/annuler", id);  
        Abonnement abonnement = abonnementService.annulerAbonnement(id);  
        return ResponseEntity.ok(AbonnementResponse.fromEntity(abonnement));  
    } 
     
}