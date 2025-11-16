package com.wasalny.abonnement.service;  
  
import com.wasalny.abonnement.config.RabbitMQConfig;  
import com.wasalny.abonnement.dto.AbonnementEvent;  
import com.wasalny.abonnement.dto.AbonnementResponse;  
import com.wasalny.abonnement.dto.PaymentEvent;
import com.wasalny.abonnement.dto.TypeAbonnementRequest;
import com.wasalny.abonnement.entity.Abonnement;
import com.wasalny.abonnement.entity.LigneAutorisee;
import com.wasalny.abonnement.entity.StatutAbonnement;  
import com.wasalny.abonnement.entity.TypeAbonnement;  
import com.wasalny.abonnement.repository.AbonnementRepository;  
import com.wasalny.abonnement.repository.TypeAbonnementRepository;  
import lombok.RequiredArgsConstructor;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.amqp.rabbit.core.RabbitTemplate;  
import org.springframework.scheduling.annotation.Scheduled;  
import org.springframework.stereotype.Service;  
import org.springframework.transaction.annotation.Transactional;  
  
import java.time.LocalDate;  
import java.time.LocalDateTime;  
import java.util.List;  
import java.util.UUID;  
import java.util.stream.Collectors;  
  
@Service  
@RequiredArgsConstructor  
@Slf4j  
public class AbonnementService {  
      
    private final AbonnementRepository abonnementRepository;  
    private final TypeAbonnementRepository typeAbonnementRepository;  
    private final RabbitTemplate rabbitTemplate;  
      
    /**  
     * Créer un abonnement depuis un événement de paiement  
     */  
    @Transactional  
    public Abonnement creerAbonnementDepuisPaiement(PaymentEvent paymentEvent) {  
        log.info("Création d'abonnement depuis paiement: {}", paymentEvent.getTransactionId());  
          
        // Récupérer le type d'abonnement depuis referenceService  
        UUID typeAbonnementId = paymentEvent.getReferenceService();  
        TypeAbonnement typeAbonnement = typeAbonnementRepository.findById(typeAbonnementId)  
            .orElseThrow(() -> new RuntimeException("Type d'abonnement non trouvé: " + typeAbonnementId));  
          
        // Créer l'abonnement  
        Abonnement abonnement = new Abonnement();  
        abonnement.setClientId(paymentEvent.getClientId());  
        abonnement.setNumeroAbonnement(genererNumeroAbonnement());  
        abonnement.setTypeAbonnement(typeAbonnement);  
        abonnement.setDateDebut(LocalDate.now());  
        abonnement.setDateFin(typeAbonnement.calculerDateFin(LocalDate.now()));  
        abonnement.setDateAchat(LocalDateTime.now());  
        abonnement.setStatut(StatutAbonnement.ACTIF);  
        abonnement.setMontantPaye(paymentEvent.getMontant());  
        abonnement.setTransactionId(paymentEvent.getTransactionId());  
          
        // Sauvegarder  
        Abonnement savedAbonnement = abonnementRepository.save(abonnement);  
        log.info("Abonnement créé avec succès: {}", savedAbonnement.getNumeroAbonnement());  
          
        // Publier événement abonnement.issued  
        publierEvenementAbonnement(savedAbonnement, "issued");  
          
        return savedAbonnement;  
    }  
      
    /**  
     * Récupérer un abonnement par ID  
     */  
    public Abonnement getAbonnement(UUID id) {  
        return abonnementRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Abonnement non trouvé: " + id));  
    }  
      
    /**  
     * Récupérer tous les abonnements d'un client  
     */  
    public List<Abonnement> getAbonnementsClient(UUID clientId) {  
        return abonnementRepository.findByClientIdOrderByDateAchatDesc(clientId);  
    }  
      
    /**  
     * Récupérer l'abonnement actif d'un client  
     */  
    public Abonnement getAbonnementActif(UUID clientId) {  
        List<Abonnement> abonnements = abonnementRepository.findByClientIdOrderByDateAchatDesc(clientId);  
        return abonnements.stream()  
            .filter(Abonnement::estValide)  
            .findFirst()  
            .orElse(null);  
    }  
      
    /**  
     * Vérifier si un client peut utiliser une ligne  
     */  
    public boolean peutUtiliserLigne(UUID clientId, UUID ligneId) {  
        Abonnement abonnement = getAbonnementActif(clientId);  
        if (abonnement == null) {  
            return false;  
        }  
        return abonnement.peutUtiliserLigne(ligneId);  
    }  
      
    /**  
     * Renouveler un abonnement  
     */  
    @Transactional  
    public Abonnement renouvelerAbonnement(UUID id) {  
        log.info("Renouvellement de l'abonnement: {}", id);  
          
        Abonnement abonnement = getAbonnement(id);  
        abonnement.renouveler();  
          
        Abonnement savedAbonnement = abonnementRepository.save(abonnement);  
        log.info("Abonnement renouvelé avec succès: {}", savedAbonnement.getNumeroAbonnement());  
          
        // Publier événement abonnement.renewed  
        publierEvenementAbonnement(savedAbonnement, "renewed");  
          
        return savedAbonnement;  
    }  
      
    /**  
     * Annuler un abonnement  
     */  
    @Transactional  
    public Abonnement annulerAbonnement(UUID id) {  
        log.info("Annulation de l'abonnement: {}", id);  
          
        Abonnement abonnement = getAbonnement(id);  
        abonnement.annuler();  
          
        Abonnement savedAbonnement = abonnementRepository.save(abonnement);  
        log.info("Abonnement annulé avec succès: {}", savedAbonnement.getNumeroAbonnement());  
          
        // Publier événement abonnement.cancelled  
        publierEvenementAbonnement(savedAbonnement, "cancelled");  
          
        return savedAbonnement;  
    }  
      
    /**  
     * Vérifier les abonnements expirés (tâche planifiée)  
     */  
    @Scheduled(cron = "0 0 2 * * ?") // Tous les jours à 2h du matin  
    @Transactional  
    public void verifierExpirations() {  
        log.info("Vérification des abonnements expirés");  
          
        List<Abonnement> abonnementsActifs = abonnementRepository.findByStatut(StatutAbonnement.ACTIF);  
          
        for (Abonnement abonnement : abonnementsActifs) {  
            if (abonnement.estExpire()) {  
                abonnement.setStatut(StatutAbonnement.EXPIRE);  
                abonnementRepository.save(abonnement);  
                  
                log.info("Abonnement expiré: {}", abonnement.getNumeroAbonnement());  
                  
                // Publier événement abonnement.expired  
                publierEvenementAbonnement(abonnement, "expired");  
            }  
        }  
    }  
      
    /**  
     * Récupérer tous les types d'abonnement actifs  
     */  
    public List<TypeAbonnement> getTypesAbonnementActifs() {  
        return typeAbonnementRepository.findByActifTrue();  
    }  
      
    /**  
     * Récupérer un type d'abonnement par ID  
     */  
    public TypeAbonnement getTypeAbonnement(UUID id) {  
        return typeAbonnementRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Type d'abonnement non trouvé: " + id));  
    }  
      
    /**  
     * Générer un numéro d'abonnement unique  
     */  
    private String genererNumeroAbonnement() {  
        String prefix = "ABO";  
        String random = String.format("%08d", (int) (Math.random() * 100000000));  
        return prefix + "-" + random;  
    }  
      
    /**  
     * Publier un événement d'abonnement vers RabbitMQ  
     */  
    private void publierEvenementAbonnement(Abonnement abonnement, String eventType) {  
        AbonnementEvent event = new AbonnementEvent(  
            abonnement.getId(),  
            abonnement.getNumeroAbonnement(),  
            abonnement.getClientId(),  
            abonnement.getTypeAbonnement().getId(),  
            abonnement.getTypeAbonnement().getNom(),  
            abonnement.getDateDebut(),  
            abonnement.getDateFin(),  
            abonnement.getMontantPaye(),  
            abonnement.getDateAchat()  
        );  
          
        String routingKey;  
        switch (eventType) {  
            case "issued":  
                routingKey = RabbitMQConfig.ABONNEMENT_ISSUED_ROUTING_KEY;  
                break;  
            case "renewed":  
                routingKey = RabbitMQConfig.ABONNEMENT_RENEWED_ROUTING_KEY;  
                break;  
            case "cancelled":  
                routingKey = RabbitMQConfig.ABONNEMENT_CANCELLED_ROUTING_KEY;  
                break;  
            case "expired":  
                routingKey = RabbitMQConfig.ABONNEMENT_EXPIRED_ROUTING_KEY;  
                break;  
            default:  
                throw new RuntimeException("Type d'événement inconnu: " + eventType);  
        }  
          
        rabbitTemplate.convertAndSend(  
            RabbitMQConfig.ABONNEMENT_EXCHANGE,  
            routingKey,  
            event  
        );  
          
        log.info("Événement abonnement.{} publié pour: {}", eventType, abonnement.getNumeroAbonnement());  
    }  
    public List<TypeAbonnement> getAllTypesAbonnement() {  
        log.info("Récupération de tous les types d'abonnement");  
        return typeAbonnementRepository.findAll();  
    }  
      
    /**  
     * Récupérer un type d'abonnement par son ID  
     */  
    public TypeAbonnement getTypeAbonnementById(UUID id) {  
        log.info("Récupération du type d'abonnement: {}", id);  
        return typeAbonnementRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Type d'abonnement non trouvé: " + id));  
    }

    @Transactional  
public TypeAbonnement creerTypeAbonnement(TypeAbonnementRequest request) {  
    log.info("Création d'un nouveau type d'abonnement: {}", request.getNom());  
      
    // Créer le type d'abonnement  
    TypeAbonnement typeAbonnement = new TypeAbonnement();  
    typeAbonnement.setCode(request.getCode());  
    typeAbonnement.setNom(request.getNom());  
    typeAbonnement.setDescription(request.getDescription());  
    typeAbonnement.setPrix(request.getPrix());  
    typeAbonnement.setDureeJours(request.getDureeJours());  
    typeAbonnement.setActif(request.getActif() != null ? request.getActif() : true);  
      
    // Créer les lignes autorisées  
    if (request.getLignesAutorisees() != null && !request.getLignesAutorisees().isEmpty()) {  
        List<LigneAutorisee> lignes = request.getLignesAutorisees().stream()  
            .map(ligneReq -> {  
                LigneAutorisee ligne = new LigneAutorisee();  
                ligne.setLigneId(ligneReq.getLigneId());  
                ligne.setNomLigne(ligneReq.getNomLigne());  
                ligne.setTypeAbonnement(typeAbonnement);  
                return ligne;  
            })  
            .collect(Collectors.toList());  
          
        typeAbonnement.setLignesAutorisees(lignes);  
    }  
      
    // Sauvegarder  
    TypeAbonnement saved = typeAbonnementRepository.save(typeAbonnement);  
    log.info("Type d'abonnement créé avec succès: {}", saved.getCode());  
      
    return saved;  
}
}