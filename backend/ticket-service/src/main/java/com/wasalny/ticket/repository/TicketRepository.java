package com.wasalny.ticket.repository;  
  
import com.wasalny.ticket.entity.Ticket;  
import com.wasalny.ticket.entity.StatutTicket;  
import org.springframework.data.jpa.repository.JpaRepository;  
import org.springframework.stereotype.Repository;  
import java.util.List;  
import java.util.Optional;  
import java.util.UUID;  
  
@Repository  
public interface TicketRepository extends JpaRepository<Ticket, UUID> {  
    Optional<Ticket> findByNumeroTicket(String numeroTicket);  
    List<Ticket> findByClientIdOrderByDateAchatDesc(UUID clientId);  
    List<Ticket> findByTransactionId(UUID transactionId);  
    List<Ticket> findByStatut(StatutTicket statut);  
}