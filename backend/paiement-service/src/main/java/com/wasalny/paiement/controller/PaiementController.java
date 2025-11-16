package com.wasalny.paiement.controller;

import com.wasalny.paiement.dto.InitierPaiementRequest;
import com.wasalny.paiement.dto.TransactionResponse;
import com.wasalny.paiement.entity.Transaction;
import com.wasalny.paiement.service.PaiementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/paiements")
@RequiredArgsConstructor
@Slf4j
public class PaiementController {  
      
    private final PaiementService paiementService;  
      
    @PostMapping("/initier")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<TransactionResponse> initierPaiement(
            @Valid @RequestBody InitierPaiementRequest request) {  
        log.info("Initiation paiement pour client: {}", request.getClientId());  
          
        Transaction transaction = paiementService.initierPaiement(  
            request.getClientId(),  
            request.getMontant(),  
            request.getTypePaiement(),  
            request.getTypeService(),  
            request.getReferenceService(),  
            request.getDescription(),  
            request.getInfoCarte()  
        );  
          
        return ResponseEntity.status(HttpStatus.CREATED)  
            .body(TransactionResponse.fromEntity(transaction));  
    }  
      
    @PostMapping("/{id}/traiter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransactionResponse> traiterPaiement(@PathVariable UUID id) {  
        log.info("Traitement paiement: {}", id);  
          
        Transaction transaction = paiementService.traiterPaiement(id);  
          
        return ResponseEntity.ok(TransactionResponse.fromEntity(transaction));  
    }  
      
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable UUID id) {  
        Transaction transaction = paiementService.getTransaction(id);  
        return ResponseEntity.ok(TransactionResponse.fromEntity(transaction));  
    }  
      
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<List<TransactionResponse>> getTransactionsClient(
            @PathVariable UUID clientId) {  
        List<Transaction> transactions = paiementService.getTransactionsClient(clientId);  
        List<TransactionResponse> responses = transactions.stream()  
            .map(TransactionResponse::fromEntity)  
            .collect(Collectors.toList());  
        return ResponseEntity.ok(responses);  
    }  
}