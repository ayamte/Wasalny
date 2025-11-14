package com.wasalny.ticket.service;  
  
import com.wasalny.ticket.config.RabbitMQConfig;  
import com.wasalny.ticket.dto.PaymentEvent;
import com.wasalny.ticket.dto.RefundEvent;
import com.wasalny.ticket.dto.TicketEvent;  
import com.wasalny.ticket.entity.Ticket;  
import com.wasalny.ticket.entity.StatutTicket;  
import com.wasalny.ticket.repository.TicketRepository;  
import lombok.RequiredArgsConstructor;  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.amqp.rabbit.core.RabbitTemplate;  
import org.springframework.stereotype.Service;  
import org.springframework.transaction.annotation.Transactional;  
import java.time.LocalDateTime;  
import java.util.List;  
import java.util.Random;  
import java.util.UUID;  
  
@Service  
@RequiredArgsConstructor  
@Slf4j  
public class TicketService {  
      
    private final TicketRepository ticketRepository;  
    private final RabbitTemplate rabbitTemplate;  
      
    @Transactional  
    public Ticket creerTicketDepuisPaiement(PaymentEvent event) {  
        log.info("Création ticket pour transaction: {}", event.getTransactionId());  
          
        // Créer le ticket  
        Ticket ticket = new Ticket();  
        ticket.setNumeroTicket(genererNumeroTicket());  
        ticket.setClientId(event.getClientId());  
        ticket.setTripId(event.getReferenceService());  
        ticket.setNumeroTrip("TRIP-" + event.getReferenceService().toString().substring(0, 8));  
        ticket.setStationFinaleId(UUID.randomUUID()); // À récupérer du trajet-service  
        ticket.setNomStationFinale("Station Finale"); // À récupérer du trajet-service  
        ticket.setDateAchat(LocalDateTime.now());  
        ticket.setPrix(event.getMontant());  
        ticket.setStatut(StatutTicket.ACHETE);  
        ticket.setTransactionId(event.getTransactionId());  
          
        Ticket savedTicket = ticketRepository.save(ticket);  
        log.info("Ticket créé: {}", savedTicket.getNumeroTicket());  
          
        // Publier événement ticket.issued  
        publierEvenementTicketEmis(savedTicket);  
          
        return savedTicket;  
    }  
      
    @Transactional  
    public Ticket validerTicket(String numeroTicket) {  
        Ticket ticket = ticketRepository.findByNumeroTicket(numeroTicket)  
            .orElseThrow(() -> new RuntimeException("Ticket introuvable: " + numeroTicket));  
          
        if (ticket.getStatut() != StatutTicket.ACHETE) {  
            throw new RuntimeException("Ticket ne peut pas être validé. Statut actuel: " + ticket.getStatut());  
        }  
          
        ticket.setStatut(StatutTicket.UTILISE);  
        Ticket savedTicket = ticketRepository.save(ticket);  
        log.info("Ticket validé: {}", numeroTicket);  
          
        return savedTicket;  
    }  
      
    public Ticket getTicket(UUID id) {  
        return ticketRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Ticket introuvable"));  
    }  
      
    public Ticket getTicketByNumero(String numeroTicket) {  
        return ticketRepository.findByNumeroTicket(numeroTicket)  
            .orElseThrow(() -> new RuntimeException("Ticket introuvable: " + numeroTicket));  
    }  
      
    public List<Ticket> getTicketsClient(UUID clientId) {  
        return ticketRepository.findByClientIdOrderByDateAchatDesc(clientId);  
    }  
      
    private String genererNumeroTicket() {  
        String prefix = "TKT";  
        String random = String.format("%06d", new Random().nextInt(1000000));  
        return prefix + "-" + random;  
    }  
      
    private void publierEvenementTicketEmis(Ticket ticket) {  
        TicketEvent event = new TicketEvent(  
            ticket.getId(),  
            ticket.getNumeroTicket(),  
            ticket.getClientId(),  
            ticket.getTripId(),  
            ticket.getNumeroTrip(),  
            ticket.getPrix(),  
            ticket.getDateAchat()  
        );  
          
        rabbitTemplate.convertAndSend(  
            RabbitMQConfig.TICKET_EXCHANGE,  
            RabbitMQConfig.TICKET_ISSUED_ROUTING_KEY,  
            event  
        );  
          
        log.info("Événement ticket.issued publié pour: {}", ticket.getNumeroTicket());  
    }  
    @Transactional  
    public Ticket validerTicket(UUID id) {  
        Ticket ticket = ticketRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Ticket introuvable: " + id));  
        
        if (ticket.getStatut() != StatutTicket.ACHETE) {  
            throw new RuntimeException("Ticket ne peut pas être validé. Statut actuel: " + ticket.getStatut());  
        }  
        
        ticket.setStatut(StatutTicket.UTILISE);  
        Ticket savedTicket = ticketRepository.save(ticket);  
        log.info("Ticket validé: {} (ID: {})", ticket.getNumeroTicket(), id);  
        
        return savedTicket;  
    }
    @Transactional  
    public Ticket annulerTicket(UUID id) {  
        Ticket ticket = ticketRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Ticket introuvable: " + id));  
        
        if (ticket.getStatut() != StatutTicket.ACHETE) {  
            throw new RuntimeException("Ticket ne peut pas être annulé. Statut actuel: " + ticket.getStatut());  
        }  
        
        ticket.setStatut(StatutTicket.ANNULE);  
        Ticket savedTicket = ticketRepository.save(ticket);  
        log.info("Ticket annulé: {} (ID: {})", ticket.getNumeroTicket(), id);  
        
        return savedTicket;  
    }
    @Transactional  
    public Ticket rembourserTicket(UUID id) {  
        log.info("Remboursement du ticket: {}", id);  
        
        Ticket ticket = ticketRepository.findById(id)  
            .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));  
        
        // Vérifier que le ticket est annulé  
        if (ticket.getStatut() != StatutTicket.ANNULE) {  
            throw new RuntimeException("Seuls les tickets annulés peuvent être remboursés");  
        }  
        
        // Changer le statut à REMBOURSE  
        ticket.setStatut(StatutTicket.REMBOURSE);  
        Ticket savedTicket = ticketRepository.save(ticket);  
        
        log.info("Ticket remboursé: {}", ticket.getNumeroTicket());  
        
        // Publier événement de remboursement  
        publierEvenementRemboursement(savedTicket);  
        
        return savedTicket;  
    }  
    
    private void publierEvenementRemboursement(Ticket ticket) {  
        RefundEvent event = new RefundEvent(  
            ticket.getId(),  
            ticket.getNumeroTicket(),  
            ticket.getClientId(),  
            ticket.getPrix(),  
            LocalDateTime.now()  
        );  
        
        rabbitTemplate.convertAndSend(  
            RabbitMQConfig.TICKET_EXCHANGE,  
            RabbitMQConfig.TICKET_REFUNDED_ROUTING_KEY,  
            event  
        );  
        
        log.info("Événement ticket.refunded publié pour: {}", ticket.getNumeroTicket());  
    }
}