package com.wasalny.paiement.service;  
  
import com.wasalny.paiement.config.RabbitMQConfig;  
import com.wasalny.paiement.dto.PaymentEvent;  
import com.wasalny.paiement.entity.*;  
import com.wasalny.paiement.repository.TransactionRepository;  
import lombok.RequiredArgsConstructor;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.amqp.rabbit.core.RabbitTemplate;  
import org.springframework.stereotype.Service;  
import org.springframework.transaction.annotation.Transactional;  
import java.math.BigDecimal;  
import java.util.List;  
import java.util.UUID;  
  
@Service  
@RequiredArgsConstructor  
@Slf4j  
public class PaiementService {  
      
    private final TransactionRepository transactionRepository;  
    private final RabbitTemplate rabbitTemplate;  
    private final ValidationCarteService validationCarteService;  
      
    @Transactional  
    public Transaction initierPaiement(UUID clientId, BigDecimal montant,   
                                      TypePaiement typePaiement, TypeService typeService,  
                                      UUID referenceService, String description,  
                                      InfoPaiementCarte infoCarte) {  
          
        Transaction transaction = new Transaction();  
        transaction.setClientId(clientId);  
        transaction.setMontant(montant);  
        transaction.setTypePaiement(typePaiement != null ? typePaiement : TypePaiement.CARTE_BANCAIRE);  
        transaction.setTypeService(typeService);  
        transaction.setReferenceService(referenceService);  
        transaction.setDescription(description);  
        transaction.setInfoCarte(infoCarte);  
        transaction.setStatut(StatutTransaction.EN_ATTENTE);  
          
        transaction = transactionRepository.save(transaction);  
        log.info("Transaction initiée: {}", transaction.getReference());  
        return transaction;  
    }  
      
    @Transactional  
    public Transaction traiterPaiement(UUID transactionId) {  
        Transaction transaction = transactionRepository.findById(transactionId)  
            .orElseThrow(() -> new RuntimeException("Transaction introuvable"));  
          
        if (transaction.getStatut() != StatutTransaction.EN_ATTENTE) {  
            throw new RuntimeException("Transaction déjà traitée");  
        }  
          
        boolean paiementReussi = false;  
        String motifEchec = null;  
          
        if (transaction.getTypePaiement() == TypePaiement.CARTE_BANCAIRE) {  
            if (!validationCarteService.validerCarte(transaction.getInfoCarte())) {  
                motifEchec = "Informations de carte invalides";  
            } else {  
                paiementReussi = simulerPaiement();  
                if (!paiementReussi) {  
                    motifEchec = "Fonds insuffisants ";  
                }  
            }  
        } else {  
            paiementReussi = true;  
        }  
          
        if (paiementReussi) {  
            transaction.setStatut(StatutTransaction.REUSSIE);  
            transactionRepository.save(transaction);  
            publierEvenementPaiement(transaction, true);  
            log.info("Paiement réussi: {}", transaction.getReference());  
        } else {  
            transaction.setStatut(StatutTransaction.ECHOUEE);  
            transaction.setMotifEchec(motifEchec);  
            transactionRepository.save(transaction);  
            publierEvenementPaiement(transaction, false);  
            log.warn("Paiement échoué: {}", transaction.getReference());  
        }  
          
        return transaction;  
    }  
      
    private boolean simulerPaiement() {  
        return true; // 100% succès pour débuter  
        // return Math.random() < 0.9; // 90% succès pour tests avancés  
    }  
      
    private void publierEvenementPaiement(Transaction transaction, boolean succes) {  
        PaymentEvent event = new PaymentEvent(  
            transaction.getId(),  
            transaction.getReference(),  
            transaction.getClientId(),  
            transaction.getMontant(),  
            transaction.getTypeService(),  
            transaction.getReferenceService(),  
            transaction.getDateTransaction(),  
            succes ? "REUSSIE" : "ECHOUEE",  
            transaction.getMotifEchec()  
        );  
          
        String routingKey = succes   
            ? RabbitMQConfig.PAYMENT_COMPLETED_ROUTING_KEY   
            : RabbitMQConfig.PAYMENT_FAILED_ROUTING_KEY;  
          
        rabbitTemplate.convertAndSend(  
            RabbitMQConfig.PAYMENT_EXCHANGE,  
            routingKey,  
            event  
        );  
          
        log.info("Événement publié: {} pour {}", routingKey, transaction.getReference());  
    }  
      
    public Transaction getTransaction(UUID id) {  
        return transactionRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Transaction introuvable"));  
    }  
      
    public List<Transaction> getTransactionsClient(UUID clientId) {  
        return transactionRepository.findByClientIdOrderByDateTransactionDesc(clientId);  
    }  
}